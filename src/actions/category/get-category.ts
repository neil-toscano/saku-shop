"use server";
import prisma from "@/lib/prisma";

export const getCategory = async () => {
  try {
    const categories = await prisma.category.findMany();

    return {
      ok: true,
      categories,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error al obtener category",
    };
  }
};
