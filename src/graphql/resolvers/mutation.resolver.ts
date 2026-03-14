    import {
    MutationResolvers,
    SellerProfileInput,
    UpdateSellerProfileInput,
    FavoritesInput,
} from '../generated/types.generated';
import { products, sellerProfiles, favorites, categories, productCategories, fulfillmentMethodEnum } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { GraphQLContext } from '../../types/context.type';
import { ERROR_MESSAGES } from '../../constants/messages';
import { GraphQLError } from 'graphql';
import { isSeller } from '../../utils/utils';
import { notFound } from '../errors';
import { OrderService } from '../../product/services/order.services';
import UserModel from '../../auth/models/user.model';


export const mutationResolvers = <MutationResolvers>{
    Mutation: {
        deleteSingleProduct: async (
            _: any,
            args: { id: string },
            context: GraphQLContext
        )=>{
            const { token } = context;
            if (!token) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.UNAUTHORIZED }
            });

            const seller = await isSeller(token.subject);
            if (!seller) throw new GraphQLError('Forbidden', {
                extensions: { code: 'FORBIDDEN', error: ERROR_MESSAGES.SELLER.NOT_FOUND }
            });
            
            const result = await context.db
                .delete(products)
                .where(and(eq(products.id, args.id), eq(products.sellerId, seller.id)))
                .returning();
            
            if (result.length === 0) throw notFound(ERROR_MESSAGES.PRODUCT.NOT_FOUND);

            return result[0];
        },

        deleteAllProducts: async (
            _: any,
            __: any,
            context: GraphQLContext
        )=>{
            const { token } = context;
            if (!token) throw new Error(ERROR_MESSAGES.AUTH.UNAUTHORIZED);
            return 
            const result = await context.db
                .delete(products)
                .returning();
            return result[0];
        },

        createSellerProfile: async (
            _: any,
            args: { newSellerProfile: SellerProfileInput },
            context: GraphQLContext
        ) => {
            if (!context.token) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
            });

            const userId = context.token?.subject;

            const newSellerProfileValues = { ...args.newSellerProfile, userId };

            const result = await context.db
                .insert(sellerProfiles)
                .values(newSellerProfileValues)
                .returning();
            return result[0];
        },

        updateSellerProfile: async (
            _: any,
            args: { sellerProfileUpdates: UpdateSellerProfileInput },
            context: GraphQLContext
        ) => {

            if (!context.token) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
            });

            const userId = context.token?.subject;
            const isSeller = await context.db.query.sellerProfiles.findFirst({
                where: eq(sellerProfiles.userId, userId)
            });

            if (!isSeller) {
                throw new GraphQLError('Seller profile not found', {
                    extensions: { code: 'NOT_FOUND', error: ERROR_MESSAGES.SELLER.NOT_FOUND }
                });
            }

            const result = await context.db
                .update(sellerProfiles)
                .set(args.sellerProfileUpdates)
                .where(eq(sellerProfiles.id, isSeller.id))
                .returning();
            return result[0];
        },
        deleteSellerProfile: async (
            _: any,
            args: { id: string },
            context: GraphQLContext
        ) => {
            const { token } = context;
            if (!token) throw new Error(ERROR_MESSAGES.AUTH.UNAUTHORIZED);
            const result = await context.db
                .delete(sellerProfiles)
                .where(eq(sellerProfiles.id, args.id))
                .returning();
            return result[0];
        },

        addToFavorites: async (
            _: any,
            args: { productId: string },
            context: GraphQLContext
        ) => {
            console.log('ADD TO FAVORITE QUERY', );
            if (!context.token) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
            });
            const userId = context.token?.subject;
            try {
                const result = await context.db
                    .insert(favorites)
                    .values({ userId, productId: args.productId })
                    .returning();
                return result[0];
            } catch (err: any) {
                console.error('addToFavorites error:', {
                    message: err.message,
                    code: err.code,
                    detail: err.detail,
                    stack: err.stack
                });
                throw new GraphQLError('Failed to add favorite', {
                    extensions: { code: 'INTERNAL_SERVER_ERROR', error: err.message }
                });
            }

            // const result = await context.db
            //     .insert(favorites)
            //     .values({userId, productId:args.productId}) // 
            //     .returning();
            // return result[0];
        },
        
        removeFromFavorites: async (
            _: any,
            args: { productId: string},
            context: GraphQLContext
        ) => {
            console.log('REMOVE FROM FAVORITE MUTATION', );
            if (!context.token) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
            });
            const userId = context.token?.subject;
            try {
                const result = await context.db
                    .delete(favorites)
                    .where(and (eq(favorites.userId, userId), eq(favorites.productId, args.productId)))
                    .returning();
                return result[0];
            } catch (err : any) {
                console.error('addToFavorites error:', {
                    message: err.message,
                    code: err.code,
                    detail: err.detail,
                    stack: err.stack
                });
                throw new GraphQLError('Failed to add favorite', {
                    extensions: { code: 'INTERNAL_SERVER_ERROR', error: err.message }
                });
            }
            // const result = await context.db
            //     .delete(favorites)
            //     .where(and (eq(favorites.userId, userId), eq(favorites.productId, args.productId)))
            //     .returning();
            // return result[0];
        },


        createCategory: async (
            _: any,
            args: { name: string },
            context: GraphQLContext
        ) => {
            const result = await context.db
                .insert(categories)
                .values({ name: args.name })
                .returning();
            return result[0];
        },
        
        deleteCategory: async (
            _: any,
            args: { id: string },
            context: GraphQLContext
        ) => {
            const result = await context.db
                .delete(categories)
                .where(eq(categories.id, args.id))
                .returning();
            return result[0];
        },

        addToProductCategories: async (
            _: any,
            args: { productId: string, categoryId: string },
            context: GraphQLContext
        ) => {
            const result = await context.db
                .insert(productCategories)
                .values({ productId: args.productId, categoryId: args.categoryId })
                .returning();
            return result[0];
        },

        removeFromProductCategories: async (
            _: any,
            args: { id: string },
            context: GraphQLContext
        ) => {
            const result = await context.db
                .delete(productCategories)
                .where(eq(productCategories.productId, args.id))
                .returning();
            return result[0];
        },

        cancelOrder: async (
            _: any,
            args: { orderId: string },
            context: GraphQLContext
        )=> {
            if (!context.token) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
            });
            
            const userId = context.token?.subject;

            const result = await OrderService.cancelOrder(userId, args.orderId)

            return result
        },

        cancelMultipleOrders: async (
            _: any,
            args: { orderIds: string[] },
            context: GraphQLContext
        )=> {

            if (!context.token) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
            });
            
            const userId = context.token?.subject;

            const result = await OrderService.cancelMultipleOrders(userId, args.orderIds)

            return result
        },

        cancelAllOrders: async (
            _: any,
            __: any,
            ___: any 
        )=> {

            const result = await OrderService.cancelAllOrders()

            return result
        },

        confirmPayment: async (
            _: any,
            args: { orderIds: string[], paymentIntentId: string},
            context: GraphQLContext
        )=> {
            if (!context.token) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
            });

            const userId = context.token?.subject;

            const result = await OrderService.confirmPayment(userId, args.orderIds, args.paymentIntentId)

            return result
        },

        createCheckout: async (
            _: any,
            args: { productIds: string[], fulfillmentMethod: "MEETUP" | "SHIPPING" },
            context: GraphQLContext
        )=> {

            if (!context.token) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
            });

            const userId = context.token?.subject;
            
            const result = await OrderService.createCheckout(
                userId,
                args.productIds,
                args.fulfillmentMethod
            )

            const user = await UserModel.findById(userId)

            const customerEmail = user?.email 

            const amount = result.orders.reduce((sum: number, order: any)=> sum + order.totalAmount, 0)

            const clientSecret = await OrderService.createPaymentIntent(amount, customerEmail)

            return {orders: result.orders, stripePublicKey: process.env.STRIPE_PUBLIC_KEY, clientSecret}
        }

    }
};



        // clearFavorites: async (
        //     _: any,
        //     __: any,
        //     context: GraphQLContext
        // )=>{

        //     if (!context.token) throw new GraphQLError('Unauthorized', {
        //         extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.INVALID_TOKEN }
        //     });

        //     const userId = context.token?.subject;

        //     const result = await context.db
        //         .delete(favorites)
        //         .where(eq(favorites.userId, userId))
        //         .returning();
        //     return result[0];
        // },