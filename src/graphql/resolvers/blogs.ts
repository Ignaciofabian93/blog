import { BlogType } from "../../types/blog";
import { BlogService } from "../services/blog";

export type PaginationInput = {
  page?: number;
  pageSize?: number;
};

export const BlogResolver = {
  Query: {
    blogCategories: () => BlogService.getBlogCategories(),
    blogs: (_parent: unknown, _args: PaginationInput) => BlogService.getBlogs(_args),
    blog: (_parent: unknown, _args: { id: number }) => BlogService.getBlog(_args),
    blogsByCategory: (_parent: unknown, _args: { category: BlogType } & PaginationInput) =>
      BlogService.getBlogsByCategory(_args),
    blogsByAuthor: (_parent: unknown, _args: { authorId: string } & PaginationInput) =>
      BlogService.getBlogsByAuthor(_args),
  },
  Mutation: {
    likeBlog: (_parent: unknown, _args: { id: number; sellerId: string }) => BlogService.likeBlog(_args),
    dislikeBlog: (_parent: unknown, _args: { id: number; sellerId: string }) => BlogService.dislikeBlog(_args),
  },
};
