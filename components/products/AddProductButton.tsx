"use client";

import { useStore } from "@/src/store";
import { CheckCircleIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import { Product } from "@prisma/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type AddProductButtonProps = {
  product: Product,
  isAvailable: boolean
};

export default function AddProductButton({ product, isAvailable }: AddProductButtonProps) {
  const addToOrder = useStore((state) => state.addToOrder);
  const { order } = useStore();
  const [added, setAdded] = useState(false);

  // Busca si el producto ya está en el order y obtiene su quantity
  const currentQuantity =
    order.find((item) => item.id === product.id)?.quantity || 0;
  const isMax = currentQuantity >= 5; // condición para bloquear

  const handleClick = () => {
    if (isMax || !isAvailable) return;
    addToOrder(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <button
      className={`relative m-3 font-bold transition w-8 h-8 flex items-center justify-center
                ${
                  isMax || !isAvailable
                    ? "text-gray-200 cursor-not-allowed"
                    : "text-orange-400 hover:text-orange-300 cursor-pointer "
                }`}
      onClick={handleClick}
      disabled={isMax}
    >
      <AnimatePresence>
        {!added && (
          <motion.div
            key="plus"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <PlusCircleIcon className="w-8 h-8" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {added && (
          <motion.span
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center text-green-500 font-bold text-xl"
          >
            <CheckCircleIcon />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
