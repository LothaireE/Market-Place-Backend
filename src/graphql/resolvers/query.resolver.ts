import { QueryResolvers, ProductFilterInput, PaginationInput, SellerProfile } from '../generated/types.generated';
import { users, products, sellerProfiles, favorites, categories, productCategories, orders  } from '../../db/schema/';
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

        userOrders: async (_: any, __: any, context: GraphQLContext) => {
            const userId = context.token?.subject;

            if (!userId) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
            });

            const items = await context.db.select().from(orders).where(eq(orders.buyerId, userId)).orderBy(desc(orders.createdAt))

            const [{total}] = await context.db.select({total: count()}).from(orders).where(eq(orders.buyerId, userId))
            return {items, total: Number(total)} 
        },

        userPendingOrders: async (_: any, __: any, context: GraphQLContext) => {
            const userId = context.token?.subject;

            if (!userId) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
            });

            const items = await context.db.select().from(orders).where(and(eq(orders.buyerId, userId), eq(orders.status , "PENDING"))).orderBy(desc(orders.createdAt))

            const [{total}] = await context.db.select({total: count()}).from(orders).where(eq(orders.buyerId, userId))
            return {items, total: Number(total)} 
        },

        allOrders: (_: any, __: any, context: GraphQLContext) => 
            context.db.select().from(orders),

        ordersByIds: async (_: any, args: { ids: string[] }, context: GraphQLContext) => {
            if (!args.ids || args.ids.length === 0) return [];
            
            return context.db.select().from(orders)
                .where(inArray(orders.id, args.ids));
        },

        singleOrder: (_: any, args: any, context: GraphQLContext) => 
            context.db.query.orders.findFirst({
                where: eq(orders.id, args.id)
            }),

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

        sellerSales: async  (_:any, __:any, context: GraphQLContext) => {
            const userId = context.token?.subject;
            if (!userId) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
            });

            const seller = await context.db.query.sellerProfiles.findFirst({
                where: eq(sellerProfiles.userId, userId)
            })

            if(!seller) return { item: [], total: 0 }

            const items = await context.db.select().from(orders).where(eq(orders.sellerId, seller.id)).orderBy(desc(orders.createdAt))
            const [{total}] = await context.db.select({total: count()}).from(orders).where(eq(orders.sellerId, seller.id))

            return {items, total: Number(total)} 

        },
        product: (_: any, args: { id: string }, context: GraphQLContext) => 
            context.db.query.products.findFirst({
                where: eq(products.id, args.id)
            }),

        products: async (_: any, args: {filter?: ProductFilterInput, pagination?: PaginationInput}, context: GraphQLContext) => {
            const page = Math.max(1, args.pagination?.page ?? 1);
            const pageSize = Math.min(100, Math.max(1, args.pagination?.pageSize ?? MAX_PAGE_SIZE));
            const offset = (page - 1) * pageSize;

            const idsFilter = args.filter?.ids && args.filter?.ids.length > 0
                ? inArray(
                    products.id,
                    args.filter.ids
                )
                : undefined;

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
                idsFilter,
                categoryFilter,
                conditionFilter,
                args.filter?.minPrice !== undefined ? gte(products.unitPrice, args.filter.minPrice ?? MIN_PRICE) : undefined,
                args.filter?.maxPrice !== undefined ? lte(products.unitPrice, args.filter.maxPrice ?? MAX_PRICE) : undefined,
                args.filter?.size ? eq(products.size, args.filter.size) : undefined,
                args.filter?.color ? eq(products.color, args.filter.color) : undefined,
                args.filter?.search ? or(
                        ilike(products.name, `%${args.filter.search}%`),
                        ilike(products.description, `%${args.filter.search}%`)
                    ) : undefined
                    // args.filter?.q // client writes its own query
            );      


            const orderBy = args.pagination?.sortBy === 'DATE' ?
                (args.pagination?.sortDirection === 'ASC' ? asc(products.createdAt): desc(products.createdAt))
                : (args.pagination?.sortDirection === 'ASC' ? asc(products.unitPrice): desc(products.unitPrice))
            
            const productsQuery = await context.db.select().from(products)
                .where(where)
                .orderBy(orderBy)
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

        productsByIds: async (_: any, args: { ids: string[] }, context: GraphQLContext) => {
            if (!args.ids || args.ids.length === 0) return [];
            
            return context.db.select().from(products)
                .where(inArray(products.id, args.ids));
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
                (args.pagination?.sortDirection === 'ASC' ? asc(products.unitPrice): desc(products.unitPrice))
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
