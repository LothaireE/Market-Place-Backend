import { products, productCategories, categories } from '../schema';
import { relations } from 'drizzle-orm';

export const productCategoriesRelations = relations(productCategories, ({ one }) => ({
    product: one(products,{
        fields: [productCategories.productId],
        references: [products.id]
    }),
    category: one(categories,{
        fields: [productCategories.categoryId],
        references: [categories.id]
    })
}));

