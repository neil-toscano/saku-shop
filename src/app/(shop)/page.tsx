export const revalidate = 60;

import { getPaginatedProductsWithImage } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";

interface SearchParams {
  page?: string;
}

export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page } = await searchParams;

  //validar
  const pageNumber = Number(page ?? 1);

  if (isNaN(pageNumber)) {
    return <h1>Error...</h1>;
  }

  //products
  const { products, totalPages, ok } = await getPaginatedProductsWithImage({
    page: +pageNumber,
  });

  if (!ok) return <h1>Error...</h1>;

  if (products.length === 0) redirect("/");

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />
      <ProductGrid products={products} />

      <Pagination totalPages={totalPages!} />
    </>
  );
}
