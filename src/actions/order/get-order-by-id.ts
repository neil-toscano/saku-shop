"use server";

import prisma from "@/lib/prisma";
import { auth } from "../../../auth";

export const getOrderById = async (id: string) => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: "Error, no está autenticado",
    };
  }

  try {
    //verificar que la orden le pertenezca

    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
    });

    if (!order) {
      return {
        ok: false,
        message: "no existe orden",
      };
    }

    if (order.userId !== session.user.id && session.user.role !== "admin") {
      return {
        ok: false,
        message: "No le pertenece la orden",
      };
    }

    const orderAddress = await prisma.orderAddress.findUnique({
      where: {
        orderId: order.id,
      },
    });

    const orderItems = await prisma.orderItems.findMany({
      where: {
        orderId: order.id,
      },
      select: {
        price: true,
        size: true,
        quantity: true,
        product: {
          select: {
            title: true,
            slug: true,
            productImages: {
              select: {
                url: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    return {
      ok: true,
      message: "obtenido correctamente",
      order,
      orderAddress,
      orderItems,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Ocurrió un error",
    };
  }
};
