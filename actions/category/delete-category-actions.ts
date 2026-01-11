"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteCategory(categoryId: number) {
  try {
    // 1️⃣ Traer categoría con conteo de productos
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return {
        success: false,
        error: "Categoría no encontrada"
      };
    }

    // 2️⃣ VALIDACIÓN CLAVE
    if (category._count.products > 0) {
      return {
        success: false,
        error: `No se puede eliminar la categoría porque tiene ${category._count.products} producto(s) asociado(s).`
      };
    }

    // 3️⃣ Eliminar categoría
    await prisma.category.delete({
      where: { id: categoryId }
    });

    // 4️⃣ Revalidar
    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Categoría eliminada correctamente"
    };
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    return {
      success: false,
      error: "Error interno al eliminar la categoría"
    };
  }
}
