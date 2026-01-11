"use server";

import { prisma } from "@/src/lib/prisma";
import { ProductSchema } from "@/src/schema";
import { revalidatePath } from "next/cache";

export async function createProduct(data: unknown) {
  const result = ProductSchema.safeParse(data);

  if (!result.success) return { errors: result.error.issues };

  try {
    const product = await prisma.product.create({
      data: result.data,
      select: { categoryId: true },
    });

    const category = await prisma.category.findUnique({
      where: { id: product.categoryId },
      select: { slug: true },
    });

    // ✅ Admin
    revalidatePath("/admin/products");

    // ✅ Menú general (si tenés una home de order)
    revalidatePath("/order");

    // ✅ La categoría específica: /order/cafe, /order/hamburguesa, etc.
    if (category?.slug) {
      revalidatePath(`/order/${category.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error creando producto:", error);
    return {
      errors: [{ path: ["name"], message: "Error al crear el producto" }],
    };
  }
}
