import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type CommunityPost, type CommunityComment } from "../../types/community";
import { calculatePrismaParams, createPaginatedResponse } from "../../utils/pagination";

export type PaginationInput = {
  page?: number;
  pageSize?: number;
};

export type CreateCommunityPostInput = {
  title: string;
  content: string;
  images?: string[];
  authorId?: string; // Will be extracted from context in real implementation
};

export type UpdateCommunityPostInput = {
  id: number;
  title?: string;
  content?: string;
  images?: string[];
};

export type CreateCommunityCommentInput = {
  postId: number;
  content: string;
  sellerId?: string; // Will be extracted from context in real implementation
};

export type UpdateCommunityCommentInput = {
  id: number;
  content: string;
};

export const CommunityService = {
  getCommunityCatalog: async () => {
    try {
      const categories = await prisma.communityCategory.findMany({
        include: {
          subcategories: true,
        },
      });

      if (!categories || categories.length === 0) {
        throw new ErrorService.NotFoundError("No se encontró el catálogo de comunidad");
      }

      return categories;
    } catch (error) {
      console.error("Error al intentar obtener el catálogo de comunidad:", error);
      throw new ErrorService.InternalServerError("Error al obtener el catálogo de comunidad");
    }
  },
  getCommunityCategories: async () => {
    try {
      const categories = await prisma.communityCategory.findMany({
        include: {
          subcategories: true,
        },
      });

      if (!categories || categories.length === 0) {
        throw new ErrorService.NotFoundError("No se encontraron categorías de comunidad");
      }

      return categories;
    } catch (error) {
      console.error("Error getting community categories:", error);
      throw new ErrorService.InternalServerError("Error al obtener las categorías de comunidad");
    }
  },

  getCommunityPosts: async ({ page = 1, pageSize = 10 }: PaginationInput) => {
    try {
      const { take, skip } = calculatePrismaParams(page, pageSize);
      const totalCount = await prisma.communityPost.count();

      const posts = await prisma.communityPost.findMany({
        include: {
          author: true,
          communityComment: {
            include: {
              seller: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take,
        skip,
      });

      if (!posts || posts.length === 0) {
        throw new ErrorService.NotFoundError("No se encontraron publicaciones de comunidad");
      }

      return createPaginatedResponse(posts, totalCount, page, pageSize);
    } catch (error) {
      console.error("Error getting community posts:", error);
      throw new ErrorService.InternalServerError("Error al obtener las publicaciones de comunidad");
    }
  },

  getCommunityPost: async ({ id }: { id: number }): Promise<CommunityPost> => {
    try {
      if (!id) {
        throw new ErrorService.BadRequestError("Se requiere un ID de publicación válido");
      }

      const post = await prisma.communityPost.findFirst({
        where: { id },
        include: {
          author: true,
          communityComment: {
            include: {
              seller: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!post) {
        throw new ErrorService.NotFoundError("Publicación de comunidad no encontrada");
      }

      return post as CommunityPost;
    } catch (error) {
      console.error("Error getting community post:", error);
      throw error instanceof ErrorService.NotFoundError || error instanceof ErrorService.BadRequestError
        ? error
        : new ErrorService.InternalServerError("Error al obtener la publicación de comunidad");
    }
  },

  getCommunityPostsByAuthor: async ({ authorId, page = 1, pageSize = 10 }: { authorId: string } & PaginationInput) => {
    try {
      const { take, skip } = calculatePrismaParams(page, pageSize);
      const totalCount = await prisma.communityPost.count({
        where: {
          authorId,
        },
      });

      const posts = await prisma.communityPost.findMany({
        where: {
          authorId,
        },
        include: {
          author: true,
          communityComment: {
            include: {
              seller: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take,
        skip,
      });

      return createPaginatedResponse(posts, totalCount, page, pageSize);
    } catch (error) {
      console.error("Error getting community posts by author:", error);
      throw new ErrorService.InternalServerError("Error al obtener las publicaciones de comunidad del autor");
    }
  },

  getCommunityComments: async ({ postId, page = 1, pageSize = 10 }: { postId: number } & PaginationInput) => {
    try {
      const { take, skip } = calculatePrismaParams(page, pageSize);
      const totalCount = await prisma.communityComment.count({
        where: {
          communityPostId: postId,
        },
      });

      const comments = await prisma.communityComment.findMany({
        where: {
          communityPostId: postId,
        },
        include: {
          seller: true,
          communityPost: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take,
        skip,
      });

      return createPaginatedResponse(comments, totalCount, page, pageSize);
    } catch (error) {
      console.error("Error getting community comments:", error);
      throw new ErrorService.InternalServerError("Error al obtener los comentarios de la comunidad");
    }
  },

  createCommunityPost: async ({
    title,
    content,
    images = [],
    authorId = "temp-admin-id", // This should come from authentication context
  }: CreateCommunityPostInput): Promise<CommunityPost> => {
    try {
      const post = await prisma.communityPost.create({
        data: {
          title,
          content,
          images,
          authorId,
          updatedAt: new Date(),
        },
        include: {
          author: true,
          communityComment: {
            include: {
              seller: true,
            },
          },
        },
      });

      return post as CommunityPost;
    } catch (error) {
      console.error("Error creating community post:", error);
      throw new ErrorService.InternalServerError("Error al crear la publicación de comunidad");
    }
  },

  updateCommunityPost: async ({ id, title, content, images }: UpdateCommunityPostInput): Promise<CommunityPost> => {
    try {
      const updateData: {
        updatedAt: Date;
        title?: string;
        content?: string;
        images?: string[];
      } = {
        updatedAt: new Date(),
      };

      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (images !== undefined) updateData.images = images;

      const post = await prisma.communityPost.update({
        where: { id },
        data: updateData,
        include: {
          author: true,
          communityComment: {
            include: {
              seller: true,
            },
          },
        },
      });

      return post as CommunityPost;
    } catch (error) {
      console.error("Error updating community post:", error);
      throw new ErrorService.InternalServerError("Error al actualizar la publicación de comunidad");
    }
  },

  deleteCommunityPost: async ({ id }: { id: number }): Promise<boolean> => {
    try {
      await prisma.communityPost.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.error("Error deleting community post:", error);
      throw new ErrorService.InternalServerError("Error al eliminar la publicación de comunidad");
    }
  },

  likeCommunityPost: async ({ id }: { id: number }): Promise<CommunityPost> => {
    try {
      const post = await prisma.communityPost.update({
        where: { id },
        data: {
          likes: {
            increment: 1,
          },
          updatedAt: new Date(),
        },
        include: {
          author: true,
          communityComment: {
            include: {
              seller: true,
            },
          },
        },
      });

      return post as CommunityPost;
    } catch (error) {
      console.error("Error liking community post:", error);
      throw new ErrorService.InternalServerError("Error al dar me gusta a la publicación de comunidad");
    }
  },

  createCommunityComment: async ({
    postId,
    content,
    sellerId = "temp-seller-id", // This should come from authentication context
  }: CreateCommunityCommentInput): Promise<CommunityComment> => {
    try {
      // First increment the comment count on the post
      await prisma.communityPost.update({
        where: { id: postId },
        data: {
          comments: {
            increment: 1,
          },
          updatedAt: new Date(),
        },
      });

      const comment = await prisma.communityComment.create({
        data: {
          communityPostId: postId,
          sellerId,
          content,
          updatedAt: new Date(),
        },
        include: {
          seller: true,
          communityPost: {
            include: {
              author: true,
            },
          },
        },
      });

      return comment as CommunityComment;
    } catch (error) {
      console.error("Error creating community comment:", error);
      throw new ErrorService.InternalServerError("Error al crear el comentario de comunidad");
    }
  },

  updateCommunityComment: async ({ id, content }: UpdateCommunityCommentInput): Promise<CommunityComment> => {
    try {
      const comment = await prisma.communityComment.update({
        where: { id },
        data: {
          content,
          updatedAt: new Date(),
        },
        include: {
          seller: true,
          communityPost: {
            include: {
              author: true,
            },
          },
        },
      });

      return comment as CommunityComment;
    } catch (error) {
      console.error("Error updating community comment:", error);
      throw new ErrorService.InternalServerError("Error al actualizar el comentario de comunidad");
    }
  },

  deleteCommunityComment: async ({ id }: { id: number }): Promise<boolean> => {
    try {
      // Get the comment to find the post ID for decrementing count
      const comment = await prisma.communityComment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new ErrorService.NotFoundError("Comentario no encontrado");
      }

      // Delete the comment and decrement the count on the post
      await prisma.$transaction([
        prisma.communityComment.delete({
          where: { id },
        }),
        prisma.communityPost.update({
          where: { id: comment.communityPostId },
          data: {
            comments: {
              decrement: 1,
            },
            updatedAt: new Date(),
          },
        }),
      ]);

      return true;
    } catch (error) {
      console.error("Error deleting community comment:", error);
      throw error instanceof ErrorService.NotFoundError
        ? error
        : new ErrorService.InternalServerError("Error al eliminar el comentario de comunidad");
    }
  },
};
