import gql from "graphql-tag";

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external"])

  # Federated user type from users subgraph
  extend type Seller @key(fields: "id") {
    id: ID! @external
  }

  extend type Admin @key(fields: "id") {
    id: ID! @external
  }

  type PageInfo @shareable {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
    totalCount: Int!
    totalPages: Int!
    currentPage: Int!
    pageSize: Int!
  }

  enum BlogReactionType {
    LIKE
    DISLIKE
  }

  enum BlogType {
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
    SECURITY
  }

  type BlogCategory {
    id: ID!
    name: String!
    icon: String
    description: String
    blogs: [BlogPost!]!
  }

  type BlogPost @key(fields: "id") {
    id: ID!
    title: String!
    content: String!
    authorId: String!
    isPublished: Boolean!
    publishedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    category: BlogCategory!
    author: Admin!
    likes: Int
    dislikes: Int
  }

  type BlogPostsConnection {
    nodes: [BlogPost!]!
    pageInfo: PageInfo!
  }

  type BlogReaction {
    id: ID!
    blogPostId: ID!
    sellerId: ID!
    reaction: BlogReactionType!
  }

  scalar DateTime
  scalar JSON

  extend type Query {
    blogCategories: [BlogCategory!]!
    blogs(page: Int! = 1, pageSize: Int! = 10): BlogPostsConnection!
    blog(id: ID!): BlogPost
    blogsByCategory(category: BlogType!, page: Int! = 1, pageSize: Int! = 10): BlogPostsConnection!
    blogsByAuthor(authorId: String!, page: Int! = 1, pageSize: Int! = 10): BlogPostsConnection!
  }

  extend type Mutation {
    likeBlog(id: ID!, sellerId: String!): BlogPost!
    dislikeBlog(id: ID!, sellerId: String!): BlogPost!
  }
`;
