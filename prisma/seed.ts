import { initialData } from "@/seed/seed";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import "dotenv/config";
import { seedCountries } from "@/seed/seed-countries";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  await prisma.orderAddress.deleteMany();
  await prisma.orderItems.deleteMany();
  await prisma.order.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany({});
  await prisma.country.deleteMany();
  await prisma.userAddress.deleteMany();
  //   categorias
  const { categories, products, users } = initialData;

  const categoriesData = categories.map((category) => ({
    name: category,
  }));

  //   INSERTAR CATEGORIAS
  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDB = await prisma.category.findMany();

  const categoriesMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id;
    return map;
  }, {} as Record<string, string>); //<string=label,  string=categoryId>

  //INSERTAR PRODUCTOS
  products.forEach(async (product) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { images, type, ...rest } = product;
    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[product.type],
      },
    });
    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  });

  // crar usuarios
  users.forEach(async (user) => {
    const { password, ...rest } = user;

    const salt = bcrypt.genSaltSync(10);
    await prisma.user.create({
      data: {
        ...rest,
        password: bcrypt.hashSync(password, salt),
      },
    });
  });

  //seed countries
  seedCountries.forEach(async (country) => {
    await prisma.country.create({
      data: {
        code: country.id,
        name: country.name,
        isAvailable: country.isAvailable,
      },
    });
  });
}

main();
