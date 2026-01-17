import { categories, productCategories, products } from '../schema';
import { relations } from 'drizzle-orm';

export const categoriesRelations = relations(categories, ({ many }) => ({
    productCategories: many(productCategories),
}));

export const productsRelations = relations(categories, ({ many }) => ({
    productCategories: many(productCategories),
}));
