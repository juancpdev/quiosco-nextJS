"use client"

import { useStore } from "@/src/store"
import { Product } from "@prisma/client"

export type AddProductButtonProps = {
    product: Product
}

export default function AddProductButton({product} : AddProductButtonProps) {
    const addToOrder = useStore(state => state.addToOrder)
    return (
      <button 
          className="bg-indigo-500 p-3 text-white w-full font-bold mt-5 text-xl rounded cursor-pointer hover:bg-indigo-400 transition"
          onClick={() => addToOrder(product)}
      >
          Agregar
      </button>
    )
}
