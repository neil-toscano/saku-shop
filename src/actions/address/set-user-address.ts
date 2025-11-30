"use server";

import { Address } from "@/interfaces";
import prisma from "@/lib/prisma";

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const newAddress = await createOrReplace(address, userId);

    return {
      ok: true,
      address: newAddress,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error al grabar direccion",
    };
  }
};

const createOrReplace = async (address: Address, userId: string) => {
  try {
    const storeAddress = await prisma.userAddress.findUnique({
      where: { userId },
    });

    const newAddressData = {
      userId: userId,
      address1: address.address1,
      address2: address.address2,
      city: address.city,
      countryId: address.country,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      postalCode: address.phone,
    };

    if (!storeAddress) {
      const newAddress = await prisma.userAddress.create({
        data: newAddressData,
      });
      return newAddress;
    }

    const updatedAddress = await prisma.userAddress.update({
      data: newAddressData,
      where: {
        id: storeAddress.id,
      },
    });

    return updatedAddress;
  } catch (error) {
    console.log(error);
    throw new Error("No se pudo grabar la direccion");
  }
};
