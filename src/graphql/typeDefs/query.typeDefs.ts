const queryTypeDefs = `#graphql
    extend type Query {
        user: User
        users: [User!]!
        userOrders: OrdersPage!
        userPendingOrders: OrdersPage!
        allOrders: [Order]
        ordersByIds(ids: [ID!]!): [Order]
        singleOrder: Order
        sellerProfile: SellerProfile
        sellerProfiles: [SellerProfile!]!
        sellerSales: OrdersPage!
        product(id: ID!): Product
        products(
            filter: ProductFilterInput
            pagination: PaginationInput
        ): ProductsPage!
        productsByIds(ids: [ID!]!): [Product!]!
        sellerProducts(pagination: PaginationInput): [Product!]!
        favorites: [Favorite!]!
        categories: [Category!]!
        category(id: ID!): Category
    }
`

export default queryTypeDefs;