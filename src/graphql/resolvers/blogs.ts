import { BlogType } from "../../types/blog";
import { BlogService } from "../services/blog";

export type PaginationInput = {
  page?: number;
  pageSize?: number;
};

export type CreateBlogPostInput = {
  title: string;
  content: string;
  categoryId: number;
  type: BlogType;
};

export type UpdateBlogPostInput = {
  id: number;
  title?: string;
  content?: string;
  categoryId?: number;
  type?: BlogType;
};

export const BlogResolver = {
  Query: {
    blogCatalog: () => BlogService.getBlogCatalog(),
    blogCategories: () => BlogService.getBlogCategories(),
    blogs: (_parent: unknown, _args: PaginationInput) => BlogService.getBlogs(_args),
    blog: (_parent: unknown, _args: { id: number }) => BlogService.getBlog(_args),
    blogsByCategory: (_parent: unknown, _args: { category: keyof typeof BlogType } & PaginationInput) =>
      BlogService.getBlogsByCategory(_args),
    blogsByAuthor: (_parent: unknown, _args: { authorId: string } & PaginationInput) =>
      BlogService.getBlogsByAuthor(_args),
  },
  Mutation: {
    createBlogPost: (_parent: unknown, _args: CreateBlogPostInput) => BlogService.createBlogPost(_args),
    updateBlogPost: (_parent: unknown, _args: UpdateBlogPostInput) => BlogService.updateBlogPost(_args),
    publishBlogPost: (_parent: unknown, _args: { id: number }) => BlogService.publishBlogPost(_args),
    unpublishBlogPost: (_parent: unknown, _args: { id: number }) => BlogService.unpublishBlogPost(_args),
    deleteBlogPost: (_parent: unknown, _args: { id: number }) => BlogService.deleteBlogPost(_args),
    likeBlog: (_parent: unknown, _args: { id: number; sellerId: string }) => BlogService.likeBlog(_args),
    dislikeBlog: (_parent: unknown, _args: { id: number; sellerId: string }) => BlogService.dislikeBlog(_args),
  },
};
