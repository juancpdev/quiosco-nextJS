'use client'

import Masonry from 'react-masonry-css'
import OrderCard from './OrderCard'
import { OrderWithProducts } from '@/src/types'

const breakpointColumns = {
  default: 3,
  1280: 3,
  1024: 2,
  640: 1
}

type OrdersGridProps = {
  orders: OrderWithProducts[]
}

export default function OrdersGrid({ orders }: OrdersGridProps) {
  if (orders.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-10">No hay órdenes pendientes</p>
    )
  }

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-6 w-auto"
      columnClassName="pl-6 bg-clip-padding"
    >
      {orders.map(order => (
        <div key={order.id} className="mb-6">
          <OrderCard order={order} />
        </div>
      ))}
    </Masonry>
  )
}