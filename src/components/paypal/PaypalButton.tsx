"use client";
import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  captureOrder,
  createOrder,
  paypalGetOrderDetails,
  updateOrderTransactionId,
} from "@/actions";

interface Props {
  orderId: string;
  amount: number;
}
export const PaypalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = Math.round(amount * 100) / 100;

  const onCreateOrder = async () => {
    const orderData = await createOrder(`${roundedAmount}`, orderId);

    const { ok } = await updateOrderTransactionId(orderId, orderData.id);

    if (!ok) throw new Error("ocurrio error");

    return orderData.id;
  };

  const onApprove: PayPalButtonsComponentProps["onApprove"] = async (data) => {
    const capture = await captureOrder(data.orderID);
    await paypalGetOrderDetails(data.orderID);
    // Show success message to buyer
  };

  if (isPending) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-300 mb-2"></div>
        <div className="h-10 bg-gray-300"></div>
      </div>
    );
  }
  return (
    <>
      <PayPalButtons
        createOrder={onCreateOrder}
        onApprove={onApprove}
        className="relative z-1"
      />
    </>
  );
};
