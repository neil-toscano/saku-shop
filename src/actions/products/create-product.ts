"use server";

import { Product } from "@/generated/prisma/client";
import { Size } from "@/interfaces";
import prisma from "@/lib/prisma";
import { ProductFormSchema } from "@/lib/productSchema";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

export async function createProduct(formData: FormData) {
  const data = Object.fromEntries(formData);
  console.log(formData, "dato");
  const validatedFields = ProductFormSchema.safeParse({ ...data });

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      ok: false,
      message: "Campos invalidos",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data: product } = validatedFields;

  const { id, ...rest } = product;

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let product: Product;

      if (id) {
        product = await tx.product.update({
          where: {
            id: id,
          },
          data: {
            title: rest.title,
            slug: rest.slug,
            description: rest.description,
            price: rest.price,
            inStock: rest.inStock,
            sizes: rest.sizes as Size[],
            gender: rest.gender,
            categoryId: rest.categoryId,
            tags: rest.tags,
          },
        });

        if (formData.getAll("images")) {
          const imagesUrl = await uploadImages(
            formData.getAll("images") as File[]
          );
          if (!imagesUrl) {
            throw new Error("Error al cargar imagenes");
          }

          await tx.productImage.createMany({
            data: imagesUrl.map((imageurl) => ({
              url: imageurl,
              productId: product.id,
            })),
          });
        }

        return {
          product,
        };
      } else {
        product = await tx.product.create({
          data: {
            title: rest.title,
            slug: rest.slug,
            description: rest.description,
            price: rest.price,
            inStock: rest.inStock,
            sizes: rest.sizes as Size[],
            gender: rest.gender,
            categoryId: rest.categoryId,
            tags: rest.tags,
          },
        });

        //carga de imagenes
        if (formData.getAll("images")) {
          const imagesUrl = await uploadImages(
            formData.getAll("images") as File[]
          );
          if (!imagesUrl) {
            throw new Error("Error al cargar imagenes");
          }

          await tx.productImage.createMany({
            data: imagesUrl.map((imageurl) => ({
              url: imageurl,
              productId: product.id,
            })),
          });
        }

        return {
          product,
        };
      }
    });

    //revalidar varios paths
    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${rest.slug}`);
    revalidatePath(`/products/${rest.slug}`);
    return {
      ok: true,
      message: "campos ok",
      product: prismaTx.product,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error",
    };
  }
}

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (image) => {
      const buffer = await image.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString("base64");
      const fileUri = "data:" + image.type + ";" + "base64" + "," + base64Image;

      return cloudinary.uploader
        .upload(fileUri, {
          folder: "saku-shop",
        })
        .then((r) => r.secure_url);
    });

    const imagesUrl = await Promise.all(uploadPromises);
    return imagesUrl;
  } catch (error) {
    console.log(error);
    throw new Error("Error al subir imagen");
  }
};
