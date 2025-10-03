import { relations } from "drizzle-orm";
import { sellerProfiles, products, productCategories, categories } from "../schema";


export const productRealtions = relations(products,({one, many})=>({
    seller: one(sellerProfiles,{
        fields: [products.sellerId],
        references: [sellerProfiles.id]
    }),
    productCategories: many(productCategories),
}))