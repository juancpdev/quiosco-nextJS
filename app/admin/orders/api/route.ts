import { prisma } from "@/src/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    where: {
      status: "pending",
    },
    include: {
      orderProducts: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  console.log(`📋 Órdenes pending encontradas: ${orders.length}`)
  orders.forEach(order => {
    console.log(`  - Orden #${order.id}: ${order.name}, ${order.deliveryType}, ${order.total}€, productos: ${order.orderProducts.length}`)
  })

  return Response.json(orders)
}