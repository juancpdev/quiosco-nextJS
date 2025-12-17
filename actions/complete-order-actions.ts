// actions/complete-order-action.ts
"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function completeOrder(orderId: number) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "completed", // ✅ Ahora es string
        orderReadyAt: new Date()
      }
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Error completing order:", error);
    return { success: false };
  }
}