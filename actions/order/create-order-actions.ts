// actions/order/create-order-action.ts
'use server'

import { prisma } from "@/src/lib/prisma"
import { OrderSchema } from "@/src/schema"

export async function createOrder(data: unknown) {
  const result = OrderSchema.safeParse(data)
  
  if (!result.success) {
    return {
      errors: result.error.issues
    }
  }

  try {
    const order = await prisma.order.create({
      data: {
        name: result.data.name,
        phone: result.data.phone,
        address: result.data.address,
        deliveryType: result.data.deliveryType,
        table: result.data.table,
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
                productImage: productData.image
              };
            })
          )
        }
      }
    })

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