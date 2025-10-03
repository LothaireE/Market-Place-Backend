// import { productCategories, products } from "../../db/schema";
// import { eq } from "drizzle-orm";
// import { ProductCategory, ProductCategoryResolvers } from "../generated/types.generated";
// import { GraphQLContext } from "../../types/context.type";


// // maybe useless if I don't use ProductCategory in queries/mutations

// export const productCategoryResolvers = <ProductCategoryResolvers>{
//     ProductCategory: {
//         products: async (parent: ProductCategory, __: any, context: GraphQLContext) => {

//             const result =  await context.db.query.products.findMany({
//                 where: eq(products.id, parent.productId)
//             });
//             console.log('result in productCategoryResolvers ===> ', result);
//             return
//             return result;
//         }
//     }
// }