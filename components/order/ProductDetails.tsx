"use client"

import { useStore } from "@/src/store";
import { OrderItem } from "@/src/types";
import { formatCurrency } from "@/src/utils";
import { MinusIcon, PlusIcon, XMarkIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { useMemo } from "react";
import { motion } from "framer-motion"; // 👈 IMPORTANTE

type ProductDetailsProp = {
  item: OrderItem;
};

export default function ProductDetails({ item }: ProductDetailsProp) {
  const { increaseQuantity, decreaseQuantity, removeItem } = useStore();
  const MIN_ITEM = 1;
  const MAX_ITEM = 5;

  const disabledButtonDecrease = useMemo(() => item.quantity === MIN_ITEM, [item]);
  const disabledButtonIncrease = useMemo(() => item.quantity === MAX_ITEM, [item]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="last-of-type:mb-5 bg-white rounded-xl flex justify-between items-center py-4 border-b border-gray-200 gap-3 relative px-4"
    >
      <div className="absolute top-0 right-0 bg-red-500 h-8 w-8 rounded-bl-xl cursor-pointer rounded-tr-xl hover:bg-red-400 transition">
        <XMarkIcon
          className="text-white p-1.5"
          onClick={() => removeItem(item.id)}
        />
      </div>

      {/* Izquierda: imagen y nombre */}
      <div>
        <div className="flex items-center gap-3">
          <Image
            src={`/products/${item.image}.jpg`}
            alt={item.name}
            width={75}
            height={75}
            className="rounded-md object-cover object-center w-[75px] h-[75px]"
          />

          <div>
            <p className="font-medium text-gray-800 text-[15px] md:text-[16px]">
              {item.name}
            </p>

            {/* Cantidad */}
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-300 cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
                onClick={() => decreaseQuantity(item.id)}
                disabled={disabledButtonDecrease}
              >
                <MinusIcon className="h-4 w-4" />
              </button>

              <p className="font-semibold">{item.quantity}</p>

              <button
                type="button"
                className="bg-gray-200 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-300 cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
                onClick={() => increaseQuantity(item.id)}
                disabled={disabledButtonIncrease}
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <p className="font-bold text-[17px]">Subtotal:</p>
          <p>{formatCurrency(item.subtotal)}</p>
        </div>
      </div>

      {/* Derecha: precio y eliminar */}
      <div className="flex flex-col items-end gap-2">
        <div className="text-right leading-tight">
          <p className="text-[13px] text-gray-600">Unidad</p>
          <p className="font-bold text-[17px]">{formatCurrency(item.price)}</p>
        </div>
      </div>
    </motion.div>
  );
}
