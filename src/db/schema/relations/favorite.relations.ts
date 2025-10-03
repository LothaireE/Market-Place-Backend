import { relations } from "drizzle-orm";
import { users, products, favorites } from "../schema";

export const favoriteRelations = relations(favorites, ({ one }) => ({
    user: one(users, {
        fields: [favorites.userId],
        references: [users.id]
    }),
    product: one(products, {
        fields: [favorites.productId],
        references: [products.id]
    })
}))