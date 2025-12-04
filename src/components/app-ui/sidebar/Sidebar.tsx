"use client";
import { signOut } from "next-auth/react";
import { useUIStore } from "@/store";
import clsx from "clsx";
import Link from "next/link";
import {
  IoCartOutline,
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoLogoWhatsapp,
  IoSearchOutline,
} from "react-icons/io5";
import { UserRole } from "./role/UserRole";
import { AdminRole } from "./role/AdminRole";
import { Session } from "next-auth";

export const Sidebar = ({ session }: { session: Session | null }) => {
  const isAuthenticated = !!session?.user;

  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);

  const closeSidebar = useUIStore((state) => state.closeSideMenu);

  const logOutSession = async () => {
    closeSidebar();
    signOut({
      redirectTo: "/",
    });
  };

  return (
    <div>
      {/* background */}
      {isSideMenuOpen && (
        <div
          onClick={() => closeSidebar()}
          className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30 "
        ></div>
      )}

      {/* blur */}
      {isSideMenuOpen && (
        <div
          onClick={() => closeSidebar()}
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-blur-sm"
        ></div>
      )}

      {/* sidemenu */}
      <nav
        className={clsx(
          "fixed p-5 right-0 top-0 w-4/5 md:w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
          {
            "translate-x-full": !isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          size={30}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={closeSidebar}
        />
        <div className="relative mt-14">
          <IoSearchOutline size={20} className="absolute top-2 left-2" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>
        {/* menu */}

        {session?.user.role === "user" && (
          <UserRole closeSidebar={closeSidebar} />
        )}

        {session?.user.role === "admin" && (
          <AdminRole closeSidebar={closeSidebar} />
        )}

        <Link
          href={"/cart"}
          onClick={closeSidebar}
          className="flex items-center mt-2 p-2 hover:bg-gray-100 rounded transition-all"
        >
          <IoCartOutline size={30} />
          <span className="ml-3 text-xl">Carrito</span>
        </Link>
        <Link
          href="https://wa.me/51992837549?text=consulta"
          target="_blank"
          className="flex items-center mt-2 p-2 hover:bg-gray-100 rounded transition-all"
        >
          <IoLogoWhatsapp size={30} />
          <span className="ml-3 text-xl">Contáctanos</span>
        </Link>

        {/* line separator */}
        <div className="w-full h-px bg-gray-200 my-10"></div>

        {!isAuthenticated && (
          <Link
            href={"/auth/login"}
            onClick={closeSidebar}
            className="flex items-center mt-2 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoLogInOutline size={30} />
            <span className="ml-3 text-xl">Ingresar</span>
          </Link>
        )}

        {isAuthenticated && (
          <Link
            href={"/"}
            onClick={() => logOutSession()}
            className="flex items-center mt-2 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoLogOutOutline size={30} />
            <span className="ml-3 text-xl">Salir</span>
          </Link>
        )}
      </nav>
    </div>
  );
};
