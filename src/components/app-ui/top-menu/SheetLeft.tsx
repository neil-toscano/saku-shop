"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { label: "Hombres", url: "/gender/men" },
  { label: "Mujeres", url: "/gender/women" },
  { label: "Niños", url: "/gender/kid" },
];

export function SheetDemo({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[260px] p-0 bg-white border-r shadow-xl"
      >
        <SheetHeader className="p-4">
          <SheetTitle>
            <Link href="/" className="flex items-center justify-center">
              <span className="antialiased font-bold tracking-wide">SAKU</span>
              <span className="opacity-70"> | Shop</span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="p-4 select-none">
          <p className="text-sm uppercase tracking-[0.15em] font-semibold text-neutral-500 mb-2">
            Categorías
          </p>

          <Separator className="mb-4" />

          <div className="flex flex-col gap-1">
            {categories.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
              >
                <SheetClose asChild>
                  <Link
                    href={item.url}
                    className="
                      flex items-center justify-between 
                      px-3 py-2.5 
                      rounded-lg 
                      text-[15px]
                      font-medium
                      tracking-wide
                      text-neutral-700
                      hover:text-neutral-900
                      hover:bg-neutral-100 
                      active:bg-neutral-200
                      transition-all
                      cursor-pointer
                    "
                  >
                    <span className="transition-all">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                </SheetClose>
              </motion.div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
