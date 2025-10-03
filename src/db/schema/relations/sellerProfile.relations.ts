import { relations } from "drizzle-orm";
import { users, sellerProfiles, products } from "../schema";

// one-to-one relationship between one User and their sellerProfile
// and one-to-many relationship between one SellerProfile and their products
export const sellerProfileRelations = relations(sellerProfiles, ({ one, many }) => ({
    user: one(users,{
        fields: [sellerProfiles.userId],
        references: [users.id]
    }),
    products: many(products)
}))