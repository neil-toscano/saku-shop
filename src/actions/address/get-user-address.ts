"use server";
import prisma from "@/lib/prisma";

export const getUserAddress = async (userId: string) => {
  try {
    const address = prisma.userAddress.findFirst({
      where: {
        userId: userId,
      },
    });
    return address;
  } catch (error) {
    console.log(error);
    return null;
  }
};
