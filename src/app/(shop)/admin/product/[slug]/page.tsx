import { getCategory, getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";

interface Props {
  slug: string;
}
export default async function ProductPage({
  params,
}: {
  params: Promise<Props>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  const { ok, categories = [], message } = await getCategory();

  if (!product && slug !== "new") {
    redirect("/admin/products");
  }

  const title = slug === "new" ? "Nuevo Producto" : "Editar Producto";
  if (!ok) <h1>{message}</h1>;
  return (
    <>
      <Title title={title} />
      <ProductForm product={product ?? {}} categories={categories} />
    </>
  );
}
