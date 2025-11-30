"use server";

import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import { ErrorCodes } from "@/constants";
import { revalidatePath } from "next/cache";

export const changeUserRole = async (
  userId: string,
  role: "admin" | "user"
) => {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return {
      ok: false,
      message: "No tienes permisos para realizar esta acción.",
      code: ErrorCodes.AUTH_FORBIDDEN,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return {
        ok: false,
        message: "Usuario no encontrado.",
        code: ErrorCodes.USER_NOT_FOUND,
      };
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: role,
      },
    });

    revalidatePath("/admin/users");
    return {
      ok: true,
      message: "Rol cambiado correctamente",
      updatedUser,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Ocurrió un error",
      code: ErrorCodes.UNEXPECTED_ERROR,
    };
  }
};
