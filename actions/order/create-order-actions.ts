// actions/order/create-order-action.ts
'use server'

import { prisma } from "@/src/lib/prisma"
import { OrderSchema } from "@/src/schema"
import { revalidatePath } from "next/cache"

export async function createOrder(data: unknown) {
  const result = OrderSchema.safeParse(data)
  
  if (!result.success) {
    return {
      errors: result.error.issues
    }
  }

  try {
    // 🔥 MANEJAR LÓGICA DE MESAS PARA PEDIDOS LOCALES
    let tableId: number | undefined;
    let sessionId: string | undefined;

    if (result.data.deliveryType === 'local' && result.data.table) {
      // Buscar la mesa por número
      const table = await prisma.table.findUnique({
        where: { number: result.data.table }
      });

      if (!table) {
        throw new Error(`Mesa ${result.data.table} no encontrada`);
      }

      tableId = table.id;

      // Si la mesa ya tiene una sesión activa, usarla
      if (table.sessionId && table.status === 'occupied') {
        sessionId = table.sessionId;
        console.log(`📋 Mesa ${result.data.table} ya ocupada, usando sesión existente: ${sessionId}`);
      } else {
        // Crear nueva sesión para esta mesa
        sessionId = `session_${table.id}_${Date.now()}`;

        // Marcar la mesa como ocupada con nueva sesión
        await prisma.table.update({
          where: { id: table.id },
          data: {
            status: 'occupied',
            sessionId: sessionId
          }
        });

        console.log(`🆕 Mesa ${result.data.table} ocupada con nueva sesión: ${sessionId}`);
      }
    }

    const order = await prisma.order.create({
      data: {
        name: result.data.name,
        phone: result.data.phone,
        address: result.data.address,
        deliveryType: result.data.deliveryType,
        table: result.data.table,
        tableId: tableId,
        sessionId: sessionId,
        paymentMethod: result.data.paymentMethod,
        note: result.data.note,
        total: result.data.total,
        paymentInfo: result.data.paymentInfo,
        orderProducts: {
          create: await Promise.all(
            result.data.order.map(async (product) => {
              // 🔥 OBTENER LOS DATOS DEL PRODUCTO
              const productData = await prisma.product.findUnique({
                where: { id: product.id }
              });

              if (!productData) {
                throw new Error(`Producto ${product.id} no encontrado`);
              }

              return {
                productId: product.id,
                quantity: product.quantity,
                // 🔥 GUARDAR COPIA DE LOS DATOS
                productName: productData.name,
                productPrice: productData.price,
                productImage: productData.image,
                // 🔥 GUARDAR INFORMACIÓN DE VARIANTES
                variantId: product.variantId || null,
                variantName: product.variantName || null
              };
            })
          )
        }
      }
    })

    console.log('✅ Orden creada exitosamente:', {
      orderId: order.id,
      status: order.status,
      deliveryType: order.deliveryType,
      tableId: order.tableId,
      sessionId: order.sessionId,
      total: order.total,
      productCount: order.orderProducts.length
    })

    // 🔥 REFRESCAR RUTAS RELACIONADAS
    revalidatePath('/admin/orders')
    revalidatePath('/admin/tables')
    revalidatePath('/orders')

    return {
      success: true,
      orderId: order.id
    }
  } catch (error) {
    console.error('Error al crear orden:', error)
    return {
      success: false,
      message: 'Error al crear la orden'
    }
  }
}