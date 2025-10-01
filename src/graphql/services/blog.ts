import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { type BlogCategory, BlogCategoryEnum } from "../../types/blog";

type OrderBy = { field: string; direction: "asc" | "desc" };
type Where = { [key: string]: string | number | boolean | null };

type PrismaBlogCategoryType =
  | "RECYCLING"
  | "POLLUTION"
  | "SUSTAINABILITY"
  | "CIRCULAR_ECONOMY"
  | "USED_PRODUCTS"
  | "REUSE"
  | "ENVIRONMENT"
  | "UPCYCLING"
  | "RESPONSIBLE_CONSUMPTION"
  | "ECO_TIPS"
  | "ENVIRONMENTAL_IMPACT"
  | "SUSTAINABLE_LIVING"
  | "OTHER";

// Map numeric enum to Prisma string enum
const mapCategoryToPrisma = (category: BlogCategoryEnum): PrismaBlogCategoryType => {
  const categoryMap: Record<BlogCategoryEnum, PrismaBlogCategoryType> = {
    [BlogCategoryEnum.RECYCLING]: "RECYCLING",
    [BlogCategoryEnum.POLLUTION]: "POLLUTION",
    [BlogCategoryEnum.SUSTAINABILITY]: "SUSTAINABILITY",
    [BlogCategoryEnum.CIRCULAR_ECONOMY]: "CIRCULAR_ECONOMY",
    [BlogCategoryEnum.USED_PRODUCTS]: "USED_PRODUCTS",
    [BlogCategoryEnum.REUSE]: "REUSE",
    [BlogCategoryEnum.ENVIRONMENT]: "ENVIRONMENT",
    [BlogCategoryEnum.UPCYCLING]: "UPCYCLING",
    [BlogCategoryEnum.RESPONSIBLE_CONSUMPTION]: "RESPONSIBLE_CONSUMPTION",
    [BlogCategoryEnum.ECO_TIPS]: "ECO_TIPS",
    [BlogCategoryEnum.ENVIRONMENTAL_IMPACT]: "ENVIRONMENTAL_IMPACT",
    [BlogCategoryEnum.SUSTAINABLE_LIVING]: "SUSTAINABLE_LIVING",
    [BlogCategoryEnum.OTHER]: "OTHER",
  };

  return categoryMap[category];
};

