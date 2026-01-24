// actions/mark-order-completed.ts
"use server"

import { prisma } from "@/src/lib/prisma"
import { revalidatePath } from "next/cache"

export async function markOrderCompleted(orderId: number) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "completed",
        orderReadyAt: new Date()
      },
      include: {
        orderProducts: true
      }
    })

    console.log(`✅ Orden #${orderId} completada - Mesa: ${order.table}, DeliveryType: ${order.deliveryType}`);

    revalidatePath("/admin/orders")
    revalidatePath("/admin/tables")
    revalidatePath("/orders")

    return { success: true }
  } catch (error) {
    console.error(`❌ Error al completar orden ${orderId}:`, error)
    return { success: false }
  }
}
