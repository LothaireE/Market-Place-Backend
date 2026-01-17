import { QueryResolvers, ProductFilterInput, PaginationInput } from '../generated/types.generated';
import { users, products, sellerProfiles, favorites, categories, productCategories  } from '../../db/schema/';
import { eq, or, ilike, and, gte, lte, asc, desc, count, inArray } from 'drizzle-orm';
import { GraphQLContext } from '../../types/context.type';
import { MAX_PRICE, MIN_PRICE, MAX_PAGE_SIZE } from '../../config/config';
import { GraphQLError } from 'graphql';
import { ERROR_MESSAGES } from '../../constants/messages';
import { isSeller } from '../../utils/utils';


export const queryResolvers = <QueryResolvers>{
    Query: {
        user: (_: any, __: any, context: GraphQLContext) => {
            const userId = context.token?.subject;
            if (!userId) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
            });
            return context.db.query.users.findFirst({
                where: eq(users.id, userId)
            })
        },

        users: (_: any, __: any, context: GraphQLContext) =>
            context.db.select().from(users),

        sellerProfile: (_:any, __: any, context: GraphQLContext) => {
            const userId = context.token?.subject;
            if (!userId) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
            });

            return context.db.query.sellerProfiles.findFirst({
                where: eq(sellerProfiles.userId, userId)
            })
        },            

        sellerProfiles: (_:any, __:any, context: GraphQLContext) =>
            context.db.select().from(sellerProfiles),

        product: (_: any, args: { id: string }, context: GraphQLContext) => 
            context.db.query.products.findFirst({
                where: eq(products.id, args.id)
            }),

        products: async (_: any, args: {filter?: ProductFilterInput, pagination?: PaginationInput}, context: GraphQLContext) => {
            const page = Math.max(1, args.pagination?.page ?? 1);
            const pageSize = Math.min(100, Math.max(1, args.pagination?.pageSize ?? MAX_PAGE_SIZE));
            const offset = (page - 1) * pageSize;

            const categoryFilter = args.filter?.category
                ? inArray(
                    products.id,
                    context.db
                        .select({ productId: productCategories.productId }) 
                        .from(productCategories)
                        .where(eq(productCategories.categoryId, args.filter.category))
                )
                : undefined;

            
            const conditionFilter = args.filter?.condition &&  args.filter?.condition.length > 0
                ? inArray(
                    products.condition,
                    args.filter.condition
                )
                : undefined;

            const where = and(
                categoryFilter,
                conditionFilter,
                args.filter?.minPrice !== undefined ? gte(products.price, args.filter.minPrice ?? MIN_PRICE) : undefined,
                args.filter?.maxPrice !== undefined ? lte(products.price, args.filter.maxPrice ?? MAX_PRICE) : undefined,
                args.filter?.size ? eq(products.size, args.filter.size) : undefined,
                args.filter?.color ? eq(products.color, args.filter.color) : undefined,
                args.filter?.search ? or(
                        ilike(products.name, `%${args.filter.search}%`),
                        ilike(products.description, `%${args.filter.search}%`)
                    ) : undefined
                    // args.filter?.q // client writes its own query
            );      


            const order = args.pagination?.sortBy === 'DATE' ?
                (args.pagination?.sortDirection === 'ASC' ? asc(products.createdAt): desc(products.createdAt))
                : (args.pagination?.sortDirection === 'ASC' ? asc(products.price): desc(products.price))
            
            const productsQuery = await context.db.select().from(products)
                .where(where)
                .orderBy(order)
                .limit(pageSize)
                .offset(offset);

            const productsCount = await context.db 
                .select({ count: count(products.id) })
                .from(products)
                .where(where);

            const totalProducts = Number(productsCount[0]?.count ?? 0)
         
            const totalPages = Math.ceil(totalProducts / pageSize);

            return { items: productsQuery, totalPages, totalProducts, currentPage: page  };
        },

        sellerProducts: async (_: any, args:any, context: GraphQLContext) => {
            if (!context.token) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
            });
            const seller = await isSeller(context.token.subject);
            if (!seller) throw new GraphQLError('Forbidden', {
                extensions: { code: 'FORBIDDEN', error: ERROR_MESSAGES.SELLER.NOT_FOUND }
            })
            const order = args.pagination?.sortBy === 'PRICE' ?
                (args.pagination?.sortDirection === 'ASC' ? asc(products.price): desc(products.price))
                : (args.pagination?.sortDirection === 'ASC' ? asc(products.createdAt): desc(products.createdAt))


            return context.db.select().from(products)
                .where(eq(products.sellerId, seller.id)).orderBy(order);
                
        },

        favorites: async (_:any, __:any, context: GraphQLContext) =>{
            if (!context.token) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
            });
            const userId = context.token?.subject;

            return context.db.query.favorites.findMany({
                where: eq(favorites.userId, userId)
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
