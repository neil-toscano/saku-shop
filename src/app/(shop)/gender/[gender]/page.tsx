export const revalidate = 60;

import { getPaginatedProductsWithImage } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@/generated/prisma/enums";
import { notFound, redirect } from "next/navigation";

interface SearchParams {
  page?: string;
}

interface ProductType {
  gender: Gender;
  title: string;
  subtitle: string;
}

const productTypes: ProductType[] = [
  {
    gender: "women",
    title: "Mujeres",
    subtitle: "Camisas",
  },
  {
    gender: "men",
    title: "Hombres",
    subtitle: "Camisas",
  },
  {
    gender: "kid",
    title: "Niños",
    subtitle: "Polos",
  },
];

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ gender: Gender }>;
  searchParams: Promise<SearchParams>;
}) {
  const { gender } = await params;
  const { page } = await searchParams;

  const pageNumber = Number(page ?? 1);

  if (isNaN(pageNumber)) {
    return <h1>Error...</h1>;
  }

  const category = productTypes.find((c) => c.gender === gender);

  if (!category) notFound();

  const {
    products: productByGender,
    totalPages,
    ok,
  } = await getPaginatedProductsWithImage({
    gender: gender,
    page: pageNumber,
  });

  if (!ok) return <h1>Error...</h1>;
  if (productByGender.length === 0) redirect("/");

  return (
    <>
      <Title
        title={category.title}
        subtitle={category?.subtitle}
        className="mb-2"
      />
      <ProductGrid products={productByGender} />
      <Pagination totalPages={totalPages!} />
    </>
  );
}
