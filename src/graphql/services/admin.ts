import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";

export const AdminService = {
  getAdmin: async ({ id }: { id: string | number }) => {
    try {
      const admin = await prisma.admin.findUnique({
        where: { id: id.toString() },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!admin) {
        throw new ErrorService.NotFoundError("Administrador no encontrado");
      }

      return admin;
    } catch (error) {
      console.error("Error getting admin:", error);
      throw error;
    }
  },

  getAdmins: async () => {
    try {
      const admins = await prisma.admin.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return admins;
    } catch (error) {
      console.error("Error getting admins:", error);
      throw new ErrorService.InternalServerError("Error al obtener los administradores");
    }
  },
};
