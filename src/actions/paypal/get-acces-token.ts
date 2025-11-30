"use server";

export const getAccessToken = async () => {
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID_PAYPAL;
  const SECRET_KEY = process.env.SECRET_KEY_PAYPAL;
  const PAYPAL_OAUTH_URL = process.env.PAYPAL_OAUTH_URL;

  if (!CLIENT_ID || !SECRET_KEY || !PAYPAL_OAUTH_URL) {
    throw new Error("Faltan credenciales de PayPal.");
  }

  try {
    const auth = Buffer.from(`${CLIENT_ID}:${SECRET_KEY}`).toString("base64");

    const response = await fetch(PAYPAL_OAUTH_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    if (response.status !== 200) {
      console.error("Error de PayPal al obtener token:", data);
      throw new Error(data.error_description || "Error desconocido.");
    }

    return data.access_token as string;
  } catch (error) {
    console.error("Error de red o falló la autenticación:", error);
    throw new Error("No se pudo obtener el token de acceso de PayPal.");
  }
};
