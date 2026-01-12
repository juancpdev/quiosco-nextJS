'use server'

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

// Eliminar una mesa
export async function deleteTable(tableNumber: number) {
  try {
    const table = await prisma.table.findUnique({
      where: { number: tableNumber },
      include: {
        orders: {
          where: {
            status: {
              in: ["pending", "completed"]
            }
          }
        }
      }
    });

    if (table && table.orders.length > 0) {
      return { 
        success: false, 
        error: "No se puede eliminar una mesa con órdenes activas" 
      };
    }

    await prisma.table.delete({
      where: { number: tableNumber }
    });

    revalidatePath("/admin/tables");
    return { success: true };
  } catch (error) {
    console.error("Error deleting table:", error);
    return { success: false, error: "Error al eliminar la mesa" };
  }
}