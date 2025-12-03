"use client";

import { useCartStore } from "@/store";
import useStore from "@/store/useStore";
import { currencyFormat } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export const OrderSummary = () => {
  /**
   * ============================================================================
   * SOLUCIÓN ALTERNATIVA: Hydration Pattern con Early Return
   * ============================================================================
   *
   * Esta es otra forma válida de manejar la hidratación con Zustand en Next.js.
   *
   * Ventajas:
   * - Código más simple y fácil de entender
   * - Previene errores de hidratación SSR/CSR mismatch
   * - Usa useShallow para optimizar re-renders
   *
   * Desventajas:
   * - Genera warning de "cascading renders" en Next.js 15+
   * - Muestra un loading completo en el primer render
   * - Puede causar flash de contenido
   *
   * Uso:
   * const [hydrated, setHydrated] = useState(false);
   *
   * const summaryInformation = useCartStore(
   *   useShallow((state) => state.getSummaryInformation())
   * );
   *
   * useEffect(() => {
   *   setHydrated(true);
   * }, []);
   *
   * if (!hydrated) return <h1>loading...</h1>;
   *
   * ============================================================================
   */
  const router = useRouter();

  const summaryInformation = useStore(
    useCartStore,
    useShallow((state) => state.getSummaryInformation())
  );

  useEffect(() => {
    if (summaryInformation && summaryInformation.itemsInCart === 0) {
      router.push("/empty");
    }
  }, [summaryInformation, router]);

  if (!summaryInformation) return <h1>loading...</h1>;

  const { itemsInCart, subTotal, tax, total } = summaryInformation;

  return (
    <div className="bg-white rounded-xl p-7 shadow-xl/30">
      <h2 className="text-2xl mb-2">Resumen de orden</h2>
      <div className="grid grid-cols-2">
        <span className="mt-1">No. Productos</span>
        <span className="mt-1 text-right">{itemsInCart} Artículos</span>

        <span className="mt-1">Subtotal</span>
        <span className="mt-1 text-right">{currencyFormat(subTotal)}</span>

        <span className="mt-1">Impuestos</span>
        <span className="mt-1 text-right">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">
          {currencyFormat(total)}
        </span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <Link
          className="flex btn-primary justify-center"
          href={"/checkout/address"}
        >
          Procesar compra
        </Link>
      </div>
    </div>
  );
};
