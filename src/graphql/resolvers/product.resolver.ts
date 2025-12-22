import { productCategories, sellerProfiles } from "../../db/schema";
import { eq } from "drizzle-orm";
import { Category, Product, ProductImage, ProductResolvers  } from "../generated/types.generated";
import { GraphQLContext } from "../../types/context.type";



export const productResolvers = <ProductResolvers>{
    Product: {
        sellerProfile: async (parent: Product, __: {}, context: GraphQLContext) =>
             await context.db.query.sellerProfiles.findFirst({
                where: eq(sellerProfiles.id, parent.sellerId)
            }),
        images: async (parent: Product) =>
            (parent.imagesJson || []).map((image: string) => image && JSON.parse(image)) as ProductImage[] || [],
        
        categories: async (parent: Product, __: {}, context: GraphQLContext) => {
            const links = await context.db.query.productCategories.findMany({
                where: eq(productCategories.productId, parent.id),
                with: { category: true },
            });

            return links.map((l) => ({ // temp patch before I do my TODO
                id: l.category.id,
                name: l.category.name,
                createdAt: l.category.createdAt.toISOString(), //TODO fix this createdAt and updatedAt
                updatedAt: l.category.updatedAt.toISOString(),
            })) as Category[];
        },
    },
};

