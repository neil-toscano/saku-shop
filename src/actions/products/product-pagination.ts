"use server";
import * as z from "zod";
import prisma from "@/lib/prisma";
import { Gender } from "@/generated/prisma/enums";

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
}

const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  take: z.number().min(1).max(100).default(12),
  gender: z.enum(Gender).optional(),
});

export const getPaginatedProductsWithImage = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions) => {
  try {
    //VALIDAR CON ZOD
    // 1. obtenr products
    const result = paginationSchema.safeParse({
      page: page,
      take: take,
      gender: gender,
    });

    if (!result.success) {
      console.log(result.error, "error");

      return {
        ok: false,
        message: "Opciones de paginación inválidas.",
        products: [],
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};

    if (result.data.gender) {
      whereClause.gender = result.data?.gender;
    }

    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        productImages: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        slug: "asc",
      },
      where: whereClause,
    });

    //paginacion
    const totalCounter = await prisma.product.count({ where: whereClause });

    const totalPages = Math.ceil(totalCounter / take);
    return {
      ok: true,
      currentPage: page,
      totalPages: totalPages,
      products: products.map((product) => ({
        ...product,
        images: product.productImages.map((image) => image.url),
      })),
    };
  } catch (error) {
    console.error("Error al obtener productos paginados:", error);

    return {
      ok: false,
      message: "Error de servidor al obtener productos. Inténtalo más tarde.",
      products: [],
    };
  }
};
