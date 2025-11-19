import { sellerProfiles } from "../../db/schema";
import { eq } from "drizzle-orm";
import { Product, ProductImage, ProductResolvers  } from "../generated/types.generated";
import { GraphQLContext } from "../../types/context.type";



export const productResolvers = <ProductResolvers>{
    Product: {
        sellerProfile: async (parent: Product, __: {}, context: GraphQLContext) =>
            await context.db.query.sellerProfiles.findFirst({
                where: eq(sellerProfiles.id, parent.sellerId)
            }),
        images: async (parent: Product) => 
            parent.imagesUrl.map((image: string) => image && JSON.parse(image)) as ProductImage[] || []
        }
}