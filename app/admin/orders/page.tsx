'use client'
import useSWR from "swr"
import OrdersGrid from "@/components/order/OrdersGrid";
import Heading from "@/components/ui/Heading";
import { OrderWithProducts } from "@/src/types";

export default function OrdersPage() {
  const url = '/admin/orders/api'
  const fetcher = () => fetch(url).then(res => res.json()).then(data => data)
  const {data, error, isLoading} = useSWR<OrderWithProducts[]>(url, fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false
  })

  if(isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    )
  }

  if(data) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Heading>Administrar Órdenes</Heading>
      <OrdersGrid orders={data} />
    </div>
  )
}