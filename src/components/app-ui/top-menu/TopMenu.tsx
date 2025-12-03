"use client";

import { montserratAlternate } from "@/config/fonts";
import { useCartStore, useUIStore } from "@/store";
import useStore from "@/store/useStore";

import Link from "next/link";
import {
  IoCartOutline,
  IoPersonCircleOutline,
  IoSearchOutline,
} from "react-icons/io5";

export const TopMenu = () => {
  const openSidebar = useUIStore((state) => state.openSideMenu);
  // const totalItems = useCartStore((state) => state.getTotalItems());
  const totalItems = useStore(useCartStore, (state) => state.getTotalItems());

  return (
    <nav className="flex px-5 justify-between items-center w-full">
      {/* LOGO */}
      <div className={`${montserratAlternate.className}`}>
        <Link href={"/"}>
          <span className="antialiased font-bold">SAKU</span>
          <span> | Shop</span>
        </Link>
      </div>

      {/* CENTER MENU */}
      <div className="hidden sm:block">
        <Link
          className="m-2 p2 rounded-md transition-all hover:bg-gray-100"
          href={"/gender/men"}
        >
          Hombres
        </Link>
        <Link
          className="m-2 p2 rounded-md transition-all hover:bg-gray-100"
          href={"/gender/women"}
        >
          Mujeres
        </Link>
        <Link
          className="m-2 p2 rounded-md transition-all hover:bg-gray-100"
          href={"/gender/kid"}
        >
          Niños
        </Link>
      </div>
      {/* SEARCH CART, MENU */}
      <div className="flex items-center">
        <Link href="/search">
          <IoSearchOutline className="w-5 h-5" />
        </Link>
        <Link href={totalItems === 0 ? "/empty" : "/cart"} className="px-2">
          <div className="relative py-0.5">
            <div className="t-0 absolute left-3">
              <p className="flex h-1 w-1 items-center justify-center rounded-full bg-blue-500 p-2 text-xs text-white">
                {totalItems}
              </p>
            </div>
            <IoCartOutline className="w-5 h-10" />
          </div>
        </Link>

        <button
          onClick={openSidebar}
          className="m-2 rounded-md transition-all hover:bg-gray-100 cursor-pointer"
        >
          <IoPersonCircleOutline size={30} />
        </button>
      </div>
    </nav>
  );
};
