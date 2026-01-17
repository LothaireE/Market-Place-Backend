    import {
    MutationResolvers,
    SellerProfileInput,
    UpdateSellerProfileInput,
    FavoritesInput,
} from '../generated/types.generated';
import { products, sellerProfiles, favorites, categories, productCategories } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { GraphQLContext } from '../../types/context.type';
import { ERROR_MESSAGES } from '../../constants/messages';
import { GraphQLError } from 'graphql';
import { isSeller } from '../../utils/utils';
import { notFound } from '../errors';


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
            const result = await context.db
                .insert(sellerProfiles)
                .values(args.newSellerProfile)
                .returning();
            return result[0];
        },

        updateSellerProfile: async (
            _: any,
            args: { sellerProfileUpdates: UpdateSellerProfileInput },
            context: GraphQLContext
        ) => {
            const result = await context.db
                .update(sellerProfiles)
                .set(args.sellerProfileUpdates)
                .where(eq(sellerProfiles.id, args.sellerProfileUpdates.id))
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
        }
    }
};
