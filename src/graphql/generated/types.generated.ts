import { GraphQLResolveInfo } from 'graphql';
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
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  products: Array<Product>;
  updatedAt: Scalars['String']['output'];
};

export type CreateProductInput = {
  condition: ProductCondition;
  description?: InputMaybe<Scalars['String']['input']>;
  imagesUrl: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Int']['input'];
  sellerId?: InputMaybe<Scalars['ID']['input']>;
  size?: InputMaybe<Scalars['String']['input']>;
};

export type Favorite = {
  __typename?: 'Favorite';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  product: Product;
  productId: Scalars['ID']['output'];
  userId: Scalars['ID']['output'];
};

export type FavoritesInput = {
  productId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addToFavorites?: Maybe<Favorite>;
  addToProductCategories: ProductCategory;
  createCategory: Category;
  createProduct: Product;
  createSellerProfile: SellerProfile;
  deleteAllProducts?: Maybe<Array<Maybe<Product>>>;
  deleteCategory?: Maybe<Category>;
  deleteSellerProfile?: Maybe<SellerProfile>;
  deleteSingleProduct?: Maybe<Product>;
  removeFromFavorites?: Maybe<Favorite>;
  removeFromProductCategories?: Maybe<ProductCategory>;
  updateProduct: Product;
  updateSellerProfile: SellerProfile;
};


export type MutationAddToFavoritesArgs = {
  favoriteInput: FavoritesInput;
};


export type MutationAddToProductCategoriesArgs = {
  categoryId: Scalars['ID']['input'];
  productId: Scalars['ID']['input'];
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateProductArgs = {
  newProduct: CreateProductInput;
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
  favoriteInput: FavoritesInput;
};


export type MutationRemoveFromProductCategoriesArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateProductArgs = {
  productUpdates: UpdateProductInput;
};


export type MutationUpdateSellerProfileArgs = {
  sellerProfileUpdates: UpdateSellerProfileInput;
};

export type PaginationInput = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<SortBy>;
  sortDirection?: InputMaybe<SortDir>;
};

export type Product = {
  __typename?: 'Product';
  color?: Maybe<Scalars['String']['output']>;
  condition: ProductCondition;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imagesUrl: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['Int']['output'];
  sellerId: Scalars['ID']['output'];
  sellerProfile: SellerProfile;
  size?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type ProductCategory = {
  __typename?: 'ProductCategory';
  categoryId: Scalars['ID']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  productId: Scalars['ID']['output'];
  products: Array<Product>;
  updatedAt: Scalars['String']['output'];
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
  condition: ProductCondition;
  maxPrice?: InputMaybe<Scalars['Int']['input']>;
  minPrice?: InputMaybe<Scalars['Int']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['String']['input']>;
};

export type ProductsPage = {
  __typename?: 'ProductsPage';
  currentPage: Scalars['Int']['output'];
  items: Array<Product>;
  totalPages: Scalars['Int']['output'];
  totalProducts: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Category>;
  category?: Maybe<Category>;
  favorites: Array<Favorite>;
  product?: Maybe<Product>;
  products: ProductsPage;
  sellerProducts: Array<Product>;
  sellerProfile?: Maybe<SellerProfile>;
  sellerProfiles: Array<SellerProfile>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductsArgs = {
  filter?: InputMaybe<ProductFilterInput>;
  pagination: PaginationInput;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
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
  userId: Scalars['ID']['input'];
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
  imagesUrl: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Int']['input'];
  sellerId?: InputMaybe<Scalars['ID']['input']>;
  size?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSellerProfileInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
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
  Category: ResolverTypeWrapper<Category>;
  CreateProductInput: CreateProductInput;
  Favorite: ResolverTypeWrapper<Favorite>;
  FavoritesInput: FavoritesInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  PaginationInput: PaginationInput;
  Product: ResolverTypeWrapper<Product>;
  ProductCategory: ResolverTypeWrapper<ProductCategory>;
  ProductCondition: ProductCondition;
  ProductFilterInput: ProductFilterInput;
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
  Category: Category;
  CreateProductInput: CreateProductInput;
  Favorite: Favorite;
  FavoritesInput: FavoritesInput;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  PaginationInput: PaginationInput;
  Product: Product;
  ProductCategory: ProductCategory;
  ProductFilterInput: ProductFilterInput;
  ProductsPage: ProductsPage;
  Query: {};
  SellerProfile: SellerProfile;
  SellerProfileInput: SellerProfileInput;
  String: Scalars['String']['output'];
  UpdateProductInput: UpdateProductInput;
  UpdateSellerProfileInput: UpdateSellerProfileInput;
  User: User;
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FavoriteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Favorite'] = ResolversParentTypes['Favorite']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addToFavorites?: Resolver<Maybe<ResolversTypes['Favorite']>, ParentType, ContextType, RequireFields<MutationAddToFavoritesArgs, 'favoriteInput'>>;
  addToProductCategories?: Resolver<ResolversTypes['ProductCategory'], ParentType, ContextType, RequireFields<MutationAddToProductCategoriesArgs, 'categoryId' | 'productId'>>;
  createCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'name'>>;
  createProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationCreateProductArgs, 'newProduct'>>;
  createSellerProfile?: Resolver<ResolversTypes['SellerProfile'], ParentType, ContextType, RequireFields<MutationCreateSellerProfileArgs, 'newSellerProfile'>>;
  deleteAllProducts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Product']>>>, ParentType, ContextType>;
  deleteCategory?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteSellerProfile?: Resolver<Maybe<ResolversTypes['SellerProfile']>, ParentType, ContextType, RequireFields<MutationDeleteSellerProfileArgs, 'id'>>;
  deleteSingleProduct?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<MutationDeleteSingleProductArgs, 'id'>>;
  removeFromFavorites?: Resolver<Maybe<ResolversTypes['Favorite']>, ParentType, ContextType, RequireFields<MutationRemoveFromFavoritesArgs, 'favoriteInput'>>;
  removeFromProductCategories?: Resolver<Maybe<ResolversTypes['ProductCategory']>, ParentType, ContextType, RequireFields<MutationRemoveFromProductCategoriesArgs, 'id'>>;
  updateProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationUpdateProductArgs, 'productUpdates'>>;
  updateSellerProfile?: Resolver<ResolversTypes['SellerProfile'], ParentType, ContextType, RequireFields<MutationUpdateSellerProfileArgs, 'sellerProfileUpdates'>>;
};

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = {
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  condition?: Resolver<ResolversTypes['ProductCondition'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imagesUrl?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sellerId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sellerProfile?: Resolver<ResolversTypes['SellerProfile'], ParentType, ContextType>;
  size?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductCategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductCategory'] = ResolversParentTypes['ProductCategory']> = {
  categoryId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<QueryCategoryArgs, 'id'>>;
  favorites?: Resolver<Array<ResolversTypes['Favorite']>, ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductArgs, 'id'>>;
  products?: Resolver<ResolversTypes['ProductsPage'], ParentType, ContextType, RequireFields<QueryProductsArgs, 'pagination'>>;
  sellerProducts?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  sellerProfile?: Resolver<Maybe<ResolversTypes['SellerProfile']>, ParentType, ContextType>;
  sellerProfiles?: Resolver<Array<ResolversTypes['SellerProfile']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
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
  Category?: CategoryResolvers<ContextType>;
  Favorite?: FavoriteResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductCategory?: ProductCategoryResolvers<ContextType>;
  ProductsPage?: ProductsPageResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SellerProfile?: SellerProfileResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

