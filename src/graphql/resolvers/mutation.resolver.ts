    import {
    MutationResolvers,
    CreateProductInput,
    UpdateProductInput,
    SellerProfileInput,
    UpdateSellerProfileInput,
    FavoritesInput,
} from '../generated/types.generated';
import { products, sellerProfiles, favorites, categories, productCategories } from '../../db/schema';
import { firstElem } from '../../utils/utils';
import { eq, and } from 'drizzle-orm';
import { GraphQLContext } from '../../types/context.type';
import { ERROR_MESSAGES } from '../../constants/messages';
import { GraphQLError } from 'graphql';
import { JWTPayload } from '../../types/user';
import db from '../../db/db';

async function isSeller(token:JWTPayload) {

        const {userId} = token
        if (!userId) throw new GraphQLError('Forbidden', {
            extensions: { code: 'FORBIDDEN', error: ERROR_MESSAGES.USER.NOT_FOUND }
        });

        const sellerProfile = await db.query.sellerProfiles.findFirst({
            where: eq(sellerProfiles.userId, userId)
        })
        if (!sellerProfile) throw new GraphQLError('Forbidden', {
            extensions: { code: 'FORBIDDEN', error: ERROR_MESSAGES.SELLER.NOT_FOUND }
        })
        return true;
}

export const mutationResolvers = <MutationResolvers>{
    Mutation: {
        createProduct: async (
            _: any,
            args: { newProduct: CreateProductInput }, //Book },
            context: GraphQLContext
        ) => {
            // const userId = context.token?.userId;
            // const { token } = context;
            const seller = context.token && await isSeller(context.token); // isSeller(context.token as JWTPayload);
            console.log('seller ===> ', seller);
            if (seller) {
                const result = await context.db
                    .insert(products)
                    .values(args.newProduct)
                    .returning();
                return firstElem(result);
            }
            // const result = await context.db
            //     .insert(products)
            //     .values(args.newProduct)
            //     .returning();
            // return firstElem(result);
        },

        updateProduct: async (
            _:any,
            args: {productUpdate : UpdateProductInput}, //{ productUpdates: Partial<createProductInput> & { id: string } },
            context: GraphQLContext
        )=>{
            const result = await context.db
                .update(products)
                .set(args.productUpdate)
                .where(eq(products.id, args.productUpdate.id))
                .returning();
            return firstElem(result);
        },

        deleteSingleProduct: async (
            __: any,
            args: { id: string },
            context: GraphQLContext
        )=>{
            const { token } = context;
            if (!token) throw new Error(ERROR_MESSAGES.AUTH.UNAUTHORIZED);
            const result = await context.db
                .delete(products)
                .where(eq(products.id, args.id))
                .returning();
            return firstElem(result);
        },
        deleteAllProducts: async (
            _: any,
            __: any,
            context: GraphQLContext
        )=>{
            const { token } = context;
            if (!token) throw new Error(ERROR_MESSAGES.AUTH.UNAUTHORIZED);
            const result = await context.db
                .delete(products)
                .returning();
            return firstElem(result);
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
            return firstElem(result);
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
            return firstElem(result);
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
            return firstElem(result);
        },

        addToFavorites: async (
            _: any,
            args: { favoriteInput: FavoritesInput },
            context: GraphQLContext
        ) => {
            const result = await context.db
                .insert(favorites)
                .values(args.favoriteInput) // 
                .returning();
            return firstElem(result);
        },
        
        removeFromFavorites: async (
            _: any,
            args: { userId: string, productId: string},
            context: GraphQLContext
        ) => {
            const result = await context.db
                .delete(favorites)
                .where(and (eq(favorites.userId, args.userId), eq(favorites.productId, args.productId)))
                .returning();
            return firstElem(result);
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
            return firstElem(result);
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
            return firstElem(result);
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
            return firstElem(result);
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
            return firstElem(result);
        }
    }
};


// if (!userId) throw new GraphQLError('Forbidden', {
//                 extensions: { code: 'FORBIDDEN', error: ERROR_MESSAGES.USER.NOT_FOUND }
//             });

//             const sellerProfile = await context.db.query.sellerProfiles.findFirst({
//                 where: eq(sellerProfiles.userId, userId)
//             })
//             if (!sellerProfile) throw new GraphQLError('Forbidden', {
//                 extensions: { code: 'FORBIDDEN', error: ERROR_MESSAGES.SELLER.NOT_FOUND }
//             })