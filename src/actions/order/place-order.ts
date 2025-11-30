"use server";

import type { Address, Size } from "@/interfaces";
import { auth } from "../../../auth";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productsInfo: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  if (!session?.user.id)
    return {
      ok: false,
      message: "No autenticado",
    };

  //obtener la info de productos

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productsInfo.map((p) => p.productId),
      },
    },
  });

  //calcular montos

  const itemsInOrder = productsInfo.reduce((count, p) => count + p.quantity, 0);

  // los , tax, subtotal, total
  const { subTotal, tax, total } = productsInfo.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((p) => p.id === item.productId);

      if (!product) throw new Error("item no existe");

      const subTotal = product.price * productQuantity;

      totals.subTotal = +subTotal + totals.subTotal;
      totals.tax = +subTotal * 0.15 + totals.tax;
      totals.total = subTotal * 1.15 + totals.total;

      return totals;
    },
    {
      subTotal: 0,
      tax: 0,
      total: 0,
    }
  );

  //transaccion

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      //1. actualizar stock de los productos
      const updatedProductsPromises = products.map((product) => {
        const productQuantity = productsInfo
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => acc + item.quantity, 0);

        if (productQuantity === 0)
          throw new Error("Ocurrió un error, actualizar stock");

        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);
      //verificar valores negativos inStock
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(
            `${product.title}, no tiene inventario suficiente, edita el carrito`
          );
        }
      });

      //2. crear la orden encabezado-detalle

      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,
        },
      });

      //crar items
      for (const cartItem of productsInfo) {
        const product = products.find((p) => p.id === cartItem.productId);
        if (!product) throw new Error("Producto no existe");

        await tx.orderItems.create({
          data: {
            price: product?.price,
            quantity: cartItem.quantity,
            size: cartItem.size,
            productId: cartItem.productId,
            orderId: order.id,
          },
        });
      }

      //3. crear la direccion de la orden

      const dbAddress = await tx.orderAddress.create({
        data: {
          address1: address.address1,
          address2: address.address2,
          firstName: address.firstName,
          lastName: address.lastName,
          city: address.city,
          phone: address.phone,
          postalCode: address.postalCode,
          countryId: address.country,
          orderId: order.id,
        },
      });
      return {
        order: order,
        orderAddress: dbAddress,
        updatedProducts: updatedProducts,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx: prismaTx,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";

    return {
      ok: false,
      message,
    };
  }
};
