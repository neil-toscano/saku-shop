"use client";
import { DrawerDialogCart, QuantitySelector, SizeSelector } from "@/components";
import { Product, Size } from "@/interfaces";
import { useCartStore } from "@/store";
import { useState } from "react";

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const [openCartModal, setOpenCartModal] = useState(false);
  const [productCartDialog, setProductCartDialog] = useState({
    title: product.title,
    price: product.price,
    quantity: 1,
    image: product.images[0],
    size: "",
  });

  const addProduct = useCartStore((state) => state.addProductToCart);

  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [sendForm, setSendForm] = useState(false);

  const addTocart = () => {
    setSendForm(true);
    if (!size) {
      return;
    }
    addProduct({
      id: product.id,
      price: product.price,
      quantity: quantity,
      size: size,
      slug: product.slug,
      title: product.title,
      image: product.images[0],
    });

    setOpenCartModal(true);
    setProductCartDialog((value) => ({
      ...value,
      quantity: quantity,
      size: size,
    }));

    setSendForm(false);
    setQuantity(1);
    setSize(undefined);
  };
  return (
    <>
      {/* tallas */}
      <SizeSelector
        availableSizes={product.sizes}
        selectedSize={size}
        onSizeChanged={(size) => setSize(size)}
      />

      {/* cantidad */}
      <QuantitySelector
        quantity={quantity}
        setQuantity={(quantity) => setQuantity(quantity)}
      />

      {sendForm &&
        !size && ( // Muestra el div SI Y SOLO SI 'size' es falsy (no seleccionado)
          <div className="mt-4 mb-1">
            <span className="text-red-800 text-xs fade-in">
              Debe seleccionar una talla
            </span>
          </div>
        )}

      <DrawerDialogCart
        open={openCartModal}
        setOpen={setOpenCartModal}
        product={productCartDialog}
      />

      <button
        onClick={() => addTocart()}
        className="btn-primary my-5 cursor-pointer"
      >
        Agregar al carrito
      </button>
    </>
  );
};
