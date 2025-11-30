"use server";

import prisma from "@/lib/prisma";

export const getCountries = async () => {
  try {
    const countries = await prisma.country.findMany({
      where: {
        isAvailable: true,
      },
    });
    return countries;
  } catch (error) {
    console.log(error);
    return [];
  }
};
