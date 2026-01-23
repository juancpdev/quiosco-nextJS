"use client";

import { useEffect, useState } from "react";
import { TableWithOrders } from "@/src/types";
import { formatCurrency, formatTime, getImagePath, minutesAgo, minutesBetween } from "@/src/utils";
import {
  X,
  Store,
  Phone,
  User,
  Clock,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { closeTable } from "@/actions/table/table-actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import PaymentForm from "./PaymentForm";

type TableSummaryModalProps = {
  table: TableWithOrders;
  onClose: () => void;
};

type PaymentMethod = "efectivo" | "tarjeta" | null;

export default function TableSummaryModal({
  table,
  onClose,
}: TableSummaryModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethod>(null);

  // fuerza re-render cada 30s para actualizar "hace X min"
  const [, force] = useState(0);
  useEffect(() => {
    const t = setInterval(() => force((x) => x + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const router = useRouter();

  const totalAmount = table.orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const firstOrder = table.orders[0];

  const handleCloseTableClick = () => setShowPaymentModal(true);

  const handleConfirmPayment = async (cashGiven?: number) => {
    if (!selectedPayment) return;

    if (
      selectedPayment === "efectivo" &&
      (cashGiven === undefined || cashGiven < totalAmount)
    ) {
      toast.error("El monto recibido es insuficiente");
      return;
    }

    setIsLoading(true);
    const result = await closeTable(table.id, selectedPayment);

    if (result.success) {
      toast.success(
        `Mesa ${table.number} cerrada - Pago: ${
          selectedPayment === "efectivo" ? "Efectivo" : "Tarjeta"
        }`
      );
      router.refresh();
      onClose();
    } else {
      toast.error("No se puede cerrar la mesa, hay órdenes pendientes");
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* Modal principal */}
      <div
        className="fixed inset-0 z-200 flex items-center justify-center bg-black/70"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl w-[95%] max-w-3xl shadow-2xl relative flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl shrink-0">
            <button
              onClick={onClose}
              className="absolute cursor-pointer top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 z-10"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3">
              <Store size={32} />
              <div>
                <h2 className="text-3xl font-bold">
                  Mesa {table.number}
                </h2>
                <p className="text-orange-100 text-sm">
                  {table.orders.length}{" "}
                  {table.orders.length === 1
                    ? "orden activa"
                    : "órdenes activas"}
                </p>
              </div>
            </div>
          </div>

          {/* Cliente */}
          {firstOrder && (
            <div className="p-6 border-b bg-gray-50 shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {firstOrder.name && (
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Cliente</p>
                      <p className="font-semibold">
                        {firstOrder.name}
                      </p>
                    </div>
                  </div>
                )}

                {firstOrder.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Teléfono</p>
                      <p className="font-semibold">
                        {firstOrder.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Órdenes */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {table.orders.map((order) => {
              const isCompleted = order.status === "completed";

              return (
                <div
                  key={order.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-4"
                >
                  {/* Header orden */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-100 text-orange-600 font-bold px-3 py-1 rounded-full text-sm">
                        Orden #{order.id}
                      </span>

                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${
                          isCompleted
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle size={16} />
                        ) : (
                          <Clock size={16} />
                        )}
                        {isCompleted ? "Entregada" : "Pendiente"}
                      </div>
                    </div>

                    <p className="font-bold text-lg">
                      {formatCurrency(order.total)}
                    </p>
                  </div>

                  {/* Tiempos */}
                  <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      Pedido {formatTime(order.date)} (
                      hace {minutesAgo(order.date)} min)
                    </span>

                    {isCompleted && order.orderReadyAt && (
                      <span className="flex items-center gap-1 text-green-700">
                        <CheckCircle size={14} />
                        Entregado {formatTime(order.orderReadyAt)} (Tardó {' '}
                        {minutesBetween(
                          order.date,
                          order.orderReadyAt
                        )}{" "}
                        min)
                      </span>
                    )}
                  </div>

                  {/* Productos */}
                  <div className="space-y-2">
                    {order.orderProducts.map((item) => {
                      const imagePath = getImagePath(item.productImage);

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                              <Image
                                src={imagePath}
                                alt={item.productName}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {item.productName}
                                {!item.product && (
                                  <span className="text-xs text-red-500 ml-1">(descontinuado)</span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatCurrency(item.productPrice)}{" "}
                                x {item.quantity}
                              </p>
                            </div>
                          </div>

                          <p className="font-semibold text-sm">
                            {formatCurrency(
                              item.productPrice *
                                item.quantity
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 rounded-b-2xl border-t-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign
                  size={24}
                  className="text-gray-600"
                />
                <span className="text-lg font-semibold text-gray-600">
                  Total General:
                </span>
              </div>
              <span className="text-3xl font-bold text-orange-600">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={handleCloseTableClick}
                className="flex-1 py-3 px-6 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle size={18} />
                <span>Cerrar Mesa</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de pago */}
      {showPaymentModal && (
        <PaymentForm
          totalAmount={totalAmount}
          selectedPayment={selectedPayment}
          setSelectedPayment={setSelectedPayment}
          onConfirm={handleConfirmPayment}
          isLoading={isLoading}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}
    </>
  );
}
