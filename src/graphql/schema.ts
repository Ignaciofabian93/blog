import gql from "graphql-tag";

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable", "@external"])

  # Federated user types from users subgraph
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
    type: BlogType!
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
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Community Types
  type CommunityCategory {
    id: ID!
    category: String!
    subcategories: [CommunitySubCategory!]!
  }

  type CommunitySubCategory {
    id: ID!
    subCategory: String!
    communityCategoryId: ID!
    category: CommunityCategory!
  }

  type CommunityPost @key(fields: "id") {
    id: ID!
    title: String!
    content: String!
    authorId: String!
    images: [String!]!
    likes: Int!
    comments: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    author: Admin!
    communityComments: [CommunityComment!]!
  }

  type CommunityComment {
    id: ID!
    communityPostId: ID!
    sellerId: ID!
    content: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    post: CommunityPost!
    author: Seller!
  }

  type CommunityPostsConnection {
    nodes: [CommunityPost!]!
    pageInfo: PageInfo!
  }

  type CommunityCommentsConnection {
    nodes: [CommunityComment!]!
    pageInfo: PageInfo!
  }

  scalar DateTime
  scalar JSON

  extend type Query {
    # Catalog Queries
    blogCatalog: [BlogCategory!]!
    communityCatalog: [CommunityCategory!]!
    # Blog Queries
    blogCategories: [BlogCategory!]!
    blogs(page: Int! = 1, pageSize: Int! = 10): BlogPostsConnection!
    blog(id: ID!): BlogPost
    blogsByCategory(category: BlogType!, page: Int! = 1, pageSize: Int! = 10): BlogPostsConnection!
    blogsByAuthor(authorId: String!, page: Int! = 1, pageSize: Int! = 10): BlogPostsConnection!

    # Community Queries
    communityCategories: [CommunityCategory!]!
    communityPosts(page: Int! = 1, pageSize: Int! = 10): CommunityPostsConnection!
    communityPost(id: ID!): CommunityPost
    communityPostsByAuthor(authorId: String!, page: Int! = 1, pageSize: Int! = 10): CommunityPostsConnection!
    communityComments(postId: ID!, page: Int! = 1, pageSize: Int! = 10): CommunityCommentsConnection!
  }

  extend type Mutation {
    # Blog Mutations
    createBlogPost(title: String!, content: String!, categoryId: ID!, type: BlogType!): BlogPost!
    updateBlogPost(id: ID!, title: String, content: String, categoryId: ID, type: BlogType): BlogPost!
    publishBlogPost(id: ID!): BlogPost!
    unpublishBlogPost(id: ID!): BlogPost!
    deleteBlogPost(id: ID!): Boolean!
    likeBlog(id: ID!, sellerId: String!): BlogPost!
    dislikeBlog(id: ID!, sellerId: String!): BlogPost!

    # Community Mutations
    createCommunityPost(title: String!, content: String!, images: [String!]): CommunityPost!
    updateCommunityPost(id: ID!, title: String, content: String, images: [String!]): CommunityPost!
    deleteCommunityPost(id: ID!): Boolean!
    likeCommunityPost(id: ID!): CommunityPost!
    createCommunityComment(postId: ID!, content: String!): CommunityComment!
    updateCommunityComment(id: ID!, content: String!): CommunityComment!
    deleteCommunityComment(id: ID!): Boolean!
  }
`;
