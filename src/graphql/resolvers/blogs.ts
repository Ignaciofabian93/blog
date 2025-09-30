import { type OrderBy } from "../../types/general";
import { BlogService } from "../services/blog";
import { AdminService } from "../services/admin";
import { type BlogCategoryEnum } from "../../types/blog";

type singleArgs = { id: number; take?: number; skip?: number; orderBy?: OrderBy };
type blogFilterArgs = {
  take?: number;
  skip?: number;
  orderBy?: OrderBy;
};

export const BlogResolver = {
  Query: {
    blogCategories: () => BlogService.getBlogCategories(),
    blogs: (_parent: unknown, args: blogFilterArgs) => BlogService.getBlogs(args),
    blog: (_parent: unknown, args: { id: number }) => BlogService.getBlog(args),
    blogsByCategory: (_parent: unknown, args: { category: BlogCategoryEnum; take?: number; skip?: number }) =>
      BlogService.getBlogsByCategory(args),
    blogsByAuthor: (_parent: unknown, args: { authorId: string; take?: number; skip?: number }) =>
      BlogService.getBlogsByAuthor(args),
  },
  Mutation: {
    createBlog: (
      _parent: unknown,
      args: {
        title: string;
        content: string;
        authorId: string;
        tags?: string[];
        isPublished?: boolean;
      },
    ) => BlogService.createBlog(args),
    // updateBlog: (
    //   _parent: unknown,
    //   args: {
    //     id: string;
    //     title?: string;
    //     content?: string;
    //     tags?: string[];
    //     isPublished?: boolean;
    //   },
    // ) => BlogService.updateBlog(args),
    // deleteBlog: (_parent: unknown, args: { id: string }) => BlogService.deleteBlog(args),
    // publishBlog: (_parent: unknown, args: { id: string }) => BlogService.publishBlog(args),
    // unpublishBlog: (_parent: unknown, args: { id: string }) => BlogService.unpublishBlog(args),
    // likeBlog: (_parent: unknown, args: { id: string; userId: string }) => BlogService.toggleLikeBlog(args),
    // commentOnBlog: (_parent: unknown, args: { blogId: string; userId: string; comment: string }) =>
    //   BlogService.addComment(args),
  },
  Blog: {
    __resolveReference: (reference: singleArgs) => BlogService.getBlog({ id: reference.id }),
  },
  Admin: {
    __resolveReference: (reference: singleArgs) => AdminService.getAdmin({ id: reference.id.toString() }),
  },
  BlogLike: {
    user: (parent: { userId: string }) => ({ __typename: "User", id: parent.userId }),
  },
  BlogComment: {
    user: (parent: { userId: string }) => ({ __typename: "User", id: parent.userId }),
  },
};
