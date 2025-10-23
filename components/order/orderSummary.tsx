"use client"
import { useStore } from "@/src/store"
import ProductDetails from "./ProductDetails"
import { useMemo } from "react"
import { formatCurrency } from "@/src/utils"

export default function OrderSummary() {
  const order = useStore(state => state.order)
  const total = useMemo(() => order.reduce((total, item) => total + (item.quantity * item.price), 0), [order])
  return (
    <aside className="lg:h-screen lg:overflow-y-scroll lg:w-96 p-5">
        <h1 className="text-3xl text-center font-black">Mi Pedido</h1>
        {order.length === 0 ? 
          <p className="text-center mt-5">El carrito esta vacio</p> : (
            <div className="mt-5 bg-white rounded-xl ">
              {order.map(item => (
                <ProductDetails 
                  key={item.id}
                  item={item}
                />
              ))}
              <p className="text-center text-xl py-5">Total a pagar: <span className="font-bold">{formatCurrency(total)}</span></p>
            </div>
          )
        }
    </aside>
  )
}
