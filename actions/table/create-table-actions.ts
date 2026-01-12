"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

// Función auxiliar para encontrar números de mesa faltantes
async function findMissingTableNumbers(count: number): Promise<number[]> {
  const existingTables = await prisma.table.findMany({
    select: { number: true },
    orderBy: { number: 'asc' }
  });

  const existingNumbers = new Set(existingTables.map(t => t.number));
  const missingNumbers: number[] = [];
  
  // Buscar huecos en la secuencia
  let currentNumber = 1;
  while (missingNumbers.length < count) {
    if (!existingNumbers.has(currentNumber)) {
      missingNumbers.push(currentNumber);
    }
    currentNumber++;
  }

  return missingNumbers;
}

// Crear múltiples mesas (rellenando huecos primero)
export async function createTables(count: number) {
  try {
    const missingNumbers = await findMissingTableNumbers(count);
    
    const tablesToCreate = missingNumbers.map(number => ({
      number,
      status: "available",
      positionX: 50 + (Math.random() * 300), // Posición aleatoria inicial
      positionY: 50 + (Math.random() * 300)
    }));

    await prisma.table.createMany({
      data: tablesToCreate,
      skipDuplicates: true
    });

    revalidatePath("/admin/tables");
    return { success: true };
  } catch (error) {
    console.error("Error creating tables:", error);
    return { success: false };
  }
}