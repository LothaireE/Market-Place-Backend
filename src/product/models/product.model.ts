import { and, eq } from "drizzle-orm";
import db from "../../db/db";
import { CreateProductInput, Product } from "../../graphql/generated/types.generated";
import { products } from "../../db/schema";
import { ERROR_MESSAGES } from "../../constants/messages";
import { firstElem } from "../../utils/utils";


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

    static async create (
        newProduct: CreateProductInput & { sellerId: string }
    ): Promise<Product | undefined> {

        const [createdProduct] = await db
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

        return firstElem(result);
    }
}
