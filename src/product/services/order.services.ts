


import db  from "../../db/db";
import { products, orders, sellerProfiles, orderItems, payments } from "../../db/schema";
import { eq, and, lt, inArray } from "drizzle-orm";
import { Order, OrderItem } from "../../graphql/generated/types.generated";
import { stripe } from "../../config/config";



type ConfirmPaymentResult = {
  orderIds: string[];
  orderStatus: "PAID";
  productIds: string[];
  productStatus: "SOLD";
};

type ReleaseResult = {
    releasedOrders : number;
    releasedProducts: string[]
}

type expiredReservation = {
    orderId: string
    productId: string
}
type FulfillmentMethod = "MEETUP" | "SHIPPING"

type ProductListItem ={
    productId: string,
    unitPrice: number,
    currency: string | null,
    status: string,
    sellerProfileId: string,
    sellerUserId: string
}

const toCents = (price: string) => (parseFloat(price) * 100)//.toString();


export class OrderService {

static async createCheckout (
        buyerUserId: string,
        productIds: string[],
        fulfillmentMethod: FulfillmentMethod
    ) {
        return db.transaction(async (tx: any)=>{
            const productsList: ProductListItem[] = await tx
                .select({
                    productId: products.id,
                    productName: products.name,
                    unitPrice: products.unitPrice,
                    currency: products.currency,
                    status: products.status,
                    sellerProfileId: products.sellerId,
                    sellerUserId: sellerProfiles.userId // no self buy
                })
                .from(products)
                .innerJoin(sellerProfiles, eq(sellerProfiles.id, products.sellerId))
                .where(inArray(products.id, productIds))
                .for("update")
            
            if (productsList.length !== productIds.length) throw new Error('One or more products not found.')
            
            for (const p of productsList) {
                if (p.status !== "AVAILABLE") throw new Error(`Product ${p.productId} is not available.`)
                if (p.sellerUserId === buyerUserId) throw new Error(`Cannot buy your own product ${p.productId}.`)
            }


            // reserve products
            for (const p of productsList) {
                const updated = await tx
                    .update(products)
                    .set({
                        status: "RESERVED",
                        reservedAt: new Date(),
                        reservedByUserId: buyerUserId
                    })
                    .where(and(
                        eq(products.id, p.productId),
                        eq(products.status, "AVAILABLE")
                    ))

                if (updated.rowCount === 0) throw new Error("Reservation failed due to concurrent update.")
            }

            // group by seller
            const bySeller = new Map<string, typeof productsList>()

            for (const p of productsList) {
                if (!bySeller.has(p.sellerProfileId)) {
                    bySeller.set(p.sellerProfileId, [])
                }
                bySeller.get(p.sellerProfileId)!.push(p)
                }
            
            // create orders per seller and order items
            const createdOrders = []

            for (const [sellerid, items] of bySeller.entries()) {
                const totalAmount = items.reduce((sum, item) => sum + item.unitPrice, 0)

                const [order] = await tx
                    .insert(orders)
                    .values({
                        buyerId: buyerUserId,
                        sellerId: sellerid,
                        currency: items[0].currency ?? "EUR",
                        fulfillmentMethod,
                        totalAmount,
                        status: "PENDING"
                    })
                    .returning()

                for (const p of items) {
                    await tx.insert(orderItems).values({
                        orderId: order.id,
                        productId: p.productId,
                        currency: p.currency ?? "EUR",
                        unitPrice: p.unitPrice
                    })
                }
                createdOrders.push(order)
            }

            return { orders: createdOrders  }
            })
    }

    static async cancelAllOrders () {
        return db.transaction(async (tx: any) => {

            const allOrders = await tx
            .select({ id: orders.id })
            .from(orders);

            const orderIds = allOrders.map((o: { id: string }) => o.id);

            if (orderIds.length === 0) {
                return {
                cancelledOrders: 0,
                deletedOrderItems: 0,
                releasedProducts: 0,
                productIds: [] as string[],
                };
            }

            const items = await tx
                .select({ productId: orderItems.productId })
                .from(orderItems)
                .where(inArray(orderItems.orderId, orderIds));

            const productIds = items.map((i: { productId: string }) => i.productId);

            const updatedOrders = await tx
                .update(orders)
                .set({ status: "CANCELLED" })
                .where(inArray(orders.id, orderIds));

            await tx
                .delete(orderItems)
                .where(inArray(orderItems.orderId, orderIds));

            let releasedCount = 0;
            if (productIds.length > 0) {
                const released = await tx
                .update(products)
                .set({
                    status: "AVAILABLE",
                    reservedAt: null,
                    reservedByUserId: null,
                })
                .where(inArray(products.id, productIds));

                releasedCount = released.rowCount ?? 0;
            }

            
            return {
                cancelledOrders: updatedOrders.rowCount ?? 0,
                releasedProducts: releasedCount,
                productIds,
            };

        });
    }

