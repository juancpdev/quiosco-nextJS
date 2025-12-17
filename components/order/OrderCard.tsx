'use client'

import { OrderWithProducts } from "@/src/types"
import { COLORS, formatCurrency } from "@/src/utils"
import { Bike, Store } from "lucide-react"
import Image from "next/image"
import { completeOrder } from "@/actions/complete-order-actions" // ✅ Importar action
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

type OrderCardProps = {
    order: OrderWithProducts
}

export default function OrderCard({ order } : OrderCardProps) {
    const router = useRouter()
    const isLocal = order.deliveryType === 'local'
    
    const bgColor = isLocal ? COLORS.primary[100] : COLORS.secondary[100]
    const borderColor = isLocal ? COLORS.primary[200] : COLORS.secondary[200]
    const buttonBg = isLocal ? COLORS.primary[500] : COLORS.secondary[400]
    const buttonHover = isLocal ? COLORS.primary[600] : COLORS.secondary[500]

    const handleComplete = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const result = await completeOrder(order.id)
        
        if (result.success) {
            toast.success("Orden completada")
            router.refresh()
        } else {
            toast.error("Error al completar la orden")
        }
    }

    return (
        <section
            aria-labelledby="summary-heading"
            className="shadow-lg rounded-2xl bg-white px-4 py-6 sm:p-6 lg:p-8 space-y-4 relative"
        >
            <div 
                className="absolute right-0 top-0 border shadow rounded-bl-lg rounded-tr-lg p-2"
                style={{
                    backgroundColor: bgColor,
                    borderColor: borderColor
                }}
            >
                {isLocal 
                ? <div className="flex gap-5 items-center">
                    <p className="text-black font-bold pl-3">Local</p>
                    <Store 
                        size={24} 
                        className="text-black" 
                        strokeWidth={2}
                    />
                </div>
                : <div className="flex gap-5 items-center">
                    <p className="text-black font-bold pl-3">Delivery</p>
                    <Bike 
                        size={24} 
                        className="text-black" 
                        strokeWidth={2}
                    />
                </div>}
            </div>

            <div 
                className="absolute left-0 top-0 shadow border text-black font-bold rounded-br-lg rounded-tl-lg p-2"
                style={{
                    backgroundColor: bgColor,
                    borderColor: borderColor
                }}
            >
                #{order.id}
            </div>

            <div className="space-y-2 mt-5">
                <p className='text-lg text-gray-900'>
                    <strong>Cliente:</strong> {order.name}
                </p>
                
                {order.phone && (
                    <p className='text-lg text-gray-900'>
                        <strong>Teléfono:</strong> {order.phone}
                    </p>
                )}
                
                {isLocal ? (
                    <p className='text-lg text-gray-900'>
                        <strong>Mesa:</strong> {order.table}
                    </p>
                ) : (
                    <p className='text-lg text-gray-900'>
                        <strong>Dirección:</strong> {order.address}
                    </p>
                )}
            </div>

            <dl className="mt-6 ">
                {order.orderProducts.map(product => (
                    <div
                        key={product.productId}
                        className="flex items-center justify-between gap-3 border-t border-gray-200 py-2"
                    >
                        <div className="flex gap-2 flex-1 ">
                            <dt className="flex items-center text-sm text-black">
                                <span className="font-bold">(x{product.quantity})</span>
                            </dt>
                            <dd className="text-gray-900">{product.product.name}</dd>
                        </div>
                        <Image
                            src={`/products/${product.product.image}.jpg`}
                            alt={product.product.name}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover object-center w-[60px] h-[60px]"
                        />
                    </div>
                ))}

                {order.note && (
                    <p className='text-md text-gray-900 border-t border-gray-200 py-3'>
                        <strong>Nota:</strong> {order.note}
                    </p>
                )}

                <div className="flex items-center justify-between border-t border-gray-200 py-2">
                    <dt className="text-base font-medium text-gray-900">
                        {order.paymentMethod === 'efectivo' ? 'Total a Pagar:' : 'Pagado:'}
                    </dt>
                    <dd className="text-xl font-bold text-gray-900">
                        {formatCurrency(order.total)}
                    </dd>
                </div>
            </dl>

            <form onSubmit={handleComplete}>
                <input
                    type="submit"
                    className="transition-colors text-white w-full mt-5 p-3 rounded-xl uppercase font-bold cursor-pointer"
                    style={{
                        backgroundColor: buttonBg
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonBg}
                    value='Completar'
                />
            </form>
        </section>
    )
}