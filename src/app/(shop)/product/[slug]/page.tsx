export const revalidate = 345673; //7dias

import { getProductBySlug } from "@/actions";
import {
  ProductMobileSlideshow,
  ProductSlideshow,
  StockLabel,
} from "@/components";
import { montserratAlternate } from "@/config/fonts";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "./ui/AddTocart";

interface Props {
  slug: string;
}

type PropsMetadata = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PropsMetadata): Promise<Metadata> {
  const slug = (await params).slug;

  const product = await getProductBySlug(slug);

  return {
    title: product?.title ?? "Producto no encontrado",
    description: product?.description,
    openGraph: {
      title: product?.title ?? "Producto no encontrado",
      description: product?.description,
      images: [`/products/${product?.images[1]}`],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Props>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* slideshow */}
      <div className="col-span-1 md:col-span-2">
        {/* MOBILE */}
        <ProductMobileSlideshow
          images={product.images}
          title={product.title}
          className="block md:hidden"
        />
        {/* DESKTOP */}
        <ProductSlideshow
          images={product.images}
          title={product.title}
          className="hidden md:block"
        />
      </div>
      {/* detalles */}
      <div className="col-span-1 px-5 ">
        <StockLabel slug={product.slug} />
        <h1
          className={`${montserratAlternate.className} antialiased font-bold text-xl`}
        >
          {product.title}
        </h1>
        <p className="text-lg mb-5">${product.price}</p>

        <AddToCart product={product} />
        {/* descripcion */}
        <h3 className="font-bold text-sm">Decripicción</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}
