'use server';

import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleProductAvailability(productId: number, available: boolean) {
  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { available }
    });

    // Revalidar la página de productos para actualizar la UI
    revalidatePath('/admin/products');

    return {
      success: true,
      product
    };
  } catch (error) {
    console.error('Error al actualizar disponibilidad:', error);
    return {
      success: false,
      error: 'Error al actualizar la disponibilidad'
    };
  }
}