    static async cancelMultipleOrders (        
        buyerUserId: string,
        orderIds: string[]
    ) {
        return db.transaction(async (tx: any) => {

            if (orderIds.length === 0) {
                return {
                cancelledOrders: 0,
                releasedProducts: 0,
                productIds: [] as string[],
                };
            }

            const ordersList = await tx // lock to check ownership and status
                .select({
                    id: orders.id,
                    status: orders.status,
                    buyerId: orders.buyerId,
                })
                .from(orders)
                .where(and(inArray(orders.id, orderIds), eq(orders.buyerId, buyerUserId)))
                .for("update")

            if (ordersList.length !== orderIds.length) throw new Error("One or more order not found or not owned by user.");
            for (const o of ordersList) if (o.status !== "PENDING") throw new Error(`Order ${o.id} cannot be cancelled.`)

            // const items = await tx
            //     .select({ productId: orderItems.productId })
            //     .from(orderItems)
            //     .where(inArray(orderItems.orderId, orderIds));

            // const productIds = [...new Set(items.map((i: { productId: string }) => i.productId))];

            const items: { productId: string }[] = await tx
                .select({ productId: orderItems.productId })
                .from(orderItems)
                .where(inArray(orderItems.orderId, orderIds));

            const productIds: string[] = [...new Set(items.map((i: { productId: string }) => i.productId))];

            const updatedOrders = await tx
                .update(orders)
                .set({ status: "CANCELLED" })
                .where(inArray(orders.id, orderIds));

            await tx
                .delete(orderItems)
                .where(inArray(orderItems.orderId, orderIds));

            let releasedCount = 0;
            if (productIds.length > 0) {
                const released = await tx
                .update(products)
                .set({
                    status: "AVAILABLE",
                    reservedAt: null,
                    reservedByUserId: null,
                })
                .where(and(inArray(products.id, productIds), eq(products.reservedByUserId, buyerUserId)));

                releasedCount = released.rowCount ?? 0;
            }

            
            return {
                cancelledOrders: updatedOrders.rowCount ?? 0,
                releasedProducts: releasedCount,
                productIds,
            };

        });
    }

    static async cancelOrder(
        buyerUserId: string,
        orderId: string
    ) {
        return db.transaction(async (tx:any)=> {
            console.log('Attempting to cancel order', orderId, 'for user', buyerUserId);
            const [o] = await tx // lock to check ownership and status
                .select({
                    id: orders.id,
                    status: orders.status,
                    buyerId: orders.buyerId,
                })
                .from(orders)
                .where(eq(orders.id, orderId))
                .for("update")

            if (!o) throw new Error('Order not found.')
            if (o.buyerId !== buyerUserId) throw new Error('Forbidden.')
            if (o.status !== "PENDING") throw new Error('Order cannot be cancelled.')

            const items = await tx
                .select({ productId: orderItems.productId })
                .from(orderItems)
                .where(eq(orderItems.orderId, orderId))
    
            if (items.length === 0) throw new Error("Order has no items.")  

            const productIds = items.map((item: {productId: string})=> item.productId)

            // lock products & check reservation
            const lockedProducts = await tx
                .select({
                    id: products.id,
                    status: products.status,
                    reservedByUserId: products.reservedByUserId
                })
                .from(products)
                .where(inArray(products.id, productIds))
                .for("update")
            
                    
            for (const lp of lockedProducts) {
                if (lp.status !== "RESERVED") throw new Error(`Product ${lp.id} is not reserved.`)
                if (lp.reservedByUserId !== buyerUserId) throw new Error(`Product ${lp.id} is reserved by another user.`)
            }

            // order cancellation 
            const updatedOrder = await tx
                .update(orders)
                .set({status: "CANCELLED"})
                .where(and(eq(orders.id, orderId), eq(orders.status, "PENDING")))
                .returning({
                    id: orders.id,
                    status: orders.status,
                })
            
            // delete order items
            await tx
                .delete(orderItems)
                .where(eq(orderItems.orderId, orderId))
            
            if (updatedOrder.length === 0) throw new Error("Order cannot be cancelled.") // should not happen with lock mais on sait jamais


            // release products 
            const updatedProducts = await tx
                .update(products)
                .set({
                    status: "AVAILABLE",
                    reservedAt: null,
                    reservedByUserId: null
                })
                .where(and(
                    inArray(products.id, productIds),
                    eq(products.status, "RESERVED"),
                    eq(products.reservedByUserId, buyerUserId)
                ))

            if (updatedProducts.rowCount !== productIds.length) throw new Error("Nor all products could be released.") 
            
            return {
                orderId: updatedOrder[0].id,
                orderStatus: updatedOrder[0].status,
                productIds: productIds
            }
        })
    }


