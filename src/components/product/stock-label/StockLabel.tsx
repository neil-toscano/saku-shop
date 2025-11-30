"use client";
import { getStockBySlug } from "@/actions";
import { montserratAlternate } from "@/config/fonts";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      const inStock = await getStockBySlug(slug);
      setStock(inStock);
      setIsLoading(false);
    };

    fetchStock();
  }, [slug]);

  return (
    <div>
      {" "}
      {isLoading ? (
        <h1
          className={`${montserratAlternate.className} antialiased font-bold text-md bg-gray-200 animate-pulse`}
        >
          &nbsp;
        </h1>
      ) : (
        <h1
          className={`${montserratAlternate.className} antialiased font-bold text-md`}
        >
          Stock: {isLoading ? "Cargando..." : stock}
        </h1>
      )}
    </div>
  );
};
