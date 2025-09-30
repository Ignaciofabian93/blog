import gql from "graphql-tag";

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external"])

  # Federated user type from users subgraph
  extend type User @key(fields: "id") {
    id: ID! @external
  }

  extend type Admin @key(fields: "id") {
    id: ID! @external
  }

  # Blog-specific enums
  enum BlogStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  enum BlogCategoryType {
    RECYCLING
    POLLUTION
    SUSTAINABILITY
    CIRCULAR_ECONOMY
    USED_PRODUCTS
    REUSE
    ENVIRONMENT
    UPCYCLING
    RESPONSIBLE_CONSUMPTION
    ECO_TIPS
    ENVIRONMENTAL_IMPACT
    SUSTAINABLE_LIVING
    OTHER
  }

  type BlogCategory {
    id: ID!
    name: String!
  }

  type BlogComment {
    id: ID!
    comment: String!
    userId: String!
    user: User # Federated user reference
    createdAt: DateTime!
  }

  type BlogLike {
    id: ID!
    userId: String!
    user: User # Federated user reference
    createdAt: DateTime!
  }

  type Blog @key(fields: "id") {
    id: ID!
    title: String!
    content: String!
    excerpt: String
    slug: String!
    category: BlogCategoryType!
    status: BlogStatus!
    featuredImage: String
    images: [String]
    tags: [String]
    metaTitle: String
    metaDescription: String
    readingTime: Int
    views: Int
    publishedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    adminId: String!
    admin: Admin # Reference to the admin who wrote the blog
    comments: [BlogComment]
    likes: [BlogLike]
    likesCount: Int
    commentsCount: Int
  }

  scalar DateTime
  scalar JSON

  enum SortDirection {
    asc
    desc
  }

  input OrderByInput {
    field: String!
    direction: SortDirection!
  }

  input BlogFilterInput {
    category: BlogCategoryType
    status: BlogStatus
    adminId: String
    search: String
  }

  extend type Query {
    # Blog queries
    blogCategories: [BlogCategory!]!
    blogs(take: Int = 10, skip: Int = 0, orderBy: OrderByInput, filter: BlogFilterInput): [Blog]

    blog(id: ID, slug: String): Blog

    blogsByCategory(category: BlogCategoryType!, take: Int = 10, skip: Int = 0): [Blog]

    popularBlogs(take: Int = 10): [Blog]

    recentBlogs(take: Int = 10): [Blog]

    blogsByAdmin(adminId: String!, take: Int = 10, skip: Int = 0): [Blog]
  }

  extend type Mutation {
    # Blog mutations (admin only)
    createBlog(
      title: String!
      content: String!
      excerpt: String
      slug: String!
      category: BlogCategoryType!
      status: BlogStatus = DRAFT
      featuredImage: String
      images: [String]
      tags: [String]
      metaTitle: String
      metaDescription: String
      adminId: String!
    ): Blog

    updateBlog(
      id: ID!
      title: String
      content: String
      excerpt: String
      slug: String
      category: BlogCategoryType
      status: BlogStatus
      featuredImage: String
      images: [String]
      tags: [String]
      metaTitle: String
      metaDescription: String
    ): Blog

    deleteBlog(id: ID!): Blog

    publishBlog(id: ID!): Blog

    unpublishBlog(id: ID!): Blog

    # Blog interactions (users)
    likeBlog(id: ID!, userId: String!): Blog

    commentOnBlog(blogId: ID!, userId: String!, comment: String!): BlogComment
  }
`;
