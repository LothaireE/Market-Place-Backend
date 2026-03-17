const productTypeDefs = `#graphql
  enum SortBy {
    DATE
    PRICE
  }

  enum SortDir {
    ASC
    DESC
  }

  enum ProductCondition {
    EXCELLENT
    GOOD
    CORRECT
    USED
    DAMAGED
  }

  enum OrderStatusEnum {
    PENDING
    PAID
    FAILED
    CANCELLED
    COMPLETED
  }

  enum ProductStatusenum {
    AVAILABLE
    RESERVED
    SOLD
  }

  scalar Date

  type ProductImage {
    publicId: String
    url: String
    width: Int
    height: Int
    bytes: Int
    format: String
    name: String
  }

  type Product {
    id: ID!
    name: String!
    description: String
    unitPrice: Int!
    currency: String!
    size: String
    color: String
    imagesJson: [String!]!
    condition: ProductCondition!
    createdAt: Date!
    updatedAt: Date!
    sellerId: ID!
    sellerProfile: SellerProfile!
    images: [ProductImage!]!
    categories: [Category!]
    status: ProductStatusenum!
  }

  type Favorite {
    id: ID!
    userId: ID!
    productId: ID!
    product: Product!
    createdAt: Date!
  }

  type ProductsPage {
    items: [Product!]!
    totalProducts: Int!
    totalPages: Int!
    currentPage: Int!
  }

  type Category {
    id: ID!
    name: String!
    createdAt: Date!
    updatedAt: Date
    products: [Product!]
  }

  type ProductCategory {
    id: ID!
    productId: ID!
    categoryId: ID!
    products: [Product!]
    createdAt: Date!
    updatedAt: Date
  }

  input CreateProductInput {
    name: String!
    description: String
    unitPrice: Int!
    size: String
    color: String
    imagesJson: [String!]!
    condition: ProductCondition!
    sellerId: ID
    categoryIds: [ID!]
  }

  input UpdateProductInput {
    id: ID!
    name: String!
    description: String
    unitPrice: Int!
    size: String
    imagesJson: [String!]!
    condition: ProductCondition!
    sellerId: ID
  }

  input PaginationInput {
    page: Int = 1
    pageSize: Int = 12
    sortDirection: SortDir = DESC
    sortBy: SortBy
  }

  input ProductFilterInput {
    ids: [ID!]
    q: String
    minPrice: Int = 0
    maxPrice: Int = 10000
    size: String
    condition: [ProductCondition!]
    category: String
    color: String
    search: String
  }

  input FavoritesInput {
    userId: ID!
    productId: ID!
  }

  enum FulfillmentMethod {
    MEETUP
    SHIPPING
  }

  type CreateOrderPayload {
    orderId: ID!
    fulfillmentMethod: FulfillmentMethod
  }

  type CancelOrderPayload {
    orderId: ID!
    orderStatus: String!
    productIds: [String!]!
  }

  type CancelAllOrdersPayload {
    cancelledOrders: Int
    releasedProducts: Int
    productIds: [String]
  }

  type OrderItem {
    id: ID!
    orderId: ID!
    productId: ID!
    unitPrice: String!
    currency: String!
    createdAt: Date!
    updatedAt: Date
    product: Product
  }

  type OrdersPage {
    items: [Order!]!
    total: Int!
  }

  type ConfirmPaymentPayload {
    orderIds: [ID!]!
    orderStatus: OrderStatusEnum!
    productIds: [ID!]!
    productStatus: ProductStatusenum!
  }

  type Order {
    id: ID!
    buyerId: ID!
    sellerId: ID!
    status: String!
    currency: String!
    totalAmount: Int!
    orderItems: [OrderItem!]!
    sellerProfile: SellerProfile
    fulfillmentMethod: FulfillmentMethod
    createdAt: Date!
    updatedAt: Date
  }

  type CreateCheckoutPayload {
    orders: [Order!]!
    stripePublicKey: String
    clientSecret: String
  }
`;

export default productTypeDefs;