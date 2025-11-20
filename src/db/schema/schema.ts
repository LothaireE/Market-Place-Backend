import {
    text,
    timestamp,
    integer,
    pgTable,
    varchar,
    uuid,
    pgEnum,
    uniqueIndex,
    primaryKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { lower } from '../../utils/utils';

const timestamps = {
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
};

export const verificationStatus = pgEnum("verification_status", ["PENDING","VERIFIED","REJECTED"]);

export const conditionEnum = pgEnum('condition_enum', [
    'EXCELLENT',
    'GOOD',
    'CORRECT',
    'USED',
    'DAMAGED'
]);

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    avatarUrl: text("avatar_url"),
    ...timestamps
}, (table)=>[
    uniqueIndex('email_unique_index').on(lower(table.email)) // create a unique index on lowercased email column, ensure email is unique (case-insensitive)
]);

export const sellerProfiles = pgTable('seller_profiles', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' })
        .unique(),
    bio: text('bio'),
    rating: integer('rating').default(0),
    shopName: varchar('shop_name', { length: 255 }).unique(),
    payoutAccount: varchar("payout_account", { length: 255 }), // ex: Stripe acct id
    verified: verificationStatus("verified").notNull().default("PENDING"),
    ...timestamps
})

export const refreshTokens = pgTable('refresh_tokens', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 512 }).notNull().unique(),
    createdAt: timestamps.createdAt,
    expiresAt: timestamp('expires_at').notNull()
});

export const products = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    price: integer('price').notNull(),
    size: varchar('size', { length: 50 }),
    color: varchar('color', { length: 50 }),
    imagesJson: text('images_json').array().notNull().default(sql`ARRAY[]::text[]`),
    condition: conditionEnum('condition').notNull().default('GOOD'),
    sellerId: uuid('seller_id')
        .notNull()
        .references(() => sellerProfiles.id, { onDelete: 'cascade' }),
    ...timestamps
})

export const categories = pgTable('categories', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 50 }).notNull().unique(),
    ...timestamps
});

export const productCategories = pgTable('product_categories', {
    productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade'}),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade'}),
    createdAt: timestamps.createdAt
},(table) => [
    primaryKey({columns: [table.productId, table.categoryId]})
]);

export const favorites = pgTable('favorites', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    productId: uuid('product_id')
        .notNull()
        .references(() => products.id, { onDelete: 'cascade' }),
    createdAt: timestamps.createdAt
}, (table) => [
    uniqueIndex('unique_favorite_index').on(table.userId, table.productId)
    ]);
