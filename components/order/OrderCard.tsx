"use client";

import { useState } from "react";
import { OrderWithProducts } from "@/src/types";
import { COLORS, formatCurrency, getImagePath } from "@/src/utils";
import { Bike, Store, Trash2, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { markOrderCompleted } from "@/actions/order/mark-order-actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { deleteOrder } from "@/actions/order/delete-order-actions";
import OrderTimer from "./OrderTimer";

type OrderCardProps = {
  order: OrderWithProducts;
};

export default function OrderCard({ order }: OrderCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const isLocal = order.deliveryType === "local";
  const bgColor = isLocal ? COLORS.primary[100] : COLORS.secondary[100];
  const borderColor = isLocal ? COLORS.primary[200] : COLORS.secondary[200];
  const buttonBg = isLocal ? COLORS.primary[500] : COLORS.secondary[400];
  const buttonHover = isLocal ? COLORS.primary[600] : COLORS.secondary[500];

  const handleComplete = async () => {
    const result = await markOrderCompleted(order.id);
    if (result.success) {
      toast.success("Orden completada");
      router.refresh();
    } else {
      toast.error("Error al completar la orden");
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteOrder(order.id);

    if (result.success) {
      toast.success("Orden eliminada correctamente");
      router.refresh();
      setShowDeleteModal(false);
    } else {
      toast.error("Error al eliminar la orden");
    }
    setIsDeleting(false);
  };

  return (
    <>
      <section
        aria-labelledby="summary-heading"
        className="shadow-lg rounded-2xl bg-white px-4 py-6 sm:p-6 lg:p-8 space-y-4 relative"
      >
        {/* ✅ Número de orden (izquierda arriba) */}
        <div
          className="absolute left-0 top-0 shadow border text-black font-bold rounded-br-lg rounded-tl-lg px-3 py-1.5 text-sm"
          style={{ backgroundColor: bgColor, borderColor: borderColor }}
        >
          #{order.id}
        </div>

        {/* ✅ Timer (centro arriba) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0">
          <OrderTimer orderDate={order.date} />
        </div>

        {/* ✅ Tipo de pedido (derecha arriba) */}
        <div
          className="absolute right-0 top-0 border shadow rounded-bl-lg rounded-tr-lg px-3 py-1.5 flex items-center gap-2"
          style={{ backgroundColor: bgColor, borderColor: borderColor }}
        >
          {isLocal ? (
            <>
              <p className="text-black font-bold text-sm">Local</p>
              <Store size={18} className="text-black" strokeWidth={2} />
            </>
          ) : (
            <>
              <p className="text-black font-bold text-sm">Delivery</p>
              <Bike size={18} className="text-black" strokeWidth={2} />
            </>
          )}
        </div>

        {/* Info del cliente */}
        <div className="space-y-2 mt-5">
          <p className="text-lg text-gray-900">
            <strong>Cliente:</strong> {order.name}
          </p>
          {order.phone && (
            <p className="text-lg text-gray-900">
              <strong>Teléfono:</strong> {order.phone}
            </p>
          )}
          {isLocal ? (
            <p className="text-lg text-gray-900">
              <strong>Mesa:</strong> {order.table}
            </p>
          ) : (
            <p className="text-lg text-gray-900">
              <strong>Dirección:</strong> {order.address}
            </p>
          )}
        </div>

        {/* Productos */}
        <dl className="mt-6">
          {order.orderProducts.map((product) => {
            const imagePath = getImagePath(product.productImage);
            return (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 border-t border-gray-200 py-2"
              >
                <div className="flex gap-2 flex-1">
                  <dt className="flex items-center text-sm text-black">
                    <span className="font-bold">(x{product.quantity})</span>
                  </dt>
                  <dd className="text-gray-900">
                    {product.productName}
                    {!product.product && (
                      <span className="text-xs text-red-500 ml-2">(descontinuado)</span>
                    )}
                  </dd>
                </div>
                <Image
                  src={imagePath}
                  alt={product.productName}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover object-center w-[60px] h-[60px]"
                />
              </div>
            );
          })}

          {order.note && (
            <p className="text-md text-gray-900 border-t border-gray-200 py-3">
              <strong>Nota:</strong> {order.note}
            </p>
          )}

          {/* Total */}
          <div className="flex items-center justify-between border-t border-gray-200 py-2">
            <dt className="text-base font-medium text-gray-900">
              {order.paymentMethod === "efectivo"
                ? "Total a Pagar:"
                : "Pagado:"}
            </dt>
            <dd className="text-xl font-bold text-gray-900">
              {formatCurrency(order.total)}
            </dd>
          </div>
        </dl>

        <div className="flex items-center justify-center gap-3">
          {/* Botón completar */}
          <button
            onClick={handleComplete}
            className="transition-colors text-white w-full p-3 rounded-xl uppercase font-bold cursor-pointer"
            style={{ backgroundColor: buttonBg }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = buttonHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = buttonBg)
            }
          >
            Completar
          </button>
          {/* Botón eliminar */}
          <button
            onClick={handleDeleteClick}
            className="p-4 cursor-pointer h-full rounded-xl bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-colors z-10"
            title="Eliminar orden"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </section>

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-500 flex items-center justify-center bg-black/70"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-[90%] max-w-md shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icono de advertencia */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              ¿Eliminar orden?
            </h3>
            <p className="text-gray-600 mb-2 text-center">
              Orden #{order.id} - {order.name}
            </p>
            <p className="text-gray-500 mb-6 text-center text-sm">
              Esta acción no se puede deshacer
            </p>

            {/* Resumen de la orden */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-semibold">{order.name}</span>
                </div>
                {isLocal && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mesa:</span>
                    <span className="font-semibold">{order.table}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 py-3 px-6 bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 font-bold rounded-xl disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 px-6 cursor-pointer bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <div className="w-5 h-5  border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Trash2 size={18} />
                    <span>Eliminar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
