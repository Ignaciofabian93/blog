import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type BlogCategory } from "../../types/blog";
import { calculatePrismaParams, createPaginatedResponse } from "../../utils/pagination";
import { PaginationInput } from "../resolvers/blogs";
import { BlogType } from "@prisma/client";

export const BlogService = {
  getBlogCategories: async () => {
    const categories: BlogCategory[] = await prisma.blogCategory.findMany();
    if (!categories || categories.length === 0) {
      throw new ErrorService.NotFoundError("No se encontraron categorías de blogs");
    }

    console.log("Categories fetched:", categories);

    return categories;
  },
  getBlogs: async ({ page = 1, pageSize = 10 }: PaginationInput) => {
    try {
      const { take, skip } = calculatePrismaParams(page, pageSize);
      const totalCount = await prisma.blogPost.count({
        where: {
          isPublished: true,
        },
      });
      const blogs = await prisma.blogPost.findMany({
        where: {
          isPublished: true,
        },
        include: {
          author: true,
        },
        orderBy: {
          publishedAt: "desc",
        },
        take,
        skip,
      });

      if (!blogs || blogs.length === 0) {
        throw new ErrorService.NotFoundError("No se encontraron blogs");
      }

      return createPaginatedResponse(blogs, totalCount, page, pageSize);
    } catch (error) {
      console.error("Error getting blogs:", error);
      throw new ErrorService.InternalServerError("Error al obtener los blogs");
    }
  },

  getBlog: async ({ id }: { id: number }) => {
    try {
      if (!id) {
        throw new ErrorService.BadRequestError("Se requiere un ID de blog válido");
      }

      const blog = await prisma.blogPost.findFirst({
        where: { id },
        include: {
          author: true,
        },
      });

      if (!blog) {
        throw new ErrorService.NotFoundError("Blog no encontrado");
      }

      return blog;
    } catch (error) {
      console.error("Error getting blog:", error);
      throw error;
    }
  },

  getBlogsByCategory: async ({
    category = BlogType.OTHER,
    page = 1,
    pageSize = 10,
  }: { category: BlogType } & PaginationInput) => {
    try {
      const { take, skip } = calculatePrismaParams(page, pageSize);
      const totalCount = await prisma.blogPost.count({
        where: {
          isPublished: true,
          type: category,
        },
      });
      const blogs = await prisma.blogPost.findMany({
        where: {
          isPublished: true,
          type: category,
        },
        include: {
          author: true,
        },
        orderBy: {
          publishedAt: "desc",
        },
        take,
        skip,
      });

      return createPaginatedResponse(blogs, totalCount, page, pageSize);
    } catch (error) {
      console.error("Error getting blogs by category:", error);
      throw new ErrorService.InternalServerError("Error al obtener los blogs por categoría");
    }
  },

  getBlogsByAuthor: async ({ authorId, page = 1, pageSize = 10 }: { authorId: string } & PaginationInput) => {
    try {
      const { take, skip } = calculatePrismaParams(page, pageSize);
      const totalCount = await prisma.blogPost.count({
        where: {
          authorId,
        },
      });
      const blogs = await prisma.blogPost.findMany({
        where: {
          authorId,
        },
        include: {
          author: true,
        },
        orderBy: {
          publishedAt: "desc",
        },
        take,
        skip,
      });

      return createPaginatedResponse(blogs, totalCount, page, pageSize);
    } catch (error) {
      console.error("Error getting blogs by admin:", error);
      throw new ErrorService.InternalServerError("Error al obtener los blogs del administrador");
    }
  },

  likeBlog: async ({ id, sellerId }: { id: number; sellerId: string }) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }

      const checkExisting = await prisma.blogReaction.findFirst({
        where: {
          blogPostId: id,
          sellerId,
        },
      });

      if (checkExisting?.reaction === "LIKE") {
        await prisma.blogReaction.delete({
          where: {
            id: checkExisting.id,
          },
        });
      }

      if (checkExisting?.reaction === "DISLIKE") {
        await prisma.blogReaction.update({
          where: {
            id: checkExisting.id,
          },
          data: {
            reaction: "LIKE",
          },
        });
      }

      await prisma.blogReaction.create({
        data: {
          blogPostId: id,
          sellerId,
          reaction: "LIKE",
          updatedAt: new Date(),
        },
      });

      return true;
    } catch (error) {
      console.error("Error liking blog:", error);
      throw new ErrorService.InternalServerError("Error al dar me gusta al blog");
    }
  },

  dislikeBlog: async ({ id, sellerId }: { id: number; sellerId: string }) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }

      const checkExisting = await prisma.blogReaction.findFirst({
        where: {
          blogPostId: id,
          sellerId,
        },
      });

      if (checkExisting?.reaction === "DISLIKE") {
        await prisma.blogReaction.delete({
          where: {
            id: checkExisting.id,
          },
        });
      }

      if (checkExisting?.reaction === "LIKE") {
        await prisma.blogReaction.update({
          where: {
            id: checkExisting.id,
          },
          data: {
            reaction: "DISLIKE",
          },
        });
      }

      await prisma.blogReaction.create({
        data: {
          blogPostId: id,
          sellerId,
          reaction: "DISLIKE",
          updatedAt: new Date(),
        },
      });

      return true;
    } catch (error) {
      console.error("Error disliking blog:", error);
      throw new ErrorService.InternalServerError("Error al dar no me gusta al blog");
    }
  },
};
