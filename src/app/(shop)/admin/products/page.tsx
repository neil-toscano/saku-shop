import { getPaginatedProductsWithImage } from "@/actions";
import { Pagination, ProductImageCustom, Title } from "@/components";
import { currencyFormat } from "@/utils";

import Link from "next/link";

interface SearchParams {
  page?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page } = await searchParams;

  const pageNumber = Number(page ?? 1);

  if (isNaN(pageNumber)) {
    return <h1>Error...</h1>;
  }

  const { products, totalPages, ok } = await getPaginatedProductsWithImage({
    page: +pageNumber,
  });

  if (!ok) return <h1>Error...</h1>;

  return (
    <>
      <Title title="Mantenimiento Productos" />
      <div className="flex justify-end mb-5">
        <Link href={"/admin/product/new"} className="flex btn-primary">
          Nuevo producto
        </Link>
      </div>
      <div className="mb-10 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b border-gray-300">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                #ID
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Imagen
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Título
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Precio
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Género
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Inventario
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Tallas
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, index) => (
              <tr
                key={product.id}
                className="bg-white border-b border-gray-300 transition duration-300 ease-in-out hover:bg-gray-100"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/product/${product.slug}`}
                    className="hover:underline"
                  >
                    <ProductImageCustom
                      alt={product.title}
                      height={80}
                      width={80}
                      className="w-20 h-20 object-cover rounded"
                      src={product.productImages[0]?.url}
                    />
                  </Link>
                </td>
                <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <Link href={`/admin/product/${product.slug}`}>
                    {product.title}
                  </Link>
                </td>
                <td className="text-sm text-gray-900 font-bold px-6">
                  {currencyFormat(product.price)}
                </td>

                <td className="text-sm text-gray-900 font-light px-6">
                  {product.gender}
                </td>

                <td className="text-sm text-gray-900 font-bold px-6 ">
                  {product.inStock}
                </td>

                <td className="text-sm text-gray-900 font-bold px-6 ">
                  {product.sizes.join(",")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination totalPages={totalPages!} />
      </div>
    </>
  );
}
