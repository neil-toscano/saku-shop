"use server";

import prisma from "@/lib/prisma";

export const deleteUserAddress = async (userId: string) => {
  try {
    const exists = await prisma.userAddress.findUnique({
      where: { userId },
    });

    if (!exists) {
      return {
        ok: true,
        message: "No había dirección para borrar",
      };
    }

    await prisma.userAddress.delete({
      where: { userId },
    });

    return {
      ok: true,
      message: "Borrado correctamente",
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error al borrar direccion",
    };
  }
};
