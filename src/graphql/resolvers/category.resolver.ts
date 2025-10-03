import { products, productCategories } from "../../db/schema";
import { eq } from "drizzle-orm";
import { Category, CategoryResolvers } from "../generated/types.generated";
import { GraphQLContext } from "../../types/context.type";

export const categoryResolvers = <CategoryResolvers>{
    Category: {
        
          products: async (parent: Category, __: any, context: GraphQLContext) => {

            const result = await context.db.query.productCategories.findMany({
            where: eq(productCategories.categoryId, parent.id),
            with: {
                product: true, // this is how I get the products related to the category
            },

            orderBy: (_, { desc }) => [desc(products.createdAt)],
            });
            
            return result.map(r => r.product);
        },

    }
}