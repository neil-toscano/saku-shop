"use client";

import { ProductImageCustom, QuantitySelector } from "@/components";
import { CartProduct } from "@/interfaces";
import { useCartStore } from "@/store";
import useStore from "@/store/useStore";
import Link from "next/link";

export const ProductsInCart = () => {
  const productsItemsInCart =
    useStore(useCartStore, (state) => state.cart) ?? [];

  const removeProduct = useCartStore((state) => state.removeProduct);

  const updateQuantityProduct = useCartStore(
    (state) => state.updateProductQuantity
  );

  const onChangeQuantityProduct = (product: CartProduct, quantity: number) => {
    updateQuantityProduct(product, quantity);
  };

  return (
    <div>
      {productsItemsInCart.map((product) => (
        <div key={`${product.slug}_${product.size}`} className="flex mb-5">
          <ProductImageCustom
            src={product.image}
            width={100}
            height={100}
            alt={product.title}
            className="w-[100px] h-[100px] mr-5 rounded"
          />
          <div>
            <Link
              className="hover:underline cursor-pointer"
              href={`/product/${product.slug}`}
            >
              {product.title}, {product.size}
            </Link>

            <p>${product.price}</p>
            <QuantitySelector
              quantity={product.quantity}
              setQuantity={(value) => onChangeQuantityProduct(product, value)}
            />
            <button
              onClick={() => removeProduct(product)}
              className="cursor-pointer underline mt-3"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