export const BlogService = {
  getBlogCategories: async () => {
    const categories: BlogCategory[] = await prisma.blogCategory.findMany({
      include: {
        BlogPost: { where: { isPublished: true } },
      },
    });
    if (!categories || categories.length === 0) {
      throw new ErrorService.NotFoundError("No se encontraron categorías de blogs");
    }

    return categories;
  },
  getBlogs: async ({ take = 20, skip = 0, orderBy }: { take?: number; skip?: number; orderBy?: OrderBy }) => {
    try {
      const { field = "createdAt", direction = "desc" } = orderBy || {};
      const orderByClause = { [field]: direction };

      const where: Where = { isPublished: true };

      const blogs = await prisma.blogPost.findMany({
        where,
        include: {
          Admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: orderByClause,
        take,
        skip,
      });

      if (!blogs || blogs.length === 0) {
        throw new ErrorService.NotFoundError("No se encontraron blogs");
      }

      return blogs;
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
          Admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
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
    category,
    take = 10,
    skip = 0,
  }: {
    category: BlogCategoryEnum;
    take?: number;
    skip?: number;
  }) => {
    try {
      const prismaCategory = mapCategoryToPrisma(category);

      const blogs = await prisma.blogPost.findMany({
        where: {
          isPublished: true,
          category: prismaCategory,
        },
        include: {
          Admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          publishedAt: "desc",
        },
        take,
        skip,
      });

      return blogs;
    } catch (error) {
      console.error("Error getting blogs by category:", error);
      throw new ErrorService.InternalServerError("Error al obtener los blogs por categoría");
    }
  },

  getBlogsByAuthor: async ({ authorId, take = 10, skip = 0 }: { authorId: string; take?: number; skip?: number }) => {
    try {
      const blogs = await prisma.blogPost.findMany({
        where: {
          authorId,
        },
        include: {
          Admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take,
        skip,
      });

      return blogs;
    } catch (error) {
      console.error("Error getting blogs by admin:", error);
      throw new ErrorService.InternalServerError("Error al obtener los blogs del administrador");
    }
  },

  createBlog: async (blogData: {
    title: string;
    content: string;
    authorId: string;
    tags?: string[];
    isPublished?: boolean;
  }) => {
    try {
      const blog = await prisma.blogPost.create({
        data: {
          title: blogData.title,
          content: blogData.content,
          authorId: blogData.authorId,
          tags: blogData.tags || [],
          isPublished: blogData.isPublished || false,
          publishedAt: blogData.isPublished ? new Date() : null,
          updatedAt: new Date(),
        },
        include: {
          Admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return blog;
    } catch (error) {
      console.error("Error creating blog:", error);
      throw new ErrorService.InternalServerError("Error al crear el blog");
    }
  },

  // updateBlog: async ({
  //   id,
  //   ...updateData
  // }: {
  //   id: string;
  //   title?: string;
  //   content?: string;
  //   tags?: string[];
  //   isPublished?: boolean;
  // }) => {
  //   try {
  //     const updatePayload: any = {
  //       ...updateData,
  //       updatedAt: new Date(),
  //     };

  //     // If publishing for the first time, set publishedAt
  //     if (updateData.isPublished && !updateData.isPublished) {
  //       updatePayload.publishedAt = new Date();
  //     }

  //     const blog = await prisma.blogPost.update({
  //       where: {
  //         id: parseInt(id),
  //       },
  //       data: updatePayload,
  //       include: {
  //         Admin: {
  //           select: {
  //             id: true,
  //             name: true,
  //             email: true,
  //           },
  //         },
  //       },
  //     });

  //     return blog;
  //   } catch (error) {
  //     console.error("Error updating blog:", error);
  //     throw new ErrorService.InternalServerError("Error al actualizar el blog");
  //   }
  // },

  // deleteBlog: async ({ id }: { id: string }) => {
  //   try {
  //     const blog = await prisma.blogPost.delete({
  //       where: {
  //         id: parseInt(id),
  //       },
  //       include: {
  //         Admin: {
  //           select: {
  //             id: true,
  //             name: true,
  //             email: true,
  //           },
  //         },
  //       },
  //     });

  //     return blog;
  //   } catch (error) {
  //     console.error("Error deleting blog:", error);
  //     throw new ErrorService.InternalServerError("Error al eliminar el blog");
  //   }
  // },

  // publishBlog: async ({ id }: { id: string }) => {
  //   try {
  //     const blog = await prisma.blogPost.update({
  //       where: {
  //         id: parseInt(id),
  //       },
  //       data: {
  //         isPublished: true,
  //         publishedAt: new Date(),
  //         updatedAt: new Date(),
  //       },
  //       include: {
  //         Admin: {
  //           select: {
  //             id: true,
  //             name: true,
  //             email: true,
  //           },
  //         },
  //       },
  //     });

  //     return blog;
  //   } catch (error) {
  //     console.error("Error publishing blog:", error);
  //     throw new ErrorService.InternalServerError("Error al publicar el blog");
  //   }
  // },

  // unpublishBlog: async ({ id }: { id: string }) => {
  //   try {
  //     const blog = await prisma.blogPost.update({
  //       where: {
  //         id: parseInt(id),
  //       },
  //       data: {
  //         isPublished: false,
  //         updatedAt: new Date(),
  //       },
  //       include: {
  //         Admin: {
  //           select: {
  //             id: true,
  //             name: true,
  //             email: true,
  //           },
  //         },
  //       },
  //     });

  //     return blog;
  //   } catch (error) {
  //     console.error("Error unpublishing blog:", error);
  //     throw new ErrorService.InternalServerError("Error al despublicar el blog");
  //   }
  // },

  // toggleLikeBlog: async ({ id, userId }: { id: string; userId: string }) => {
  //   try {
  //     // Note: Like functionality is not available in current BlogPost model
  //     // You would need to create a BlogLike model to implement this feature

  //     // For now, just return the blog without like functionality
  //     const blog = await prisma.blogPost.findUnique({
  //       where: { id: parseInt(id) },
  //       include: {
  //         Admin: {
  //           select: {
  //             id: true,
  //             name: true,
  //             email: true,
  //           },
  //         },
  //       },
  //     });

  //     if (!blog) {
  //       throw new ErrorService.NotFoundError("Blog no encontrado");
  //     }

  //     return blog;
  //   } catch (error) {
  //     console.error("Error toggling blog like:", error);
  //     throw new ErrorService.InternalServerError("Error al dar/quitar like al blog");
  //   }
  // },

  // addComment: async ({ blogId, userId, comment }: { blogId: string; userId: string; comment: string }) => {
  //   try {
  //     // Note: Comment functionality is not available in current BlogPost model
  //     // You would need to create a BlogComment model to implement this feature
  //     throw new ErrorService.BadRequestError("La funcionalidad de comentarios no está disponible actualmente");
  //   } catch (error) {
  //     console.error("Error adding comment:", error);
  //     throw error;
  //   }
  // },
};
