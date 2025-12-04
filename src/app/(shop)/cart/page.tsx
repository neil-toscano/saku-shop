import { StepProgress, Title } from "@/components";
import Link from "next/link";
import { ProductsInCart } from "./ui/ProductsInCart";
import { OrderSummary } from "./ui/OrderSummary";

export default function CartPage() {
  // todo logica
  // redirect("/empty");
  return (
    <div className="flex justify-center items-center mb-72 pr-2 pl-4 md:px-10">
      <div className="flex flex-col w-[1000px]">
        {/* BARRA DE PROGRESO  */}
        <StepProgress current={1} total={4} />

        <Title title="Carrito" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-start">
          {/* Carrito */}

          <div className="flex flex-col mt-5">
            <span className="text-xl">Agregar más items</span>
            <Link href={"/"} className="underline mb-5">
              Continua comprando
            </Link>

            {/* items */}

            <ProductsInCart />
          </div>
          {/* checkout */}
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
