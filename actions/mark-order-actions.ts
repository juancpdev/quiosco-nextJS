// actions/mark-order-completed.ts
"use server"

import { prisma } from "@/src/lib/prisma"
import { revalidatePath } from "next/cache"

export async function markOrderCompleted(orderId: number) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "completed",
        orderReadyAt: new Date()
      }
    })

    revalidatePath("/admin/orders")
    revalidatePath("/admin/tables")

    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}
