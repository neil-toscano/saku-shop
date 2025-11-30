"use server";

import prisma from "@/lib/prisma";
import { auth } from "../../../auth";

export const updateOrderTransactionId = async (
  orderId: string,
  transactionId: string
) => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: "Debe estar autenticado",
    };
  }

  try {
    const existOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existOrder) {
      return {
        ok: false,
        message: "No existe orden",
      };
    }

    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        transactionId: transactionId,
      },
    });
    return {
      ok: true,
      order,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Ocurrio un error",
    };
  }
};
