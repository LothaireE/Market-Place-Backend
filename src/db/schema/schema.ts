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
    index
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { lower } from '../../utils/utils';


const timestamps = {
    createdAt: timestamp('created_at', {withTimezone: true}).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', {withTimezone: true}).notNull().defaultNow(),
};

export const verificationStatus = pgEnum("verification_status", ["PENDING","VERIFIED","REJECTED"]);

export const conditionEnum = pgEnum('condition_enum', [
    'EXCELLENT',
    'GOOD',
    'CORRECT',
    'USED',
    'DAMAGED'
]);

export const productStatusEnum = pgEnum("product_status_enum", [
    "AVAILABLE",
    "RESERVED",
    "SOLD",
])

export const currencyEnum = pgEnum("currency_enum", [
    "EUR",
    // "USD" // will handle that later
])

export const orderStatusEnum = pgEnum("order_status_enum", [
    "PENDING",
    "PAID",
    "FAILED",
    "CANCELLED",
    "COMPLETED"
])

export const paymentStatusEnum = pgEnum("payment_status_enum", [
    "succeeded",
    "processing",
    "canceled",
    "requires_action"
])

export const fulfillmentMethodEnum = pgEnum("fulfillment_method_enum", [
  "MEETUP",
  "SHIPPING",
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
    unitPrice: integer('unit_price').notNull(),
    size: varchar('size', { length: 50 }),
    color: varchar('color', { length: 50 }),
    imagesJson: text('images_json').array().notNull().default(sql`ARRAY[]::text[]`),
    condition: conditionEnum('condition').notNull().default('GOOD'),
    currency: currencyEnum("currency").notNull().default("EUR"),
    sellerId: uuid('seller_id')
        .notNull()
        .references(() => sellerProfiles.id, { onDelete: 'cascade' }),
    status: productStatusEnum("status").notNull().default("AVAILABLE"),
    reservedAt: timestamp("reserved_at", {withTimezone: true}),
    reservedByUserId: uuid("reserved_by_user_id").references(()=> users.id, {onDelete: "set null"}),
    ...timestamps
}, (table) => [
    index("product_seller_id_index").on(table.sellerId),
    index("product_status_index").on(table.status),
    index("product_reserved_by_index").on(table.reservedByUserId),
    index("product_reserved_at_index").on(table.reservedAt)
])

export const categories = pgTable('categories', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 50 }).notNull().unique(),
    ...timestamps
});

export const productCategories = pgTable('product_categories', {
    productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade'}),
    categoryId: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'cascade'}),
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


export const orders = pgTable("orders", {
    id: uuid("id").defaultRandom().primaryKey(),
    buyerId: uuid("buyer_id").notNull().references(()=> users.id,{ onDelete: "restrict"}),
    sellerId: uuid("seller_id").notNull().references(()=> sellerProfiles.id,{ onDelete: "restrict"}),
    currency: currencyEnum("currency").notNull().default("EUR"),
    status: orderStatusEnum("status").notNull().default("PENDING"),
    fulfillmentMethod: fulfillmentMethodEnum("fulfillment_method").default("MEETUP"),
    totalAmount: integer("total_amount").notNull(),
    
// checkoutSessionId: uuid("checkout_session_id").references(()=> checkoutSessions.id) // if I ever implement unique payment for multiple sellers
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt
}, (table)=> [
    index("orders_buyer_id_index").on(table.buyerId),
    index("orders_seller_id_index").on(table.sellerId),
    // uniqueIndex("unique_orders_product_index").on(table.productId),
    index("orders_status_index").on(table.status)
])

export const orderItems = pgTable("order_items", {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(()=> orders.id, {onDelete: "cascade"}),
    productId: uuid("product_id").notNull().references(()=> products.id, { onDelete: "restrict"}),
    unitPrice: integer("unit_price").notNull(),
    currency: currencyEnum("currency").notNull(),//.default("EUR"),
    productQuantity: integer("product_quantity").default(1),
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt
}, (table)=> [
    uniqueIndex("unique_order_items_product_index").on(table.productId), // ensure a product is only in one order item
    index("order_items_order_id_index").on(table.orderId)
])

export const payments = pgTable("payments", {
    id: uuid("id").defaultRandom().primaryKey(),
    buyerId: uuid("buyer_id").notNull().references(()=> users.id, {onDelete: "restrict"}),
    provider: varchar("provider", {length: 30}).notNull().default("INTERNAL"), 
    providerReference: varchar("provider_reference", {length: 255}), // payment intent id initially checkout_session_id
    amount: integer("amount").notNull(),
    currency: currencyEnum("currency").notNull().default("EUR"),
    status: paymentStatusEnum("status").notNull().default("requires_action"),
    createdAt: timestamps.createdAt,
    updatedAt: timestamps.updatedAt
}, (table)=> [
    uniqueIndex("unique_payments_provider_reference").on(table.provider, table.providerReference),
    index("payments_status_index").on(table.status)
])

export const paymentOrders = pgTable("payment_orders", {
    paymentId: uuid("payment_id").notNull().references(()=> payments.id, {onDelete: "cascade"}),
    orderId: uuid("order_id").notNull().references(()=> orders.id, {onDelete: "cascade"}),
}, (table)=> [
    uniqueIndex("unique_payment_orders_order").on(table.orderId), // only one paiment possible peer order
    index("payment_orders_payment_index").on(table.orderId)
])