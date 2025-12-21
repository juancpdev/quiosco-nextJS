import OrdersGrid from "@/components/order/OrdersGrid";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";

async function getPendingOrders() {
  const orders = await prisma.order.findMany({
    where: {
      status: "pending"
    },
    include: {
      orderProducts: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      date: 'asc'
    }
  })
  return orders
}

export default async function OrdersPage() {
  const orders = await getPendingOrders()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Heading>Administrar Órdenes</Heading>
      <OrdersGrid orders={orders} />
    </div>
  )
}