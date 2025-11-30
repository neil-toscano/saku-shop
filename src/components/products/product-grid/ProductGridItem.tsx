"use client";

import { Product } from "@/interfaces";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Props {
  product: Product;
}

export const ProductGridItem = ({ product }: Props) => {
  const [displayImage, setDisplayImage] = useState(product.images[0]);

  const localSrc = displayImage
    ? displayImage.startsWith("http")
      ? displayImage
      : `/products/${displayImage}`
    : "/imgs/placeholder.jpg";

  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link href={`/product/${product.slug}`}>
        <div className="w-full  aspect-square ">
          <Image
            src={localSrc}
            className="object-contain w-full h-full rounded bg-white"
            alt={product.title}
            width={500}
            height={500}
            onMouseEnter={() => setDisplayImage(product.images[1])}
            onMouseLeave={() => setDisplayImage(product.images[0])}
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col">
        <Link className="hover:text-blue-500" href={`/product/${product.slug}`}>
          {product.title}
        </Link>
        <span className="font-bold">${product.price}</span>
      </div>
    </div>
  );
};
