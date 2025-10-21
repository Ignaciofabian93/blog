import { BlogResolver } from "./blogs";

export const resolvers = {
  Query: {
    ...BlogResolver.Query,
  },
  Mutation: {
    ...BlogResolver.Mutation,
  },
};
