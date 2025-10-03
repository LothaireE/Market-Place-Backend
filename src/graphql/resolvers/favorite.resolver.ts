import { products } from "../../db/schema";
import { eq } from "drizzle-orm";
import { Favorite, FavoriteResolvers } from "../generated/types.generated";
import { GraphQLContext } from "../../types/context.type";

export const favoriteResolvers = <FavoriteResolvers>{
    Favorite: {
        product: async (parent: Favorite, __: {}, context: GraphQLContext) => {
            console.log('parent ===> ', parent);
            console.log('context ===> ', context);
            return await context.db.query.products.findFirst({
                where: eq(products.id, parent.productId)
            })// ?? null
            }
    }
};