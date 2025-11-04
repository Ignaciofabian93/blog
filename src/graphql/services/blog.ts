import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { BlogType } from "../../types/blog";
import { BlogType as PrismaBlogType, type BlogCategory } from "@prisma/client";
import { calculatePrismaParams, createPaginatedResponse } from "../../utils/pagination";
import { PaginationInput } from "../resolvers/blogs";

export const BlogService = {
  getBlogCatalog: async () => {
    try {
      const categories: BlogCategory[] = await prisma.blogCategory.findMany();
      if (!categories || categories.length === 0) {
        throw new ErrorService.NotFoundError("No se encontraron categorías de blogs");
      }

      return categories;
    } catch (error) {
      console.error("Error al intentar obtener el catálogo de blogs:", error);
      throw new ErrorService.InternalServerError("Error al obtener el catálogo de blogs");
    }
  },
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

      // Convert custom BlogType to Prisma BlogType
      const prismaCategory = category as unknown as PrismaBlogType;

      const totalCount = await prisma.blogPost.count({
        where: {
          isPublished: true,
          type: prismaCategory,
        },
      });
      const blogs = await prisma.blogPost.findMany({
        where: {
          isPublished: true,
          type: prismaCategory,
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

  createBlogPost: async ({
    title,
    content,
    categoryId,
    type,
    authorId = "temp-admin-id", // This should come from authentication context
  }: {
    title: string;
    content: string;
    categoryId: number;
    type: BlogType;
    authorId?: string;
  }) => {
    try {
      const prismaType = type as unknown as PrismaBlogType;

      const blog = await prisma.blogPost.create({
        data: {
          title,
          content,
          blogCategoryId: categoryId,
          type: prismaType,
          authorId,
          updatedAt: new Date(),
        },
        include: {
          author: true,
          blogCategory: true,
        },
      });

      return blog;
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw new ErrorService.InternalServerError("Error al crear la publicación del blog");
    }
  },

  updateBlogPost: async ({
    id,
    title,
    content,
    categoryId,
    type,
  }: {
    id: number;
    title?: string;
    content?: string;
    categoryId?: number;
    type?: BlogType;
  }) => {
    try {
      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      };

      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (categoryId !== undefined) updateData.blogCategory = { connect: { id: categoryId } };
      if (type !== undefined) updateData.type = type as unknown as PrismaBlogType;

      const blog = await prisma.blogPost.update({
        where: { id },
        data: updateData,
        include: {
          author: true,
          blogCategory: true,
        },
      });

      return blog;
    } catch (error) {
      console.error("Error updating blog post:", error);
      throw new ErrorService.InternalServerError("Error al actualizar la publicación del blog");
    }
  },

  publishBlogPost: async ({ id }: { id: number }) => {
    try {
      const blog = await prisma.blogPost.update({
        where: { id },
        data: {
          isPublished: true,
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          author: true,
          blogCategory: true,
        },
      });

      return blog;
    } catch (error) {
      console.error("Error publishing blog post:", error);
      throw new ErrorService.InternalServerError("Error al publicar la publicación del blog");
    }
  },

  unpublishBlogPost: async ({ id }: { id: number }) => {
    try {
      const blog = await prisma.blogPost.update({
        where: { id },
        data: {
          isPublished: false,
          publishedAt: null,
          updatedAt: new Date(),
        },
        include: {
          author: true,
          blogCategory: true,
        },
      });

      return blog;
    } catch (error) {
      console.error("Error unpublishing blog post:", error);
      throw new ErrorService.InternalServerError("Error al despublicar la publicación del blog");
    }
  },

  deleteBlogPost: async ({ id }: { id: number }) => {
    try {
      await prisma.blogPost.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.error("Error deleting blog post:", error);
      throw new ErrorService.InternalServerError("Error al eliminar la publicación del blog");
    }
  },
};
