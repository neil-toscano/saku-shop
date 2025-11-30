"use client";

import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import useStore from "@/store/useStore";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const router = useRouter();

  const address = useStore(useAddressStore, (state) => state.address);
  const cart = useCartStore((state) => state.cart);

  const summaryInformation = useStore(
    useCartStore,
    useShallow((state) => state.getSummaryInformation())
  );

  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (
      !isPlacingOrder &&
      summaryInformation &&
      summaryInformation.itemsInCart === 0
    ) {
      router.push("/empty");
    }
  }, [summaryInformation, router, isPlacingOrder]);

  if (!summaryInformation) return <h1>loading...</h1>;

  const { itemsInCart, subTotal, tax, total } = summaryInformation;

  const onPlaceOrder = async () => {
    setErrorMessage(undefined);
    setIsPlacingOrder(true);

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    if (!address) {
      setErrorMessage("No existe la dirección");
      setIsPlacingOrder(false);
      return;
    }

    const dbOrder = await placeOrder(productsToOrder, address);
    if (!dbOrder.ok) {
      setErrorMessage(dbOrder.message);
      setIsPlacingOrder(false);
      return;
    }

    //* todo salio bien
    clearCart();
    router.replace("/orders/" + dbOrder.order?.id);
  };

  return (
    <div className="bg-white">
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
      <p className="my-5">
        <span className="text-xs">
          Al hacer clic en {"cololar orden"}, aceptas nuestors{" "}
          <a href="#" className="underline">
            términos y condiciones
          </a>{" "}
          y
          <a href="#" className="underline">
            política de privacidad
          </a>
        </span>
      </p>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="mt-5 mb-2 w-full">
        <button
          disabled={isPlacingOrder}
          className={clsx(
            "justify-center w-full px-4 py-2 rounded transition-colors",
            {
              "btn-primary cursor-pointer": !isPlacingOrder,
              "bg-gray-400 text-white cursor-not-allowed": isPlacingOrder,
            }
          )}
          onClick={() => onPlaceOrder()}
        >
          {isPlacingOrder && (
            <svg
              aria-hidden="true"
              role="status"
              className="inline mr-3 w-4 h-4 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              ></path>
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              ></path>
            </svg>
          )}

          {isPlacingOrder ? "Procesando..." : "Confirmar pedido"}
        </button>
      </div>
    </div>
  );
};
