"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { CheckCircleIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import type { ProductVariant } from "@prisma/client";
import type { ProductWithVariants } from "@/src/types";
import { useStore } from "@/src/store";

export type AddProductButtonProps = {
  product: ProductWithVariants;
  isAvailable: boolean;
  selectedVariant?: ProductVariant | null;
};

export default function AddProductButton({
  product,
  isAvailable,
  selectedVariant = null,
}: AddProductButtonProps) {
  const addToOrder = useStore((s) => s.addToOrder);
  const order = useStore((s) => s.order);

  const [added, setAdded] = useState(false);

  const hasVariants = (product.variants?.length ?? 0) > 0;

  const itemKey = useMemo(
    () => `${product.id}:${selectedVariant?.id ?? "base"}`,
    [product.id, selectedVariant?.id]
  );

  const currentQuantity =
    order.find((item) => item.itemKey === itemKey)?.quantity ?? 0;

  const isMax = currentQuantity >= 5;

  const handleClick = () => {
    if (!isAvailable || isMax) return;

    if (hasVariants && !selectedVariant) {
      toast.error("Elegí un tamaño antes de agregar");
      return;
    }

    addToOrder(product, selectedVariant);

    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isAvailable || isMax}
      className={`relative m-3 font-bold transition w-8 h-8 flex items-center justify-center
        ${
          !isAvailable || isMax
            ? "text-gray-200 cursor-not-allowed"
            : "text-orange-400 hover:text-orange-300 cursor-pointer"
        }`}
      aria-label="Agregar"
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
            className="absolute inset-0 flex items-center justify-center text-green-500"
          >
            <CheckCircleIcon className="w-8 h-8" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
