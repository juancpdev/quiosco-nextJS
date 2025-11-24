"use server";

import { prisma } from "@/src/lib/prisma";
import { OrderSchema } from "@/src/schema";

export async function createOrder(data: unknown) {
  const result = OrderSchema.safeParse(data);

  if (!result.success) {
    return {
        errors: result.error.issues
    }
  }

  try {
    console.log(data);
    
    await prisma.order.create({
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
                create: result.data.order.map((product) => ({
                    productId: product.id,
                    quantity: product.quantity,
                })),
            },
        }
  });

  } catch (error) {
    console.log(error)
  }
}
