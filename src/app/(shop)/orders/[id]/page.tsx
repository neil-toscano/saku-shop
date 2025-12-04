import { getOrderById } from "@/actions";
import {
  OrderStatus,
  PaypalButton,
  ProductImageCustom,
  StepProgress,
  Title,
} from "@/components";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import { IoCartOutline } from "react-icons/io5";

interface Props {
  id: string;
}

export default async function OrdersByIdPage({
  params,
}: {
  params: Promise<Props>;
}) {
  const { id } = await params;
  //TODO VERIFICAR
  //TODO REDIRECT

  const { ok, order, orderAddress, orderItems, message } = await getOrderById(
    id
  );
  if (!ok) return <h1> {message}</h1>;
  if (!order) return <h1>No existe orden</h1>;

  return (
    <div className="flex justify-center items-center mb-72 pr-2 pl-4 md:px-10">
      <div className="flex flex-col w-[1000px]">
        <StepProgress current={4} total={4} />
        <Title title={`Orden #${id.split("-").pop()}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-start">
          {/* Carrito */}

          <div className="flex flex-col mt-5">
            <div
              className={clsx(
                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                  "bg-red-500": !order.isPaid,
                  "bg-green-700": order.isPaid,
                }
              )}
            >
              <IoCartOutline size={30} />

              {order.isPaid ? (
                <span className="mx-2">Pagado</span>
              ) : (
                <span className="mx-2">Pendiente de pago</span>
              )}
            </div>

            {/* items */}

            {orderItems?.map((order) => (
              <div
                key={order.product.slug + "_" + order.size}
                className="flex mb-5"
              >
                <ProductImageCustom
                  src={order.product.productImages[0].url}
                  width={100}
                  height={100}
                  alt={order.product.title}
                  className="w-[100px] h-[100px] mr-5 rounded"
                />
                <div>
                  <p>
                    {order.product.title}, {order.size}
                  </p>
                  <p>
                    ${order.price} x {order.quantity}
                  </p>
                  <p className="font-bold">
                    Subtotal: ${order.price * order.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* checkout */}
          <div className="bg-white rounded-xl p-7 shadow-xl/30">
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-5 p-5 bg-white space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Dirección de envío
              </h3>

              <div className="space-y-1 text-gray-700">
                <p>
                  <span className="font-medium text-gray-500">Nombre:</span>{" "}
                  {orderAddress?.firstName} {orderAddress?.lastName}
                </p>

                <p>
                  <span className="font-medium text-gray-500">Dirección:</span>{" "}
                  {orderAddress?.address1}
                </p>

                <p>
                  <span className="font-medium text-gray-500">Ciudad:</span>{" "}
                  {orderAddress?.city}
                </p>

                <p>
                  <span className="font-medium text-gray-500">Teléfono:</span>{" "}
                  {orderAddress?.phone}
                </p>
              </div>
            </div>
            {/* divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>
            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span className="mt-1">No. Productos</span>
              <span className="mt-1 text-right">
                {order?.itemsInOrder} Artículos
              </span>

              <span className="mt-1">Subtotal</span>
              <span className="mt-1 text-right">
                {currencyFormat(order?.subTotal)}
              </span>

              <span className="mt-1">Impuestos</span>
              <span className="mt-1 text-right">
                {currencyFormat(order?.tax)}
              </span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">
                {currencyFormat(order?.total)}
              </span>
            </div>

            <div className="mt-5 mb-2 w-full">
              {order.isPaid ? (
                <OrderStatus isPaid={order.isPaid} />
              ) : (
                <PaypalButton orderId={order.id} amount={order.total} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
