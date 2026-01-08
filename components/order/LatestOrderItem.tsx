"use client";

import { OrderWithProducts } from "@/src/types";
import { COLORS, formatCurrency, getImagePath } from "@/src/utils";
import { Bike, Store, Trash2, AlertTriangle } from "lucide-react";
import Image from "next/image";

type OrderCardProps = {
  order: OrderWithProducts;
};

export default function LatestOrderItem({ order }: OrderCardProps) {

  const isLocal = order.deliveryType === "local";
  const bgColor = isLocal ? COLORS.primary[100] : COLORS.secondary[100];
  const borderColor = isLocal ? COLORS.primary[200] : COLORS.secondary[200];


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
            const imagePath = getImagePath(product.product.image);
            return (
              <div
                key={product.productId}
                className="flex items-center justify-between gap-3 border-t border-gray-200 py-2"
              >
                <div className="flex gap-2 flex-1">
                  <dt className="flex items-center text-sm text-black">
                    <span className="font-bold">(x{product.quantity})</span>
                  </dt>
                  <dd className="text-gray-900">{product.product.name}</dd>
                </div>
                <Image
                  src={imagePath}
                  alt={product.product.name}
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

        </dl>

      </section>
    </>
  );
}
