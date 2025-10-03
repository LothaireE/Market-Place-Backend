import { categories, productCategories } from '../schema';
import { relations } from 'drizzle-orm';

export const categoryRelations = relations(categories, ({ many, one }) => ({
    productCategories: many(productCategories),
}));
