import { products, productCategories, categories } from '../schema';
import { relations } from 'drizzle-orm';

export const productCategoryRelations = relations(productCategories, ({ one, many }) => ({
    product: one(products,{
        fields: [productCategories.productId],
        references: [products.id]
    }),
    category: one(categories,{
        fields: [productCategories.categoryId],
        references: [categories.id]
    })
}));