    // TODO : implement either a CRON job or job queue to perform auto release
    static async releaseReservation (totalMinutes = 15) : Promise<ReleaseResult>{
        const cutoff = new Date(Date.now() - totalMinutes * 60 * 1000)

        // return { releasedCount: 0, cancelledOrderIds: []}
        return db.transaction(async(tx : any)=>{
            const expired: expiredReservation[] = await tx
                .select({
                    orderId: orders.id,
                    productId: orderItems.productId
                })
                .from(orders)
                .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
                .innerJoin(products, eq(products.id, orderItems.productId))
                .where(and(
                    eq(orders.status, "PENDING"),
                    eq(products.status, "RESERVED"),
                    lt(products.reservedAt, cutoff)
                ))
                .for("update")
            
            if(!expired.length) {
                return { releasedOrders: 0, releasedProducts: []}
            }

            const orderIds = [...new Set(expired.map((exp)=> exp.orderId))] // expired.map((exp)=> exp.orderId)
            const productIds = expired.map((exp)=> exp.productId)

            // cancel orders
            await tx
                .update(orders)
                .set({ status: "CANCELLED"})
                .where(inArray(orders.id, orderIds))
                
            // release products
            await tx
                .update(products)
                .set({ 
                    status: "AVAILABLE",
                    reservedAt: null,
                    reservedByUserId: null
                })
                .where(inArray(products.id, productIds))

            return{ releasedOrders: productIds.length, releasedProducts: orderIds}

        })
    }

   

    static async createPaymentIntent(
        amount: number,
        customerEmail: string| undefined,
        currency: string = "eur"
    ) {
        if (!customerEmail) throw new Error(`Customer email is missing.`)

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                currency: currency,
                amount: amount,
                payment_method_types: ["card"],
                receipt_email: customerEmail
            })
            return paymentIntent.client_secret //{clientSecret: paymentIntent.client_secret}

        } catch (error: any) {
            throw new Error(`Create payment failed: ${error.message}`)
        }
    }

    static async confirmPayment ( 
        buyerUserId: string,
        orderIds : string[],
        paymentIntentId: string
    ) : Promise<ConfirmPaymentResult>  {

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
        console.log('paymentIntent ===> ', paymentIntent);
        if (!paymentIntent || paymentIntent.object !== "payment_intent") throw new Error('Invalid payment intent')
        if (paymentIntent.status !== "succeeded") throw new Error(`Payment not completed. status=${paymentIntent.status}`);

        // TODO: check cohérence amount/currency
        // amountStripe = paymentIntent.amount (ex: 1200)
        // currencyStripe = paymentIntent.currency (ex: "eur")

        return db.transaction(async(tx:any)=> {

            //lock my orders
            const ordersList : Order[] = await tx
                .select({
                    id: orders.id,
                    status: orders.status,
                    buyerId: orders.buyerId,
                    currency: orders.currency,
                    totalAmount: orders.totalAmount
                })
                .from(orders)
                .where(inArray(orders.id, orderIds))
                .for("update")

            if (ordersList.length !== orderIds.length) throw new Error('One or more orders not found.')
        
            for (const o of ordersList){
                if (o.buyerId !== buyerUserId) throw new Error('Forbidden.')
                if (o.status !== "PENDING") throw new Error(`Order  ${o.id} is not pending.`)
            }

            const ordersTotalDb = ordersList.reduce((sum, order)=> sum + order.totalAmount, 0)

            if (paymentIntent.amount !== ordersTotalDb) throw new Error("Amounts do not match.");

            // gathering items for each order
            const orderItemRows : OrderItem[] = await tx
                .select({ orderId: orderItems.orderId, productId: orderItems.productId })
                .from(orderItems)
                .where(inArray(orderItems.orderId, orderIds))

            const ordersWithItems = new Set(orderItemRows.map((row)=> row.orderId))
            for (const id of orderIds) if (!ordersWithItems.has(id)) throw new Error(`Order ${id} has no item.`);
            
            const productIds = Array.from(new Set(orderItemRows.map((row)=> row.productId)))

            const lockedProducts = await tx
                .select({
                    id:products.id,
                    status: products.status,
                    reservedByUserId: products.reservedByUserId
                })
                .from(products)
                .where(inArray(products.id, productIds))
                .for("update")

            if (lockedProducts.length !== productIds.length) throw new Error("One or more products not found.")    
            for (const lp of lockedProducts) {
                if (lp.status !== "RESERVED") throw new Error(`Product ${lp.id} is not reserved.`)
                if (lp.reservedByUserId !== buyerUserId) throw new Error(`Product ${lp.id} is reserved by another user.`)
            }

            const updatedOrders = await tx
                .update(orders)
                .set({status: "PAID", reservedAt: null, reservedByUserId: null})
                .where(and(inArray(orders.id, orderIds), eq(orders.status, "PENDING")))
                .returning({
                    id: orders.id,
                    status: orders.status,
                })

        
            if (updatedOrders.length !== orderIds.length) throw new Error("One or more orders cannot be confirmed.") 

            const updatedProducts = await tx
                .update(products)
                .set({status: "SOLD"})
                .where(and(
                    inArray(products.id, productIds),
                    eq(products.status, "RESERVED"),
                    eq(products.reservedByUserId, buyerUserId), 
                ))
                .returning({ id: products.id })

            if (updatedProducts.length !== productIds.length) throw new Error("Some products cannot be marked as sold.") 

            const updatedOrderIds = updatedOrders.map((o: any) => o.id)

            for (const o of ordersList) {
                await tx 
                    .insert(payments)
                    .values({
                        orderId: o.id,
                        provider: "STRIPE",
                        providerReference: paymentIntent.id,
                        amount: o.totalAmount, // amount of this specific o of orderList
                        currency: o.currency,
                        status: paymentIntent.status
                    })
                    .onConflictDoUpdate({
                        target: [payments.provider, payments.providerReference],
                        set: {
                            provider: "STRIPE",
                            providerReference: paymentIntent.id,
                            amount: o.totalAmount, // amount of this specific o of orderList
                            currency: o.currency,
                            status: paymentIntent.status,
                            updatedAt:  new Date(),
                        }
                    })
            }

            return {
                orderIds: updatedOrderIds,
                orderStatus: "PAID",
                productIds, // doit retourner un tableau desormais
                productStatus: "SOLD",
            }
    })

}}



