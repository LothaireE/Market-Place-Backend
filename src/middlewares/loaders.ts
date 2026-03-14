/**
 * Utilities to create and type DataLoader instances used by GraphQL resolvers to
 * batch and cache database access for common entity lookups.
 *
 * This module exports a factory function `createLoaders` that accepts a Drizzle ORM
 * database handle from the GraphQL context and returns ready-to-use DataLoader
 * instances:
 *
 * - `orderItemsByOrderId`: batches requests for order items by order ID and returns
 *   an array of order item rows for each requested order ID (preserves request order).
 * - `productsById`: batches requests for products by product ID and returns the
 *   corresponding product record or `null` when not found (preserves request order).
 *
 * Both loaders:
 * - Use Drizzle's `inArray` to perform a single SQL query per batch,
 * - Group or map results to match the exact order of input keys,
 * - Use a string-based cache key function so keys are compared by their string value.
 *
 * Remarks:
 * - These loaders are intended to be created once per request and passed through
 *   the GraphQL context so that resolver-level loads are de-duplicated and batched.
 * - The concrete row shapes returned by the loaders match the database schema
 *   (see `orderItems` and `products` schema imports); callers may want to cast or
 *   refine the types as appropriate.
 *
 * @param db - The Drizzle ORM database instance from the GraphQL context. It is
 *               used to execute batched queries against the `orderItems` and `products` tables.
 * @returns An object containing:
 *  - `orderItemsByOrderId`: DataLoader<string, any[]> — given an orderId returns an array of order item rows.
 *  - `productsById`: DataLoader<string, any | null> — given a productId returns the product row or null if missing.
 *
 * @example
 * // In request setup:
 * const loaders = createLoaders(context.db)
 *
 * // In a resolver:
 * const items = await loaders.orderItemsByOrderId.load(orderId)
 * const product = await loaders.productsById.load(productId)
 *
 * @public
 */
import DataLoader from "dataloader"
import { inArray } from "drizzle-orm"
import { orderItems, products } from "../db/schema"
import type { GraphQLContext } from "../types/context.type"


export function createLoaders(db: GraphQLContext["db"]) {
    const orderItemsByOrderId = new DataLoader<string, any[]>(
        async (orderIds) => {
            const ids = Array.from(new Set(orderIds))
            const orderItemRows = await db.select().from(orderItems).where(inArray(orderItems.orderId, ids))

            const map = new Map<string, any[]>()
            for (const id of ids) map.set(id, [])
            for (const row of orderItemRows) {
                const key = row.orderId as string
                map.get(key)?.push(row)
            }

            return orderIds.map((id)=> map.get(id)?? [])
        },
        { cacheKeyFn: (key) => key } // Default key => key. Produces cache key for a given load key. Useful when keys are objects and two objects should be considered equivalent.
    )

    const productsById = new DataLoader<string, any[]> (
        async (productIds) => {
            const ids= Array.from(new Set(productIds))
            const productRows = await db.select().from(products).where(inArray(products.id, ids))

            const map = new Map<string, any>()
            for (const p of productRows) map.set(p.id as string, p)
            
            return productIds.map((id)=> map.get(id)?? null)
        },
        { cacheKeyFn: (key)=> key }
    )

    return { orderItemsByOrderId, productsById }
}

export type Loaders = ReturnType<typeof createLoaders>