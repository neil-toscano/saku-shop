"use server";

import { getAccessToken } from "./get-acces-token";

export const createOrder = async (amount: string, reference_id: string) => {
  const PAYPAL_CHECKOUT_URL = process.env.PAYPAL_CHECKOUT_URL;
  try {
    const accessToken = await getAccessToken();

    return fetch(`${PAYPAL_CHECKOUT_URL}/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        purchase_units: [
          {
            reference_id: reference_id,
            amount: {
              currency_code: "USD",
              value: amount,
            },
          },
        ],
        intent: "CAPTURE",
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              payment_method_selected: "PAYPAL",
              brand_name: "SAKU SHOP INC",
              locale: "en-US",
              landing_page: "LOGIN",
              shipping_preference: "GET_FROM_FILE",
              user_action: "PAY_NOW",
              return_url: "https://example.com/returnUrl",
              cancel_url: "https://example.com/cancelUrl",
            },
          },
        },
      }),
    }).then((response) => response.json());
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener por slug el producto");
  }
};
