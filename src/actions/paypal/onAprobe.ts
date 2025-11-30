"use server";

import { getAccessToken } from "./get-acces-token";

export const captureOrder = async (orderID: string) => {
  const PAYPAL_CHECKOUT_URL = process.env.PAYPAL_CHECKOUT_URL;
  try {
    const accessToken = await getAccessToken();

    const PAYPAL_CAPTURE_URL = `${PAYPAL_CHECKOUT_URL}/checkout/orders/${orderID}/capture`;

    const response = await fetch(PAYPAL_CAPTURE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({}),
    });

    const captureData = await response.json();

    // 4. Verificación (PayPal retorna 201 Created si es exitoso)
    if (response.status !== 201) {
      console.error("Error al capturar la orden:", captureData);
      throw new Error(
        `Fallo al capturar la orden: ${
          captureData.message || response.statusText
        }`
      );
    }

    return {
      status: captureData.status,
      transactionId: captureData.id,
    };
  } catch (error) {
    console.error("Error en captureOrder:", error);
    throw new Error("No se pudo completar la captura de PayPal.");
  }
};
