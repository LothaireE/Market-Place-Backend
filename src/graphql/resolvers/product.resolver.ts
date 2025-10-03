import { sellerProfiles } from "../../db/schema";
import { eq } from "drizzle-orm";
import { Product, ProductResolvers  } from "../generated/types.generated";
import { GraphQLContext } from "../../types/context.type";

export const productResolvers = <ProductResolvers>{
    Product: {
        sellerProfile: async (parent: Product, __: {}, context: GraphQLContext) =>
            await context.db.query.sellerProfiles.findFirst({
                where: eq(sellerProfiles.id, parent.sellerId)
            })
        }
}