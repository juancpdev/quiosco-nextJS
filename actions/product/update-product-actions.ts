"use server";

import { prisma } from "@/src/lib/prisma";
import { ProductSchema } from "@/src/schema";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function updateProduct(data: z.infer<typeof ProductSchema>, id: number) {
  // Los datos ya vienen validados desde el formulario, no necesitamos validar de nuevo
  // El tipo z.infer<typeof ProductSchema> ya incluye la transformación (variants es array)

  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { categoryId: true },
    });

    if (!existing) {
      return { errors: [{ path: ["name"], message: "Producto no encontrado" }] };
    }

    const hasVariants = !!data.hasVariants;
    const incomingVariants = data.variants as Array<{ id?: number; name: string; price: number }>;

    // ✅ si hay variantes, recalculamos precio mínimo
    const minVariantPrice =
      hasVariants && incomingVariants.length
        ? Math.min(...incomingVariants.map((v) => Number(v.price)))
        : null;

    const finalPrice = hasVariants
      ? (Number.isFinite(minVariantPrice!) ? minVariantPrice! : 0)
      : (typeof data.price === "number" ? data.price : Number(data.price));

    await prisma.$transaction(async (tx) => {
      // 1) update producto base
      await tx.product.update({
        where: { id },
        data: {
          name: data.name,
          price: finalPrice,
          categoryId: data.categoryId,
          image: data.image,
        },
      });

      // 2) si NO tiene variantes, borrarlas todas y listo
      if (!hasVariants) {
        await tx.productVariant.deleteMany({
          where: { productId: id },
        });
        return;
      }

      // 3) traer ids actuales
      const current = await tx.productVariant.findMany({
        where: { productId: id },
        select: { id: true },
      });

      const currentIds = new Set(current.map((v) => v.id));
      const incomingIds = new Set(
        incomingVariants
          .map((v) => v.id)
          .filter((v): v is number => typeof v === "number" && v > 0)
      );

      // 4) eliminar las que ya no vienen
      const toDelete = [...currentIds].filter((vid) => !incomingIds.has(vid));
      if (toDelete.length) {
        await tx.productVariant.deleteMany({
          where: { id: { in: toDelete } },
        });
      }

      // 5) update/create
      for (const v of incomingVariants) {
        const name = String(v.name ?? "").trim();
        const price = Number(v.price);

        if (!name || !Number.isFinite(price) || price <= 0) continue;

        if (v.id && v.id > 0) {
          await tx.productVariant.update({
            where: { id: v.id },
            data: { name, price },
          });
        } else {
          // ✅ nuevas SIN id
          await tx.productVariant.create({
            data: { productId: id, name, price },
          });
        }
      }
    });

    // ✅ FIX: Obtener ambas categorías (vieja y nueva) para revalidar sus paths
    const oldCategoryId = existing.categoryId;
    const newCategoryId = data.categoryId;
    
    // Revalidar paths globales
    revalidatePath("/admin/products");
    revalidatePath("/order");
    
    // Revalidar la categoría vieja si cambió
    if (oldCategoryId !== newCategoryId) {
      const oldCategory = await prisma.category.findUnique({
        where: { id: oldCategoryId },
        select: { slug: true },
      });
      if (oldCategory?.slug) {
        revalidatePath(`/order/${oldCategory.slug}`);
      }
    }
    
    // Revalidar la categoría nueva
    const newCategory = await prisma.category.findUnique({
      where: { id: newCategoryId },
      select: { slug: true },
    });
    if (newCategory?.slug) {
      revalidatePath(`/order/${newCategory.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updateProduct:", error);
    return { errors: [{ path: ["name"], message: "Error al editar el producto" }] };
  }
}