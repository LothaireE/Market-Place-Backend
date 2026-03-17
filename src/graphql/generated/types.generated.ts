import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type CancelAllOrdersPayload = {
  __typename?: 'CancelAllOrdersPayload';
  cancelledOrders?: Maybe<Scalars['Int']['output']>;
  productIds?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  releasedProducts?: Maybe<Scalars['Int']['output']>;
};

export type CancelOrderPayload = {
  __typename?: 'CancelOrderPayload';
  orderId: Scalars['ID']['output'];
  orderStatus: Scalars['String']['output'];
  productIds: Array<Scalars['String']['output']>;
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  products?: Maybe<Array<Product>>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type ConfirmPaymentPayload = {
  __typename?: 'ConfirmPaymentPayload';
  orderIds: Array<Scalars['ID']['output']>;
  orderStatus: OrderStatusEnum;
  productIds: Array<Scalars['ID']['output']>;
  productStatus: ProductStatusenum;
};

export type CreateCheckoutPayload = {
  __typename?: 'CreateCheckoutPayload';
  clientSecret?: Maybe<Scalars['String']['output']>;
  orders: Array<Order>;
  stripePublicKey?: Maybe<Scalars['String']['output']>;
};

export type CreateOrderPayload = {
  __typename?: 'CreateOrderPayload';
  fulfillmentMethod?: Maybe<FulfillmentMethod>;
  orderId: Scalars['ID']['output'];
};

export type CreateProductInput = {
  categoryIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  color?: InputMaybe<Scalars['String']['input']>;
  condition: ProductCondition;
  description?: InputMaybe<Scalars['String']['input']>;
  imagesJson: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  sellerId?: InputMaybe<Scalars['ID']['input']>;
  size?: InputMaybe<Scalars['String']['input']>;
  unitPrice: Scalars['Int']['input'];
};

export type Favorite = {
  __typename?: 'Favorite';
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  product: Product;
  productId: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
};

export type FavoritesInput = {
  productId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export enum FulfillmentMethod {
  Meetup = 'MEETUP',
  Shipping = 'SHIPPING'
}

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  addToFavorites?: Maybe<Favorite>;
  addToProductCategories: ProductCategory;
  cancelAllOrders: CancelAllOrdersPayload;
  cancelMultipleOrders: CancelAllOrdersPayload;
  cancelOrder: CancelOrderPayload;
  confirmPayment?: Maybe<ConfirmPaymentPayload>;
  createCategory: Category;
  createCheckout: CreateCheckoutPayload;
  createSellerProfile: SellerProfile;
  deleteAllProducts?: Maybe<Array<Maybe<Product>>>;
  deleteCategory?: Maybe<Category>;
  deleteSellerProfile?: Maybe<SellerProfile>;
  deleteSingleProduct?: Maybe<Product>;
  removeFromFavorites?: Maybe<Favorite>;
  removeFromProductCategories?: Maybe<ProductCategory>;
  updateSellerProfile: SellerProfile;
};


export type MutationAddToFavoritesArgs = {
  productId: Scalars['String']['input'];
};


export type MutationAddToProductCategoriesArgs = {
  categoryId: Scalars['ID']['input'];
  productId: Scalars['ID']['input'];
};


export type MutationCancelMultipleOrdersArgs = {
  orderIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type MutationCancelOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationConfirmPaymentArgs = {
  orderIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  paymentIntentId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateCheckoutArgs = {
  fulfillmentMethod: FulfillmentMethod;
  productIds: Array<Scalars['String']['input']>;
};


export type MutationCreateSellerProfileArgs = {
  newSellerProfile: SellerProfileInput;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSellerProfileArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSingleProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveFromFavoritesArgs = {
  productId: Scalars['String']['input'];
};


export type MutationRemoveFromProductCategoriesArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateSellerProfileArgs = {
  sellerProfileUpdates: UpdateSellerProfileInput;
};

export type Order = {
  __typename?: 'Order';
  buyerId: Scalars['ID']['output'];
  createdAt: Scalars['Date']['output'];
  currency: Scalars['String']['output'];
  fulfillmentMethod?: Maybe<FulfillmentMethod>;
  id: Scalars['ID']['output'];
  orderItems: Array<OrderItem>;
  sellerId: Scalars['ID']['output'];
  sellerProfile?: Maybe<SellerProfile>;
  status: Scalars['String']['output'];
  totalAmount: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  createdAt: Scalars['Date']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  orderId: Scalars['ID']['output'];
  product?: Maybe<Product>;
  productId: Scalars['ID']['output'];
  unitPrice: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export enum OrderStatusEnum {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Paid = 'PAID',
  Pending = 'PENDING'
}

export type OrdersPage = {
  __typename?: 'OrdersPage';
  items: Array<Order>;
  total: Scalars['Int']['output'];
};

export type PaginationInput = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<SortBy>;
  sortDirection?: InputMaybe<SortDir>;
};

export type Product = {
  __typename?: 'Product';
  categories?: Maybe<Array<Category>>;
  color?: Maybe<Scalars['String']['output']>;
  condition: ProductCondition;
  createdAt: Scalars['Date']['output'];
  currency: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  images: Array<ProductImage>;
  imagesJson: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  sellerId: Scalars['ID']['output'];
  sellerProfile: SellerProfile;
  size?: Maybe<Scalars['String']['output']>;
  status: ProductStatusenum;
  unitPrice: Scalars['Int']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type ProductCategory = {
  __typename?: 'ProductCategory';
  categoryId: Scalars['ID']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  productId: Scalars['ID']['output'];
  products?: Maybe<Array<Product>>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export enum ProductCondition {
  Correct = 'CORRECT',
  Damaged = 'DAMAGED',
  Excellent = 'EXCELLENT',
  Good = 'GOOD',
  Used = 'USED'
}

export type ProductFilterInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  condition?: InputMaybe<Array<ProductCondition>>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  maxPrice?: InputMaybe<Scalars['Int']['input']>;
  minPrice?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['String']['input']>;
};

export type ProductImage = {
  __typename?: 'ProductImage';
  bytes?: Maybe<Scalars['Int']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  publicId?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  width?: Maybe<Scalars['Int']['output']>;
};

export enum ProductStatusenum {
  Available = 'AVAILABLE',
  Reserved = 'RESERVED',
  Sold = 'SOLD'
}

export type ProductsPage = {
  __typename?: 'ProductsPage';
  currentPage: Scalars['Int']['output'];
  items: Array<Product>;
  totalPages: Scalars['Int']['output'];
  totalProducts: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  allOrders?: Maybe<Array<Maybe<Order>>>;
  categories: Array<Category>;
  category?: Maybe<Category>;
  favorites: Array<Favorite>;
  ordersByIds?: Maybe<Array<Maybe<Order>>>;
  product?: Maybe<Product>;
  products: ProductsPage;
  productsByIds: Array<Product>;
  sellerProducts: Array<Product>;
  sellerProfile?: Maybe<SellerProfile>;
  sellerProfiles: Array<SellerProfile>;
  sellerSales: OrdersPage;
  singleOrder?: Maybe<Order>;
  user?: Maybe<User>;
  userOrders: OrdersPage;
  userPendingOrders: OrdersPage;
  users: Array<User>;
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrdersByIdsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductsArgs = {
  filter?: InputMaybe<ProductFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryProductsByIdsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QuerySellerProductsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type SellerProfile = {
  __typename?: 'SellerProfile';
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  payoutAccount?: Maybe<Scalars['String']['output']>;
  products: Array<Product>;
  rating?: Maybe<Scalars['Int']['output']>;
  shopName?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  user: User;
  userId: Scalars['ID']['output'];
  verified: VerificationStatus;
};

export type SellerProfileInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  payoutAccount?: InputMaybe<Scalars['String']['input']>;
  shopName?: InputMaybe<Scalars['String']['input']>;
  verified: VerificationStatus;
};

export enum SortBy {
  Date = 'DATE',
  Price = 'PRICE'
}

export enum SortDir {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type UpdateProductInput = {
  condition: ProductCondition;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  imagesJson: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  sellerId?: InputMaybe<Scalars['ID']['input']>;
  size?: InputMaybe<Scalars['String']['input']>;
  unitPrice: Scalars['Int']['input'];
};

export type UpdateSellerProfileInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  payoutAccount?: InputMaybe<Scalars['String']['input']>;
  shopName?: InputMaybe<Scalars['String']['input']>;
  verified: VerificationStatus;
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export enum VerificationStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Verified = 'VERIFIED'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CancelAllOrdersPayload: ResolverTypeWrapper<CancelAllOrdersPayload>;
  CancelOrderPayload: ResolverTypeWrapper<CancelOrderPayload>;
  Category: ResolverTypeWrapper<Category>;
  ConfirmPaymentPayload: ResolverTypeWrapper<ConfirmPaymentPayload>;
  CreateCheckoutPayload: ResolverTypeWrapper<CreateCheckoutPayload>;
  CreateOrderPayload: ResolverTypeWrapper<CreateOrderPayload>;
  CreateProductInput: CreateProductInput;
  Date: ResolverTypeWrapper<Scalars['Date']['output']>;
  Favorite: ResolverTypeWrapper<Favorite>;
  FavoritesInput: FavoritesInput;
  FulfillmentMethod: FulfillmentMethod;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Order: ResolverTypeWrapper<Order>;
  OrderItem: ResolverTypeWrapper<OrderItem>;
  OrderStatusEnum: OrderStatusEnum;
  OrdersPage: ResolverTypeWrapper<OrdersPage>;
  PaginationInput: PaginationInput;
  Product: ResolverTypeWrapper<Product>;
  ProductCategory: ResolverTypeWrapper<ProductCategory>;
  ProductCondition: ProductCondition;
  ProductFilterInput: ProductFilterInput;
  ProductImage: ResolverTypeWrapper<ProductImage>;
  ProductStatusenum: ProductStatusenum;
  ProductsPage: ResolverTypeWrapper<ProductsPage>;
  Query: ResolverTypeWrapper<{}>;
  SellerProfile: ResolverTypeWrapper<SellerProfile>;
  SellerProfileInput: SellerProfileInput;
  SortBy: SortBy;
  SortDir: SortDir;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateProductInput: UpdateProductInput;
  UpdateSellerProfileInput: UpdateSellerProfileInput;
  User: ResolverTypeWrapper<User>;
  VerificationStatus: VerificationStatus;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  CancelAllOrdersPayload: CancelAllOrdersPayload;
  CancelOrderPayload: CancelOrderPayload;
  Category: Category;
  ConfirmPaymentPayload: ConfirmPaymentPayload;
  CreateCheckoutPayload: CreateCheckoutPayload;
  CreateOrderPayload: CreateOrderPayload;
  CreateProductInput: CreateProductInput;
  Date: Scalars['Date']['output'];
  Favorite: Favorite;
  FavoritesInput: FavoritesInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Order: Order;
  OrderItem: OrderItem;
  OrdersPage: OrdersPage;
  PaginationInput: PaginationInput;
  Product: Product;
  ProductCategory: ProductCategory;
  ProductFilterInput: ProductFilterInput;
  ProductImage: ProductImage;
  ProductsPage: ProductsPage;
  Query: {};
  SellerProfile: SellerProfile;
  SellerProfileInput: SellerProfileInput;
  String: Scalars['String']['output'];
  UpdateProductInput: UpdateProductInput;
  UpdateSellerProfileInput: UpdateSellerProfileInput;
  User: User;
};

export type CancelAllOrdersPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CancelAllOrdersPayload'] = ResolversParentTypes['CancelAllOrdersPayload']> = {
  cancelledOrders?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  productIds?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  releasedProducts?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CancelOrderPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CancelOrderPayload'] = ResolversParentTypes['CancelOrderPayload']> = {
  orderId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orderStatus?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productIds?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  products?: Resolver<Maybe<Array<ResolversTypes['Product']>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConfirmPaymentPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConfirmPaymentPayload'] = ResolversParentTypes['ConfirmPaymentPayload']> = {
  orderIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  orderStatus?: Resolver<ResolversTypes['OrderStatusEnum'], ParentType, ContextType>;
  productIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  productStatus?: Resolver<ResolversTypes['ProductStatusenum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCheckoutPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateCheckoutPayload'] = ResolversParentTypes['CreateCheckoutPayload']> = {
  clientSecret?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  orders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  stripePublicKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateOrderPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateOrderPayload'] = ResolversParentTypes['CreateOrderPayload']> = {
  fulfillmentMethod?: Resolver<Maybe<ResolversTypes['FulfillmentMethod']>, ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type FavoriteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Favorite'] = ResolversParentTypes['Favorite']> = {
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  addToFavorites?: Resolver<Maybe<ResolversTypes['Favorite']>, ParentType, ContextType, RequireFields<MutationAddToFavoritesArgs, 'productId'>>;
  addToProductCategories?: Resolver<ResolversTypes['ProductCategory'], ParentType, ContextType, RequireFields<MutationAddToProductCategoriesArgs, 'categoryId' | 'productId'>>;
  cancelAllOrders?: Resolver<ResolversTypes['CancelAllOrdersPayload'], ParentType, ContextType>;
  cancelMultipleOrders?: Resolver<ResolversTypes['CancelAllOrdersPayload'], ParentType, ContextType, Partial<MutationCancelMultipleOrdersArgs>>;
  cancelOrder?: Resolver<ResolversTypes['CancelOrderPayload'], ParentType, ContextType, RequireFields<MutationCancelOrderArgs, 'orderId'>>;
  confirmPayment?: Resolver<Maybe<ResolversTypes['ConfirmPaymentPayload']>, ParentType, ContextType, Partial<MutationConfirmPaymentArgs>>;
  createCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'name'>>;
  createCheckout?: Resolver<ResolversTypes['CreateCheckoutPayload'], ParentType, ContextType, RequireFields<MutationCreateCheckoutArgs, 'fulfillmentMethod' | 'productIds'>>;
  createSellerProfile?: Resolver<ResolversTypes['SellerProfile'], ParentType, ContextType, RequireFields<MutationCreateSellerProfileArgs, 'newSellerProfile'>>;
  deleteAllProducts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Product']>>>, ParentType, ContextType>;
  deleteCategory?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteSellerProfile?: Resolver<Maybe<ResolversTypes['SellerProfile']>, ParentType, ContextType, RequireFields<MutationDeleteSellerProfileArgs, 'id'>>;
  deleteSingleProduct?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<MutationDeleteSingleProductArgs, 'id'>>;
  removeFromFavorites?: Resolver<Maybe<ResolversTypes['Favorite']>, ParentType, ContextType, RequireFields<MutationRemoveFromFavoritesArgs, 'productId'>>;
  removeFromProductCategories?: Resolver<Maybe<ResolversTypes['ProductCategory']>, ParentType, ContextType, RequireFields<MutationRemoveFromProductCategoriesArgs, 'id'>>;
  updateSellerProfile?: Resolver<ResolversTypes['SellerProfile'], ParentType, ContextType, RequireFields<MutationUpdateSellerProfileArgs, 'sellerProfileUpdates'>>;
};

export type OrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = {
  buyerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fulfillmentMethod?: Resolver<Maybe<ResolversTypes['FulfillmentMethod']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orderItems?: Resolver<Array<ResolversTypes['OrderItem']>, ParentType, ContextType>;
  sellerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sellerProfile?: Resolver<Maybe<ResolversTypes['SellerProfile']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderItem'] = ResolversParentTypes['OrderItem']> = {
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orderId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrdersPageResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrdersPage'] = ResolversParentTypes['OrdersPage']> = {
  items?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = {
  categories?: Resolver<Maybe<Array<ResolversTypes['Category']>>, ParentType, ContextType>;
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  condition?: Resolver<ResolversTypes['ProductCondition'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  images?: Resolver<Array<ResolversTypes['ProductImage']>, ParentType, ContextType>;
  imagesJson?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sellerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sellerProfile?: Resolver<ResolversTypes['SellerProfile'], ParentType, ContextType>;
  size?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ProductStatusenum'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductCategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductCategory'] = ResolversParentTypes['ProductCategory']> = {
  categoryId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  products?: Resolver<Maybe<Array<ResolversTypes['Product']>>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductImage'] = ResolversParentTypes['ProductImage']> = {
  bytes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  format?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  height?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  publicId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  width?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductsPageResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductsPage'] = ResolversParentTypes['ProductsPage']> = {
  currentPage?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  totalPages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalProducts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  allOrders?: Resolver<Maybe<Array<Maybe<ResolversTypes['Order']>>>, ParentType, ContextType>;
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<QueryCategoryArgs, 'id'>>;
  favorites?: Resolver<Array<ResolversTypes['Favorite']>, ParentType, ContextType>;
  ordersByIds?: Resolver<Maybe<Array<Maybe<ResolversTypes['Order']>>>, ParentType, ContextType, RequireFields<QueryOrdersByIdsArgs, 'ids'>>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductArgs, 'id'>>;
  products?: Resolver<ResolversTypes['ProductsPage'], ParentType, ContextType, Partial<QueryProductsArgs>>;
  productsByIds?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductsByIdsArgs, 'ids'>>;
  sellerProducts?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, Partial<QuerySellerProductsArgs>>;
  sellerProfile?: Resolver<Maybe<ResolversTypes['SellerProfile']>, ParentType, ContextType>;
  sellerProfiles?: Resolver<Array<ResolversTypes['SellerProfile']>, ParentType, ContextType>;
  sellerSales?: Resolver<ResolversTypes['OrdersPage'], ParentType, ContextType>;
  singleOrder?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userOrders?: Resolver<ResolversTypes['OrdersPage'], ParentType, ContextType>;
  userPendingOrders?: Resolver<ResolversTypes['OrdersPage'], ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type SellerProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['SellerProfile'] = ResolversParentTypes['SellerProfile']> = {
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  payoutAccount?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  shopName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['VerificationStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatarUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CancelAllOrdersPayload?: CancelAllOrdersPayloadResolvers<ContextType>;
  CancelOrderPayload?: CancelOrderPayloadResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  ConfirmPaymentPayload?: ConfirmPaymentPayloadResolvers<ContextType>;
  CreateCheckoutPayload?: CreateCheckoutPayloadResolvers<ContextType>;
  CreateOrderPayload?: CreateOrderPayloadResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Favorite?: FavoriteResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  OrderItem?: OrderItemResolvers<ContextType>;
  OrdersPage?: OrdersPageResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductCategory?: ProductCategoryResolvers<ContextType>;
  ProductImage?: ProductImageResolvers<ContextType>;
  ProductsPage?: ProductsPageResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SellerProfile?: SellerProfileResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

