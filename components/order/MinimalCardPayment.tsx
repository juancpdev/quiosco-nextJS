"use client";

import { CardPayment } from "@mercadopago/sdk-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { initializeMercadoPago } from "@/src/lib/mercadoPagoInit";
import { toast } from "react-toastify";
import { useStore } from "@/src/store";
import { motion, AnimatePresence } from "framer-motion";
import { OrderFormData, CardPaymentData } from "./OrderModal";

interface MinimalCardPaymentProps {
  formData: OrderFormData;
  onPaymentSuccess: (paymentData?: CardPaymentData) => void;
  onPaymentError?: (error?: unknown) => void;
  onClose: () => void;
}

export default function MinimalCardPayment({
  formData,
  onPaymentSuccess,
  onPaymentError,
  onClose,
}: MinimalCardPaymentProps) {
  const [ready, setReady] = useState(false);
  const { order } = useStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const total = useMemo(
    () => order.reduce((total, item) => total + item.quantity * item.price, 0),
    [order]
  );

  useEffect(() => {
    initializeMercadoPago();
    setReady(true);
  }, []);

  // Cleanup del timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (param: unknown) => {
    console.log("💳 Datos enviados a Mercado Pago:", param);
    console.log("📝 Formulario del pedido:", formData);

    // SOLUCIÓN: Cerrar este modal INMEDIATAMENTE
    onClose();

    // Luego procesar el pago
    timeoutRef.current = setTimeout(() => {
      const paymentParam = param as Record<string, unknown>;
      const paymentData: CardPaymentData = {
        paymentId: (paymentParam?.payment_id as string) || "simulated_payment_id",
        status: (paymentParam?.status as string) || "approved",
        ...paymentParam,
      };
      
      onPaymentSuccess(paymentData);
      timeoutRef.current = null;
    }, 300); // Reducido a 300ms para que sea más rápido
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-300 flex items-center justify-center bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-lg relative max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 cursor-pointer text-xl"
          >
            ✕
          </button>
          
          <h2 className="text-xl font-bold text-center mb-4">
            Completar pago con tarjeta
          </h2>

          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total a pagar:</p>
            <p className="text-2xl font-bold text-orange-500">
              ${total.toFixed(2)}
            </p>
            <p>5031 7557 3453 0604</p>
          </div>

          {ready ? (
            <CardPayment
              initialization={{
                amount: total,
                payer: { email: "test_user@test.com" },
              }}
              onSubmit={handleSubmit}
              onError={(error) => {
                console.error("Error en CardPayment:", error);
                toast.error("Error en el pago");
                onPaymentError?.(error);
              }}
            />
          ) : (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-200 border-t-orange-600"></div>
              <p className="ml-3 text-gray-500">Cargando método de pago...</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}