import { orderItems, products, sellerProfiles } from "../../db/schema";
import { eq } from "drizzle-orm";
import { OrderItem, OrderItemResolvers, OrderResolvers, Order } from "../generated/types.generated";
import { GraphQLContext } from "../../types/context.type";


export const orderResolvers = <OrderResolvers>{
    Order: {
        orderItems:  (parent: Order, __: {}, context: GraphQLContext) => 
            context.loaders.orderItemsByOrderId.load(parent.id),

        sellerProfile: async (parent: Order, __: {}, context: GraphQLContext) => 
            await context.db.query.sellerProfiles.findFirst({
                where: eq(sellerProfiles.id, parent.sellerId)
            })
    }
};

export const orderItemResolvers = <OrderItemResolvers>{
    OrderItem: {
        product:  (parent: OrderItem, __: {}, context: GraphQLContext) => 
            context.loaders.productsById.load(parent.productId)
    }
};




// export const orderResolvers = <OrderResolvers>{
//     Order: {
//         orderItems: async (parent: Order, __: {}, context: GraphQLContext) => 
//             await context.db.query.orderItems.findMany({
//                 where: eq(orderItems.orderId, parent.id)
//             }),
//         sellerProfile: async (parent: Order, __: {}, context: GraphQLContext) => 
//             await context.db.query.sellerProfiles.findFirst({
//                 where: eq(sellerProfiles.id, parent.sellerId)
//             })
//     }
// };

// export const orderItemResolvers = <OrderItemResolvers>{
//     OrderItem: {
//         product: async (parent: OrderItem, __: {}, context: GraphQLContext) => 
//             await context.db.query.products.findFirst({
//                 where: eq(products.id, parent.productId)
//             })
//     }
// };

