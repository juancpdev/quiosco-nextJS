"use client"

import { OrderWithProducts } from "@/src/types"
import { formatTime, getImagePath } from "@/src/utils"
import { Clock, UtensilsCrossed, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

type OrderCardProps = {
  order: OrderWithProducts
  isNew?: boolean
}

const MAX_VISIBLE_PRODUCTS = 3

export default function LatestOrderItem({ order, isNew = false }: OrderCardProps) {
  const [timeAgo, setTimeAgo] = useState("")

  // Productos visibles y restantes
  const visibleProducts = order.orderProducts.slice(0, MAX_VISIBLE_PRODUCTS)
  const remainingCount = order.orderProducts.length - MAX_VISIBLE_PRODUCTS
  const hasMoreProducts = remainingCount > 0

  // Calcular tiempo transcurrido desde que se completó
  useEffect(() => {
    const calculateTimeAgo = () => {
      if (!order.orderReadyAt) return "Ahora"
      
      const now = new Date()
      const orderDate = new Date(order.orderReadyAt)
      const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / 60000)
      
      if (diffInMinutes < 1) return "Ahora"
      if (diffInMinutes === 1) return "1 min"
      if (diffInMinutes < 60) return `${diffInMinutes} min`
      
      const hours = Math.floor(diffInMinutes / 60)
      if (hours === 1) return "1 hora"
      return `${hours} horas`
    }

    setTimeAgo(calculateTimeAgo())
    
    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo())
    }, 30000)

    return () => clearInterval(interval)
  }, [order.orderReadyAt])

  return (
    <>
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(249, 115, 22, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.5s ease-out;
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <div
        className={`
          bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300
          ${isNew 
            ? 'animate-slide-in ring-4 ring-orange-400 animate-pulse-ring' 
            : 'hover:shadow-xl'
          }
        `}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-orange-500 to-orange-400 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <p className="text-white font-bold text-lg">#{order.id}</p>
              </div>
              {isNew && (
                <span className="bg-white text-orange-600 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  NUEVA
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <Clock size={18} />
              <span className="font-semibold">{timeAgo}</span>
            </div>
          </div>

          {/* Mesa */}
          <div className="mt-3 flex items-center gap-2">
            <UtensilsCrossed size={20} className="text-white/90" />
            <p className="text-white font-bold text-xl">
              Mesa {order.table || 'N/A'}
            </p>
          </div>
        </div>

        {/* Productos */}
        <div className="p-6">
          <div className="space-y-3">
            {visibleProducts.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
              >
                {/* Imagen del producto */}
                <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={getImagePath(item.productImage)}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info del producto */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {item.productName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-bold">
                          {item.quantity}
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.quantity > 1 ? 'unidades' : 'unidad'}
                        </span>
                      </div>
                    </div>

                    {/* Precio */}
                    <div className="text-right ml-3">
                      <p className="text-sm font-bold text-amber-500">
                        ${item.productPrice}
                      </p>
                    </div>
                  </div>

                  {/* 🔥 Indicador si el producto fue eliminado */}
                  {!item.product && (
                    <span className="text-xs text-red-500 block mt-1">
                      (Producto descontinuado)
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Indicador de más productos */}
            {hasMoreProducts && (
              <div className="flex items-center justify-center gap-2 py-3 bg-orange-50 rounded-xl border border-orange-100">
                <MoreHorizontal size={20} className="text-orange-600" />
                <p className="text-sm font-semibold text-orange-700">
                  +{remainingCount} {remainingCount === 1 ? 'producto más' : 'productos más'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer con hora exacta */}
        {order.orderReadyAt && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Orden completada a las {formatTime(order.orderReadyAt)}
            </p>
          </div>
        )}
      </div>
    </>
  )
}