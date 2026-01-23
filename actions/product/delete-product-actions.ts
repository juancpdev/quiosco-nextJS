// actions/product/delete-product-actions.ts
'use server'

import { prisma } from "@/src/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteProduct(productId: number) {
  try {
    // Eliminar el producto
    // El onDelete: SetNull pondrá productId en null pero conservará los datos
    await prisma.product.delete({
      where: { id: productId }
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Producto eliminado correctamente. El historial de ventas se mantiene.'
    };

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return {
      success: false,
      message: 'Error al eliminar el producto'
    };
  }
}