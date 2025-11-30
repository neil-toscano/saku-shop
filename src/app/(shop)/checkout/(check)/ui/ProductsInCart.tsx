"use client";

import { ProductImageCustom } from "@/components";
import { useCartStore } from "@/store";
import useStore from "@/store/useStore";
import { currencyFormat } from "@/utils";

export const ProductsInCart = () => {
  const productsItemsInCart =
    useStore(useCartStore, (state) => state.cart) ?? [];

  return (
    <div>
      {productsItemsInCart.map((product) => (
        <div key={`${product.slug}_${product.size}`} className="flex mb-5">
          <ProductImageCustom
            src={product.image}
            width={100}
            height={100}
            alt={product.title}
            className=" w-[100px] h-[100px] mr-5 rounded"
          />
          <div>
            <span>
              {product.title}, {product.size}
            </span>

            <p className="text-sm font-medium text-gray-600 mb-3">
              ${product.price} x {product.quantity}
            </p>

            <p className="font-bold">
              {currencyFormat(product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
