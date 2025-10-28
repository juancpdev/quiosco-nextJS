"use client";
import { useStore } from "@/src/store";
import ProductDetails from "./ProductDetails";
import { useMemo } from "react";
import { formatCurrency } from "@/src/utils";
import { AnimatePresence, motion } from "framer-motion";

export default function OrderSummary() {
  const order = useStore((state) => state.order);
  const total = useMemo(
    () => order.reduce((total, item) => total + item.quantity * item.price, 0),
    [order]
  );

  const isEmpty = order.length === 0;

  return (
    <aside
      className={`fixed top-0 left-0 z-100 w-full h-full bg-gray-100 xl:relative xl:h-screen xl:w-96 p-5 pb-0 
      ${!isEmpty ? "xl:overflow-y-scroll overflow-x-hidden" : ""}`}
    >
      <h1 className="text-3xl text-center font-black">Mi Pedido</h1>
        
      <div
        className={`mt-5 rounded-xl transition-all duration-300 ${
          isEmpty ? "flex flex-col items-center justify-center h-[70vh]" : ""
        }`}
      >
        <div className="mb-15 flex flex-col items-center w-full">
          <AnimatePresence mode="popLayout">
            {!isEmpty &&
              order.map((item) => <ProductDetails key={item.id} item={item} />)}
          </AnimatePresence>
        </div>
              
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center justify-center"
          >
            <img
              src="/carritovacio.png"
              alt="Carrito vacío"
              className="w-40 h-40 object-contain"
            />
            <p className="text-center font-medium mt-5 text-lg">
              El pedido está vacío
            </p>
          </motion.div>
        )}
      </div>

      {/* FOOTER FIJO */}
      {!isEmpty && (
        <div className="cursor-pointer fixed bottom-0 left-0 w-full xl:w-82 xl:left-auto bg-gradient-to-tr from-orange-200 to-orange-300  rounded-t-xl shadow-sm py-4 z-50 transition duration-400 hover:bg-gradient-to-tr hover:from-orange-500 hover:to-orange-200">
          <p className="text-center text-lg">
            Ir a pagar{" "}
            <span className="font-bold">{formatCurrency(total)}</span>
          </p>
        </div>
      )}
    </aside>
  );
}
