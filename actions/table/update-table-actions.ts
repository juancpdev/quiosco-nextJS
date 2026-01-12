'use server'

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateTableNumber(tableId: number, newNumber: number) {
  try {
    // 1️⃣ Verificar si ya existe otra mesa con ese número
    const existingTable = await prisma.table.findUnique({
      where: { number: newNumber },
    });

    if (existingTable) {
      return {
        success: false,
        error: `Ya existe la mesa ${newNumber}`,
      };
    }

    // 2️⃣ Actualizar número de la mesa
    await prisma.table.update({
      where: { id: tableId },
      data: { number: newNumber },
    });

    // 3️⃣ Revalidar path para refrescar UI
    revalidatePath("/admin/tables");

    return { success: true };
  } catch (error) {
    console.error("Error updating table number:", error);
    return {
      success: false,
      error: "No se pudo actualizar la mesa",
    };
  }
}

// Actualizar posición de una mesa
export async function updateTablePosition(tableId: number, x: number, y: number) {
  try {
    await prisma.table.update({
      where: { id: tableId },
      data: {
        positionX: x,
        positionY: y
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating table position:", error);
    return { success: false };
  }
}