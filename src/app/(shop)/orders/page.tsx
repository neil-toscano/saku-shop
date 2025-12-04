// https://tailwindcomponents.com/component/hoverable-table
import { getOrdersByUser } from "@/actions";
import { Title } from "@/components";

import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCardOutline, IoEyeOutline } from "react-icons/io5";

export default async function OrdersPage() {
  const { ok, orders } = await getOrdersByUser();

  if (!ok) {
    redirect("/auth/login");
  }
  return (
    <>
      <Title title="Órdenes" />

      <div className="mb-10 w-full">
        <div
          className="
          relative 
          overflow-x-auto 
          overflow-y-auto 
          max-h-[70vh]
          rounded-lg 
          shadow-md 
          border border-gray-300
          bg-white
        "
        >
          <table className="min-w-[650px] w-full text-left">
            <thead className="bg-gray-200 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-gray-900">
                  #ID
                </th>
                <th className="px-4 py-3  text-xs sm:text-sm font-semibold text-gray-900">
                  Opciones
                </th>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-gray-900">
                  Estado
                </th>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-gray-900">
                  Nombre completo
                </th>
                <th className="px-4 py-3 text-xs sm:text-sm font-semibold text-gray-900">
                  Creado
                </th>
              </tr>
            </thead>

            <tbody>
              {orders?.map((order, index) => (
                <tr
                  key={order.id}
                  className="bg-white border-b border-gray-300 hover:bg-gray-100 transition"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                    {index}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-blue-600">
                    <Link
                      href={`/orders/${order.id}`}
                      className="underline flex items-center justify-start gap-1"
                    >
                      <IoEyeOutline /> Ver
                    </Link>
                  </td>

                  {/* ESTADO centrado correctamente */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-start gap-2 text-xs sm:text-sm text-gray-900">
                      {order.isPaid ? (
                        <>
                          <IoCardOutline className="text-green-800" />
                          <span className="text-green-800">Pagada</span>
                        </>
                      ) : (
                        <>
                          <IoCardOutline className="text-red-800" />
                          <span className="text-red-500">No pagada</span>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    {order.orderAddresses?.firstName}{" "}
                    {order.orderAddresses?.lastName}
                  </td>

                  {/* MANTENGO TU FECHA EXACTA */}
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleString("es-PE", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
