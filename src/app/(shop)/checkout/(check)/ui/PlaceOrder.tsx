"use client";

import { useAddressStore } from "@/store";
import useStore from "@/store/useStore";
import { OrderSummary } from "./OrderSummary";

export const PlaceOrder = () => {
  const address = useStore(useAddressStore, (state) => state.address);

  return (
    <div className="bg-white rounded-xl p-7 shadow-xl/30">
      <h2 className="text-2xl mb-2">Dirección de entrega</h2>
      <div className="mb-5 p-5 bg-white space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Dirección de envío
        </h3>

        <div className="space-y-1 text-gray-700">
          <p>
            <span className="font-medium text-gray-500">Nombre:</span>{" "}
            {address?.firstName} {address?.lastName}
          </p>

          <p>
            <span className="font-medium text-gray-500">Dirección:</span>{" "}
            {address?.address1}
          </p>

          <p>
            <span className="font-medium text-gray-500">Ciudad:</span>{" "}
            {address?.city}
          </p>

          <p>
            <span className="font-medium text-gray-500">Teléfono:</span>{" "}
            {address?.phone}
          </p>
        </div>
      </div>

      {/* divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-8"></div>
      <OrderSummary />
    </div>
  );
};
