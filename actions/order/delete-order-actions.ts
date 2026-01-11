"use server"

import { prisma } from "@/src/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteOrder(orderId: number) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        tableModel: {
          include: {
            orders: {
              where: {
                status: {
                  in: ["pending", "completed"]
                }
              }
            }
          }
        }
      }
    })

    if (!order) {
      return { success: false, error: "Orden no encontrada" }
    }

    // 1️⃣ borrar productos de la orden
    await prisma.orderProducts.deleteMany({
      where: { orderId }
    })

    // 2️⃣ borrar la orden
    await prisma.order.delete({
      where: { id: orderId }
    })

    // 3️⃣ lógica de mesa
    if (order.tableId && order.tableModel) {
      const remainingOrders = order.tableModel.orders.filter(
        o => o.id !== orderId
      )

      if (remainingOrders.length === 0) {
        await prisma.table.update({
          where: { id: order.tableId },
          data: {
            status: "available",
            sessionId: null
          }
        })
      }
    }

    revalidatePath("/admin/orders")
    revalidatePath("/admin/tables")

    return { success: true }
  } catch (error) {
    console.error("Error deleting order:", error)
    return { success: false, error: "Error al eliminar la orden" }
  }
}
