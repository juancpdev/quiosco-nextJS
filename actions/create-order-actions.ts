"use server";

import { prisma } from "@/src/lib/prisma";
import { OrderSchema } from "@/src/schema";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

export async function createOrder(data: unknown, isAdmin: boolean = false) {
  const result = OrderSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.issues
    };
  }

   const { order } = result.data

    // ✅ NUEVA VALIDACIÓN: Verificar disponibilidad de productos
    const productIds = order.map(item => item.id)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      },
      select: {
        id: true,
        name: true,
        available: true
      }
    })

    // Encontrar productos no disponibles
    const unavailableProducts = products.filter(p => !p.available)
    
    if (unavailableProducts.length > 0) {
      return {
        errors: [{
          message: `Productos no disponibles: ${unavailableProducts.map(p => p.name).join(', ')}`,
          path: ['products']
        }]
      }
    }

  try {
    let tableId: number | undefined;
    let sessionId: string | undefined;

    // 📌 FIX: teléfono opcional
    const phone = result.data.phone ?? null;

    // Si es pedido local (mesa)
    if (result.data.deliveryType === "local" && result.data.table) {
      const tableNumber = result.data.table;
      
      // Buscar la mesa con sus órdenes activas
      let table = await prisma.table.findUnique({
        where: { number: tableNumber },
        include: {
          orders: {
            where: {
              status: {
                in: ["pending", "completed"]
              },
              ...(phone ? { phone } : {}), // ✅ SOLO filtra por teléfono si existe
            },
            take: 1
          }
        }
      });

      // Si no existe la mesa, crearla
      if (!table) {
        table = await prisma.table.create({
          data: {
            number: tableNumber,
            status: "available"
          },
          include: {
            orders: true
          }
        });
      }

      // Lógica de sesiones
      if (table.status === "available") {
        // Mesa libre → nueva sesión
        sessionId = nanoid(10);
        
        await prisma.table.update({
          where: { id: table.id },
          data: {
            status: "occupied",
            sessionId: sessionId
          }
        });
      } else {
        // Mesa ocupada
        if (table.orders.length > 0) {
          // ✅ Mismo teléfono → usar misma sesión
          sessionId = table.sessionId || nanoid(10);
        } else {
          // ❌ Diferente teléfono o admin sin teléfono → nueva sesión
          sessionId = nanoid(10);
        }
      }

      tableId = table.id;
    }

    // Crear la orden
    await prisma.order.create({
      data: {
        name: result.data.name,
        phone: phone, // ✅ Puede ser null para admin 
        address: result.data.address,
        deliveryType: result.data.deliveryType,
        table: result.data.table,
        tableId: tableId,
        sessionId: sessionId,
        paymentMethod: result.data.paymentMethod,
        note: result.data.note,
        total: result.data.total,
        paymentInfo: result.data.paymentInfo,
        status: "pending",
        createdBy: isAdmin ? "admin" : "client",
        orderProducts: {
          create: result.data.order.map((product) => ({
            productId: product.id,
            quantity: product.quantity,
          })),
        },
      }
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin/tables");
    
    return { success: true };

  } catch (error) {
    console.error("Error creating order:", error);
    return {
      errors: [{ message: "Error al crear la orden" }]
    };
  }
}
