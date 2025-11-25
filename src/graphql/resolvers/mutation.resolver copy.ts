    import {
    MutationResolvers,
    // CreateProductInput,
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
import { isSeller } from '../../utils/utils';
import { notFound } from '../errors';


export const mutationResolvers = <MutationResolvers>{
    Mutation: {
        // createProduct: async (
        //     _: any,
        //     args: { newProduct: CreateProductInput }, //Book },
        //     context: GraphQLContext
        // ) => {

        //     const { token } = context;
        //     if (!token) throw unauth(ERROR_MESSAGES.AUTH.UNAUTHORIZED);

        //     const seller = await isSeller(token as JWTPayload);

        //     if (!seller) throw forbid(ERROR_MESSAGES.SELLER.NOT_FOUND)
            

        //     const newProductValues = {
        //         name: args.newProduct.name,
        //         description: args.newProduct.description ?? null,
        //         price: args.newProduct.price,
        //         size: args.newProduct.size ?? null,
        //         imagesUrl: args.newProduct.imagesUrl ?? [],
        //         condition: args.newProduct.condition ?? "GOOD",
        //         sellerId: seller.id, 
        //     };

        //     const result = await context.db
        //         .insert(products)
        //         .values(newProductValues)
        //         .returning();
        //     return firstElem(result);
        // },

        updateProduct: async (
            _:any,
            args: {productUpdate : UpdateProductInput}, //{ productUpdates: Partial<createProductInput> & { id: string } },
            context: GraphQLContext
        )=>{
            const { token } = context;
            if (!token) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.UNAUTHORIZED }
            });
            
            const seller = await isSeller(token as JWTPayload);
            if (!seller) throw new GraphQLError('Forbidden', {
                extensions: { code: 'FORBIDDEN', error: ERROR_MESSAGES.SELLER.NOT_FOUND }
            });

            const updateProductValues = { ...args.productUpdate, sellerId: seller.id };
            
            const result = await context.db
                .update(products)
                .set(updateProductValues) //(args.productUpdate)
                .where(and(eq(products.id, args.productUpdate.id), eq(products.sellerId, seller.id)))
                .returning();
            
            if (result.length === 0) throw notFound(ERROR_MESSAGES.PRODUCT.NOT_FOUND);
            
            return firstElem(result);

        },

        deleteSingleProduct: async (
            __: any,
            args: { id: string },
            context: GraphQLContext
        )=>{
            const { token } = context;
            if (!token) throw new GraphQLError('Unauthorized', {
                extensions: { code: 'UNAUTHORIZED', error: ERROR_MESSAGES.AUTH.UNAUTHORIZED }
            });

            const seller = await isSeller(token as JWTPayload);
            if (!seller) throw new GraphQLError('Forbidden', {
                extensions: { code: 'FORBIDDEN', error: ERROR_MESSAGES.SELLER.NOT_FOUND }
            });
            
            const result = await context.db
                .delete(products)
                .where(and(eq(products.id, args.id), eq(products.sellerId, seller.id)))
                .returning();
            
            if (result.length === 0) throw notFound(ERROR_MESSAGES.PRODUCT.NOT_FOUND);

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
