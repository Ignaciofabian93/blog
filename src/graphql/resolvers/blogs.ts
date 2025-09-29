import { type OrderBy } from "../../types/general";
import { type BlogCategory, type BlogStatus } from "../../types/blog";
import { BlogService } from "../services/blog";
import { AdminService } from "../services/admin";

type singleArgs = { id: string | number; take?: number; skip?: number; orderBy?: OrderBy };
type blogFilterArgs = {
  take?: number;
  skip?: number;
  orderBy?: OrderBy;
  filter?: {
    category?: BlogCategory;
    status?: BlogStatus;
    adminId?: string;
    search?: string;
  };
};

export const BlogResolver = {
  Query: {
    blogCategories: () => BlogService.getBlogCategories(),
    blogs: (_parent: unknown, args: blogFilterArgs) => BlogService.getBlogs(args),
    // blog: (_parent: unknown, args: { id?: string; slug?: string }) => BlogService.getBlog(args),
    // blogsByCategory: (_parent: unknown, args: { category: BlogCategory; take?: number; skip?: number }) =>
    //   BlogService.getBlogsByCategory(args),
    // popularBlogs: (_parent: unknown, args: { take?: number }) => BlogService.getPopularBlogs(args),
    // recentBlogs: (_parent: unknown, args: { take?: number }) => BlogService.getRecentBlogs(args),
    // blogsByAdmin: (_parent: unknown, args: { adminId: string; take?: number; skip?: number }) =>
    //   BlogService.getBlogsByAdmin(args),
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
    __resolveReference: (reference: singleArgs) => BlogService.getBlog({ id: reference.id.toString() }),
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
