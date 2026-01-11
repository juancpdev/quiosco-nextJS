"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/src/utils";
import { Banknote, CreditCard, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

type PaymentMethod = "efectivo" | "tarjeta" | null;

type PaymentFormProps = {
  totalAmount: number;
  selectedPayment: PaymentMethod;
  setSelectedPayment: (method: PaymentMethod) => void;
  onConfirm: (cashGiven?: number) => void;
  isLoading: boolean;
  onCancel: () => void;
};

export default function PaymentForm({
  totalAmount,
  selectedPayment,
  setSelectedPayment,
  onConfirm,
  isLoading,
  onCancel,
}: PaymentFormProps) {
  const [cashGiven, setCashGiven] = useState<number | "">("");
    const change = cashGiven === "" ? 0 : Math.max(cashGiven - totalAmount, 0);


  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl w-[90%] max-w-md shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Método de Pago</h3>
        <p className="text-gray-600 mb-6">¿Cómo pagó el cliente?</p>

        {/* Opciones de pago */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => setSelectedPayment("efectivo")}
            className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer ${
              selectedPayment === "efectivo"
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                selectedPayment === "efectivo" ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <Banknote
                size={24}
                className={selectedPayment === "efectivo" ? "text-white" : "text-gray-600"}
              />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-gray-800">Efectivo</p>
              <p className="text-sm text-gray-500">Pago en efectivo</p>
            </div>
            {selectedPayment === "efectivo" && <CheckCircle size={24} className="text-green-500" />}
          </button>

          <button
            onClick={() => setSelectedPayment("tarjeta")}
            className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer ${
              selectedPayment === "tarjeta"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                selectedPayment === "tarjeta" ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <CreditCard
                size={24}
                className={selectedPayment === "tarjeta" ? "text-white" : "text-gray-600"}
              />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-gray-800">Tarjeta</p>
              <p className="text-sm text-gray-500">Débito o crédito</p>
            </div>
            {selectedPayment === "tarjeta" && <CheckCircle size={24} className="text-blue-500" />}
          </button>
        </div>

        {/* Input efectivo */}
        {selectedPayment === "efectivo" && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Pago recibido</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={cashGiven}
              onChange={(e) => setCashGiven(Number(e.target.value))}
              className="w-full p-3 border rounded-xl text-lg"
              placeholder="0.00"
            />
            <p className="mt-2 text-sm text-gray-600">
              Vuelto: <span className="font-bold">{formatCurrency(change)}</span>
            </p>
          </div>
        )}

        {/* Total */}
        <div className="bg-gray-100 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-semibold">Total a cobrar:</span>
            <span className="text-2xl font-bold text-gray-800">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 cursor-pointer px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
                // Validación antes de llamar a onConfirm
                if (selectedPayment === "efectivo" && (cashGiven === "" || cashGiven < totalAmount)) {
                toast.error("El monto recibido es insuficiente");
                return;
                }

                // Convertimos a número solo si es efectivo
                onConfirm(selectedPayment === "efectivo" ? Number(cashGiven) : undefined);
            }}
            disabled={isLoading || !selectedPayment} // ahora solo deshabilitamos por loading o no pago
            className="flex-1 py-3 px-6 cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <>
                <CheckCircle size={18} />
                <span>Confirmar</span>
                </>
            )}
            </button>

        </div>
      </div>
    </div>
  );
}
