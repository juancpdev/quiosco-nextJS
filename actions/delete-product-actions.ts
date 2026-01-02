'use server';

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProduct(productId: number) {
  try {
    // Verificar si el producto existe
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return {
        success: false,
        error: 'Producto no encontrado'
      };
    }

    // Eliminar el producto
    await prisma.product.delete({
      where: { id: productId }
    });

    // Revalidar la página de productos para reflejar los cambios
    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Producto eliminado correctamente'
    };

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return {
      success: false,
      error: 'Error al eliminar el producto'
    };
  }
}