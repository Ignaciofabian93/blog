import { BlogResolver } from "./blogs";

export const resolvers = {
  Query: {
    ...BlogResolver.Query,
  },
  Mutation: {
    ...BlogResolver.Mutation,
  },
  Blog: {
    __resolveReference: BlogResolver.Blog.__resolveReference,
  },
  Admin: {
    __resolveReference: BlogResolver.Admin.__resolveReference,
  },
};
