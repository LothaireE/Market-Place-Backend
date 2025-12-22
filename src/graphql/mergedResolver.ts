import { mergeResolvers } from '@graphql-tools/merge';
import { Resolvers } from './generated/types.generated';
import { GraphQLContext } from '../types/context.type';
import { mutationResolvers } from './resolvers/mutation.resolver';
import { sellerResolvers } from './resolvers/seller.resolver';
import { productResolvers } from './resolvers/product.resolver';
import { queryResolvers } from './resolvers/query.resolver';
import { favoriteResolvers } from './resolvers/favorite.resolver';
import { productCategoryResolvers } from './resolvers/productCategory.resolver';
import { categoryResolvers } from './resolvers/category.resolver';

export const resolvers: Resolvers<GraphQLContext> = mergeResolvers([
    queryResolvers,
    favoriteResolvers,
    productCategoryResolvers,
    mutationResolvers,
    categoryResolvers,
    sellerResolvers,
    productResolvers
]);
