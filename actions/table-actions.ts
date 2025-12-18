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

// Eliminar una mesa
export async function deleteTable(tableNumber: number) {
  try {
    const table = await prisma.table.findUnique({
      where: { number: tableNumber },
      include: {
        orders: {
          where: {
            status: {
              in: ["pending", "preparing", "ready"]
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

// Obtener todas las mesas
export async function getAllTables() {
  const tables = await prisma.table.findMany({
    orderBy: { number: 'asc' }
  });
  return tables;
}

// Verificar disponibilidad de mesa Y retornar teléfono si está ocupada
export async function checkTableAvailability(tableNumber: number) {
  const table = await prisma.table.findUnique({
    where: { number: tableNumber },
    include: {
      orders: {
        where: {
          status: {
            in: ["pending", "preparing", "ready"]
          }
        },
        take: 1, // Solo necesitamos el primer pedido para obtener el teléfono
        orderBy: {
          date: 'asc'
        }
      }
    }
  });
  
  const isAvailable = table?.status === "available";
  const firstOrderPhone = table?.orders[0]?.phone || null;
  
  return {
    available: isAvailable,
    phone: firstOrderPhone, // ✨ Ahora retorna el teléfono
    sessionId: table?.sessionId,
    tableId: table?.id,
    exists: !!table
  };
}

// Obtener mesas ocupadas con sus órdenes
export async function getTablesWithOrders() {
  const tables = await prisma.table.findMany({
    where: {
      status: "occupied"
    },
    include: {
      orders: {
        where: {
          status: {
            in: ["pending", "completed"]
          }
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
      }
    }
  });

  return tables;
}

export async function closeTable(
  tableId: number, 
  paymentMethod: 'efectivo' | 'tarjeta'
) {
  try {
    // 1️⃣ Traer todas las órdenes de la mesa
    const orders = await prisma.order.findMany({
      where: { tableId }
    });

    // 2️⃣ Verificar si hay órdenes pendientes
    const hasPendingOrders = orders.some(order => order.status !== 'completed');
    if (hasPendingOrders) {
      return { 
        success: false, 
        error: 'No se puede cerrar la mesa, hay órdenes pendientes' 
      };
    }

    // 3️⃣ Guardar el método de pago en las órdenes (solo para métricas)
    await prisma.order.updateMany({
      where: { tableId },
      data: { paymentMethod }
    });

    // 4️⃣ Liberar la mesa
    await prisma.table.update({
      where: { id: tableId },
      data: {
        status: 'available',
        sessionId: null
      }
    });

    // 5️⃣ Revalidar paths para refrescar UI
    revalidatePath('/admin/tables');
    revalidatePath('/admin/orders');

    return { success: true };
  } catch (error) {
    console.error('Error closing table:', error);
    return { success: false, error: 'Error al cerrar la mesa' };
  }
}


// Obtener resumen de una mesa específica
export async function getTableSummary(tableNumber: number) {
  const table = await prisma.table.findUnique({
    where: { number: tableNumber },
    include: {
      orders: {
        where: {
          status: {
            in: ["pending", "completed"]
          }
        },
        include: {
          orderProducts: {
            include: {
              product: true
            }
          }
        }
      }
    }
  });

  if (!table || table.orders.length === 0) {
    return null;
  }

  const totalAmount = table.orders.reduce((sum, order) => sum + order.total, 0);

  return {
    tableNumber: table.number,
    tableId: table.id,
    sessionId: table.sessionId,
    status: table.status,
    orders: table.orders,
    totalAmount,
    customerName: table.orders[0]?.name || "",
    phone: table.orders[0]?.phone || "",
  };
}