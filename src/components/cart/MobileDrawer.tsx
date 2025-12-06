"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import Image from "next/image";
import { currencyFormat } from "@/utils";
import Link from "next/link";
import useWindowWidth from "@/hooks/useWindowWidth";
import { ProductImageCustom } from "../product/image/ProductImage";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  product: {
    title: string;
    price: number;
    quantity: number;
    image: string;
    size: string;
  };
}

export function DrawerDialogCart({ open, setOpen, product }: Props) {
  const width = useWindowWidth();

  const isDesktop = width > 768 ? true : false;
  console.log(width, "s");
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
            sm:max-w-[425px]
            fixed
            top-0
            right-0
            translate-x-0 translate-y-0
            left-auto
          "
        >
          <DialogHeader>
            <DialogTitle>Producto añadido</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-12 gap-2 text-gray-800 mt-5">
            <div className="col-span-4 flex items-center justify-center ">
              <ProductImageCustom
                alt={product.title}
                src={product.image}
                className="object-contain"
                width={80}
                height={80}
              />
            </div>
            <div className="col-span-5">
              <p className="text-xs font-semibold">
                {product.title}, {product.size}
              </p>
              <p className="text-sm font-light mt-2">
                Cantidad: {product.quantity}
              </p>
            </div>
            <div className="text-right col-span-3 text-sm">
              {currencyFormat(product.price)}
            </div>
          </div>

          <hr className="mt-10 mb-5" />

          <DialogFooter className="flex! flex-col! gap-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full border-2 cursor-pointer border-gray-800 hover:border-gray-600 hover:bg-gray-100 transition-colors rounded-md"
              >
                Seguir comprando
              </Button>
            </DialogClose>
            <Link
              href="/cart"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors rounded-md inline-block text-center py-2"
            >
              Ir al carrito
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="bg-stone-200 shadow-lg">
        <DrawerHeader className="text-left">
          <DrawerTitle>Producto añadido</DrawerTitle>
        </DrawerHeader>

        <div className="grid grid-cols-12 gap-2 text-gray-800 mt-5 px-2">
          <div className="col-span-4 flex items-center justify-center ">
            <ProductImageCustom
              alt={product.title}
              src={product.image}
              className="object-contain"
              width={80}
              height={80}
            />
          </div>
          <div className="col-span-5">
            <p className="text-xs font-semibold">
              {product.title}, {product.size}
            </p>
            <p className="text-sm font-light mt-2">
              Cantidad: {product.quantity}
            </p>
          </div>
          <div className="text-right col-span-3 text-sm">
            {currencyFormat(product.price)}
          </div>
        </div>

        <hr className="mt-10 mb-5" />

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button
              variant="outline"
              className="w-full border-2 cursor-pointer border-gray-800 hover:border-gray-600 hover:bg-gray-100 transition-colors rounded-md"
            >
              Seguir comprando
            </Button>
          </DrawerClose>

          <Link
            href="/cart"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors rounded-md inline-block text-center py-2"
          >
            Ir al carrito
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
