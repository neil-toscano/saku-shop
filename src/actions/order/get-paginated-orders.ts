"use server";

import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import { ErrorCodes } from "@/constants";

export const getPaginatedOrders = async () => {
  const session = await auth();

  if (session?.user.role !== "admin") {
    return {
      ok: false,
      message: "No tienes permisos para realizar esta acción.",
      code: ErrorCodes.AUTH_FORBIDDEN,
    };
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orderAddresses: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return {
      ok: true,
      message: "Órdenes obtenido correctamente",
      orders,
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
