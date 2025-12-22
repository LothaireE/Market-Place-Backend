import { and, eq } from "drizzle-orm";
import db from "../../db/db";
import { CreateProductInput, Product, UpdateProductInput } from "../../graphql/generated/types.generated";
import { products } from "../../db/schema";
import { ERROR_MESSAGES } from "../../constants/messages";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"

export class ProductModel {
    static findOne = async function (
        productId: string
    ): Promise<Product | undefined> {
        const product = db.query.products.findFirst({
            where: eq(products.id, productId)
        });
        return product as unknown as Product | undefined;
    };

    static async findWithSellerId  (
        productId: string,
        sellerId: string
    ): Promise<Product | undefined> {
        const product = db.query.products.findFirst({
            where: (and(eq(products.id, productId), eq(products.sellerId, sellerId)))
        });
        return product as unknown as Product | undefined;
    };

    static async getProductName (
        productId: string
    ): Promise<string | undefined> {
        const product = await db
            .select({ name: products.name })
            .from(products)
            .where(eq(products.id, productId));
        
        return product.length > 0 ? product[0].name : undefined;
    }

    static async create (
        newProduct: CreateProductInput & { sellerId: string },
        transaction: PostgresJsDatabase<any> = db
    ): Promise<Product | undefined> {

        // const [createdProduct] = await db
        const [createdProduct] = await transaction
            .insert(products)
            .values(newProduct)
            .returning();
        return createdProduct as unknown as Product | undefined;
    };

    static async delete (sellerId: string, productId: string) {
        const result = await db
            .delete(products)
            .where(and(eq(products.id, productId), eq(products.sellerId, sellerId)))
            .returning();
        
        if (result.length === 0) throw new Error(ERROR_MESSAGES.PRODUCT.NOT_FOUND);

        return result[0];
    }

    static async update (
        productUpdate : Partial<UpdateProductInput> & { id: string, sellerId: string },
    ): Promise<Product | undefined> {

        const [updatedProduct] = await db
            .update(products)
            .set(productUpdate)
            .where(and(eq(products.id, productUpdate.id), eq(products.sellerId, productUpdate.sellerId as string))) // .where(and(eq(products.id, productUpdate.id), eq(products.sellerId, productUpdate.sellerId as string)))
            .returning();

        return updatedProduct as unknown as Product | undefined;
    }
}
