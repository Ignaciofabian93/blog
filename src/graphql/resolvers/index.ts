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
};
