import { QueryResolvers, ProductFilterInput, PaginationInput } from '../generated/types.generated';
import { users, products, sellerProfiles, favorites, categories  } from '../../db/schema/';
import { eq, or, ilike, and, gte, lte, asc, desc, count } from 'drizzle-orm';
import { GraphQLContext } from '../../types/context.type';
import { MAX_PRICE, MIN_PRICE, MAX_PAGE_SIZE } from '../../config/config';
import { firstElem } from '../../utils/utils';
import { GraphQLError } from 'graphql';
import { ERROR_MESSAGES } from '../../constants/messages';



export const queryResolvers = <QueryResolvers>{
    Query: {
        user: (_: any, args: { id: string }, context: GraphQLContext) => 
            context.db.query.users.findFirst({
                where: eq(users.id, args.id)
            }),

        users: (_: any, __: any, context: GraphQLContext) =>
            context.db.select().from(users),

        sellerProfile: (_:any, args: { id : string }, context: GraphQLContext) =>
            context.db.query.sellerProfiles.findFirst({
                where: eq(sellerProfiles.id, args.id)
            }),

        sellerProfiles: (_:any, __:any, context: GraphQLContext) =>
            context.db.select().from(sellerProfiles),

        product: (_: any, args: { id: string }, context: GraphQLContext) => 
            context.db.query.products.findFirst({
                where: eq(products.id, args.id)
            }),
        // products: (_: any, __: any, context: GraphQLContext) => {
        //     return context.db.select().from(products);
        // },
        products: async (_: any, args: {filter: ProductFilterInput, pagination: PaginationInput}, context: GraphQLContext) => {
            const page = Math.max(1, args.pagination.page ?? 1);
            const pageSize = Math.min(100, Math.max(1, args.pagination.pageSize ?? MAX_PAGE_SIZE));
            const offset = (page - 1) * pageSize;

            const where = and(
                args.filter?.category ? eq(categories.name, args.filter.category) : undefined, // à verifier
                // args.filter?.category ? eq(products.category, args.filter.category) : undefined,
                args.filter?.minPrice !== undefined ? gte(products.price, args.filter.minPrice ?? MIN_PRICE) : undefined,
                args.filter?.maxPrice !== undefined ? lte(products.price, args.filter.maxPrice ?? MAX_PRICE) : undefined,
                args.filter?.size ? eq(products.size, args.filter.size) : undefined,
                args.filter?.condition ? eq(products.condition, args.filter.condition) : undefined,
                args.filter?.color ? eq(products.color, args.filter.color) : undefined,
                args.filter?.search ? or(
                    ilike(products.name, `%${args.filter.search}%`),
                    ilike(products.description, `%${args.filter.search}%`)
                ) : undefined
            );

            const order = args.pagination?.sortBy === 'DATE' ?
                (args.pagination?.sortDirection === 'ASC' ? asc(products.createdAt): desc(products.createdAt))
                : (args.pagination?.sortDirection === 'ASC' ? asc(products.price): desc(products.price))
            
            const productsQuery = await context.db.select().from(products)
                .where(where)
                .orderBy(order)
                .limit(pageSize)
                .offset(offset);

            const productsCount = await context.db // ça ici c'est le nombre total de products
                .select({ count: count(products.id) }) // .select({ count: count(products.id) })
                .from(products)
                .where(where);

         
            const totalPages = Math.ceil((Number(firstElem(productsCount)?.count ?? 0)) / pageSize);

            return { products: productsQuery, totalPages: totalPages, totalProducts: Number(firstElem(productsCount)?.count ?? 0), currentPage: page  };
        },

        favorites: async (_:any, args:{id: string}, context: GraphQLContext) =>{
            if (!context.token) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
            });
            // console.log('context ===> ', context?.token);
            // const { userId } = context.token;
            // if (!userId) throw new GraphQLError('Forbidden', {
            //     extensions: { code: 'FORBIDDEN', error: ERROR_MESSAGES.USER.NOT_FOUND }
            // });

            // const sellerProfile = await context.db.query.sellerProfiles.findFirst({
            //     where: eq(sellerProfiles.userId, userId)
            // })
            // if (!sellerProfile) throw new GraphQLError('Forbidden', {
            //     extensions: { code: 'FORBIDDEN', error: ERROR_MESSAGES.SELLER.NOT_FOUND }
            // })

            return context.db.query.favorites.findMany({
                where: eq(favorites.userId, args.id)
            })
        },
        categories: (_:any, __:any, context: GraphQLContext) =>
            context.db.select().from(categories),
        
        category: (_:any, args: { id : string }, context: GraphQLContext) => 
            context.db.query.categories.findFirst({
                where: eq(categories.id, args.id)
            })
        
    }
};