// static async providePaymentMethod (
//         createdOrders: any,
//         customerEmail: string | undefined,
//         newSuccessUrl?: string | undefined,
//         newCancelUrl?: string | undefined
//     ) {
//         if (!customerEmail) throw new Error("Customer e-mail not provided.")
        
//         // const successUrl = 'http://localhost:5173/account/confirm-checkout'
//         const successUrl = newSuccessUrl ?? `${CLIENT_URL}/account/confirm-checkout`
//         const cancelUrl = newCancelUrl ?? `${CLIENT_URL}/account/cart`

//         const lineItems = createdOrders.orders.map((o: any) => {
//             return {
//                 price_data: {
//                     currency: o.currency,
//                     product_data: {
//                         name: "market place order",
//                         metadata: {
//                             order_id: o.id,
//                             customer_email: customerEmail,
//                             // seller_id: o.sellerId
//                         }
//                     },
//                     unit_amount: toCents(o.totalAmount),
//                 },
//                 quantity: 1 // TODO: add orderItems to fill all the necessary infos
//             }
//         })


//         try {
//             const session = await STRIPE.checkout.sessions.create({
//                 payment_method_types: ["card"],
//                 mode: "payment",
//                 line_items: lineItems,
//                 success_url: successUrl,
//                 cancel_url: cancelUrl,
//             })
//             return { url: session.url}
//         } catch (e: any) {
//             // return { error: e.message }
//             throw new Error(`${e.message}`)
//         }

//     }




//  static async providePaymentMethod (
//         createdOrders: any,
//         customerEmail: string | undefined,
//         newSuccessUrl?: string | undefined,
//         newCancelUrl?: string | undefined
//     ) {
//         if (!customerEmail) throw new Error("Customer e-mail not provided.")
        
//         // const successUrl = 'http://localhost:5173/account/confirm-checkout'
//         const successUrl = newSuccessUrl ?? `${CLIENT_URL}/account/confirm-checkout`
//         const cancelUrl = newCancelUrl ?? `${CLIENT_URL}/account/cart`

//         const lineItems = createdOrders.orders.map((o: any) => {
//             return {
//                 price_data: {
//                     currency: o.currency,
//                     product_data: {
//                         name: "market place order",
//                         metadata: {
//                             order_id: o.id,
//                             customer_email: customerEmail,
//                             // seller_id: o.sellerId
//                         }
//                     },
//                     unit_amount: toCents(o.totalAmount),
//                 },
//                 quantity: 1 // TODO: add orderItems to fill all the necessary infos
//             }
//         })


//         try {
//             const session = await STRIPE.checkout.sessions.create({
//                 payment_method_types: ["card"],
//                 mode: "payment",
//                 line_items: lineItems,
//                 success_url: successUrl,
//                 cancel_url: cancelUrl,
//             })
//             return { url: session.url}
//         } catch (e: any) {
//             // return { error: e.message }
//             throw new Error(`${e.message}`)
//         }

//     }