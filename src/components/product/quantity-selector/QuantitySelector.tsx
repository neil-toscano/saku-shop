"use client";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
  quantity: number;
  setQuantity: (value: number) => void;
}

export const QuantitySelector = ({ quantity, setQuantity }: Props) => {
  const onValueChanged = (value: number) => {
    if (quantity + value < 1) return;
    setQuantity(quantity + value);
  };

  return (
    <div className="flex ">
      <button>
        <IoRemoveCircleOutline
          onClick={() => onValueChanged(-1)}
          className="hover:cursor-pointer"
          size={30}
        />
      </button>
      <span className="w-20 mx-3 px-5 bg-gray-100 flex items-center justify-center rounded">
        {quantity}
      </span>
      <button>
        <IoAddCircleOutline
          onClick={() => onValueChanged(1)}
          className="hover:cursor-pointer"
          size={30}
        />
      </button>
    </div>
  );
};
