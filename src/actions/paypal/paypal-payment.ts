"use server";

import prisma from "@/lib/prisma";
import { getAccessToken } from "./get-acces-token";
import { revalidatePath } from "next/cache";

export const paypalGetOrderDetails = async (paypalOrderId: string) => {
  const PAYPAL_CHECKOUT_URL = process.env.PAYPAL_CHECKOUT_URL;

  try {
    const accessToken = await getAccessToken();

    const retrieveUrl = `${PAYPAL_CHECKOUT_URL}/checkout/orders/${paypalOrderId}`;

    const response = await fetch(retrieveUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error de PayPal al consultar la orden:", data);
      throw new Error(
        `Fallo de PayPal (${response.status}): ${
          data.name || "Error desconocido"
        }`
      );
    }

    if (data.status !== "COMPLETED") {
      return {
        ok: false,
        message: "Pago no completado",
      };
    }

    const referenceId = data.purchase_units[0].reference_id;
    if (!referenceId) {
      return {
        ok: false,
        message: "El reference id, no se encuentra",
      };
    }

    await prisma.order.update({
      where: {
        id: referenceId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    revalidatePath(`/orders/${referenceId}`);

    //todo: revalidar path
    return {
      ok: true,
      message: "Ha pagado correctamente",
    };
  } catch (error) {
    console.error("Error de red o falló la consulta de la orden:", error);
    return {
      ok: false,
      message: "500-El pago no se pudo realizar",
    };
  }
};
