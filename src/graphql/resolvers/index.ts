import { BlogResolver } from "./blogs";
import { CommunityResolver } from "./community";

export const resolvers = {
  Query: {
    ...BlogResolver.Query,
    ...CommunityResolver.Query,
  },
  Mutation: {
    ...BlogResolver.Mutation,
    ...CommunityResolver.Mutation,
  },
  BlogPost: {
    author(blogPost: { authorId: string }) {
      // Return a reference that Apollo Federation will resolve from the users subgraph
      return { __typename: "Admin", id: blogPost.authorId };
    },
  },
};
