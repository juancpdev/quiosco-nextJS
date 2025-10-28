"use client";
import { useEffect, useState } from "react";
import OrderSummary from "./OrderSummary";
import OrderButton from "./OrderButton";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderWrapper() {
  const [orderActive, setOrderActive] = useState(false);

  useEffect(() => {
    document.body.style.overflow = orderActive ? "hidden" : "auto";
  }, [orderActive]);

  return (
    <>
      {/* Desktop: siempre visible */}
      <div className="hidden xl:block">
        <OrderSummary />
      </div>

      {/* Mobile: animación desde abajo */}
      <AnimatePresence>
        {orderActive && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-0 bg-white z-50 p-5 xl:hidden overflow-auto"
          >
            <OrderSummary />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón */}
      <div className="xl:hidden">
        <OrderButton
          orderActive={orderActive}
          setOrderActive={setOrderActive}
        />
      </div>
    </>
  );
}
