"use server";

import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import { ErrorCodes } from "@/constants";

export const getUsers = async () => {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return {
      ok: false,
      message: "No tienes permisos para realizar esta acción.",
      code: ErrorCodes.AUTH_FORBIDDEN,
    };
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        email: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
      },
    });

    return {
      ok: true,
      message: "Usuarios obtenido correctamente",
      users,
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
