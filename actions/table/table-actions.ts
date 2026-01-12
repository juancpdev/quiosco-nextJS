"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

// Verificar disponibilidad de mesa Y retornar teléfono si está ocupada
export async function checkTableAvailability(tableNumber: number) {
  const table = await prisma.table.findUnique({
    where: { number: tableNumber },
    include: {
      orders: {
        where: { status: { in: ["pending", "completed"] } },
        take: 10,
        orderBy: { date: "asc" },
      },
    },
  });

  const isAvailable = table?.status === "available";
  const sessionOrders = table?.sessionId
    ? table.orders.filter((o) => o.sessionId === table.sessionId)
    : [];

  const firstOrderPhone = sessionOrders[0]?.phone || null;

  return {
    available: isAvailable,
    phone: firstOrderPhone,
    sessionId: table?.sessionId,
    tableId: table?.id,
    exists: !!table,
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
          status: { in: ["pending", "completed"] },
          sessionId: { not: null }
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
  // 👇 filtrar del lado de prisma mejor:
  // pero acá al menos no rompe.
  return tables.map((t) => ({
    ...t,
    orders: t.orders.filter((o) => o.sessionId === t.sessionId),
  }));
}

export async function closeTable(tableId: number, paymentMethod: "efectivo" | "tarjeta") {
  try {
    const table = await prisma.table.findUnique({
      where: { id: tableId },
      select: { sessionId: true, number: true }
    });

    if (!table) return { success: false, error: "Mesa no encontrada" };

    const orders = await prisma.order.findMany({
      where: { tableId }
    });

    const hasPendingOrders = orders.some(o => o.status !== "completed");
    if (hasPendingOrders) {
      return { success: false, error: "No se puede cerrar la mesa, hay órdenes pendientes" };
    }

    // 🔥 importante: operar por sessionId actual
    const currentSessionId = table.sessionId;

    await prisma.$transaction([
      // Guardar pago en las órdenes de la sesión actual
      prisma.order.updateMany({
        where: {
          tableId,
          ...(currentSessionId ? { sessionId: currentSessionId } : {}),
        },
        data: { paymentMethod }
      }),

      // ✅ Desasociar órdenes de esa sesión para que no vuelvan a aparecer
      prisma.order.updateMany({
        where: {
          tableId,
          ...(currentSessionId ? { sessionId: currentSessionId } : {}),
        },
        data: {
          tableId: null
        }
      }),

      // Liberar la mesa
      prisma.table.update({
        where: { id: tableId },
        data: {
          status: "available",
          sessionId: null
        }
      })
    ]);

    revalidatePath("/admin/tables");
    revalidatePath("/admin/orders");

    return { success: true };
  } catch (error) {
    console.error("Error closing table:", error);
    return { success: false, error: "Error al cerrar la mesa" };
  }
}

// Obtener todas las mesas
export async function getAllTables() {
  const tables = await prisma.table.findMany({
    orderBy: { number: 'asc' }
  });
  return tables;
}

// Obtener resumen de una mesa específica
export async function getTableSummary(tableNumber: number) {
  const table = await prisma.table.findUnique({
    where: { number: tableNumber },
    include: {
      orders: {
        where: {
          status: { in: ["pending", "completed"] },
        },
        include: { orderProducts: { include: { product: true } } },
        orderBy: { date: "asc" },
      },
    },
  });

  if (!table || !table.sessionId) return null;

  const sessionOrders = table.orders.filter((o) => o.sessionId === table.sessionId);

  if (sessionOrders.length === 0) return null;

  const totalAmount = sessionOrders.reduce((sum, order) => sum + order.total, 0);

  return {
    tableNumber: table.number,
    tableId: table.id,
    sessionId: table.sessionId,
    status: table.status,
    orders: sessionOrders,
    totalAmount,
    customerName: sessionOrders[0]?.name || "",
    phone: sessionOrders[0]?.phone || "",
  };
}
