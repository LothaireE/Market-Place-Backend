import { users, products } from '../../db/schema/';
import { eq } from 'drizzle-orm';
import { SellerProfile, SellerProfileResolvers } from '../generated/types.generated';
import { GraphQLContext } from '../../types/context.type';

export const sellerResolvers = <SellerProfileResolvers>{
    SellerProfile: {
        user: async (parent: SellerProfile, __: {}, context: GraphQLContext) =>
            await context.db.query.users.findFirst({
                where: eq(users.id, parent.userId)
            }),
        products: async (parent: SellerProfile, __: {}, context: GraphQLContext) =>
            await context.db.query.products.findMany({
                where: eq(products.sellerId, parent.id)
            })
    }
};