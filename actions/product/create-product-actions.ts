"use server";

import { prisma } from "@/src/lib/prisma";
import { ProductSchema } from "@/src/schema";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function createProduct(data: z.infer<typeof ProductSchema>) {
  // Los datos ya vienen validados desde el formulario, no necesitamos validar de nuevo
  // El tipo z.infer<typeof ProductSchema> ya incluye la transformación (variants es array)
  
  try {
    const incomingVariants = data.variants as Array<{ id?: number; name: string; price: number }>;
    const hasVariants = !!data.hasVariants;

    // ✅ si hay variantes, guardamos precio = mínimo
    const minVariantPrice =
      hasVariants && incomingVariants.length
        ? Math.min(...incomingVariants.map((v) => Number(v.price)))
        : null;

    const finalPrice = hasVariants
      ? (Number.isFinite(minVariantPrice!) ? minVariantPrice! : 0)
      : (typeof data.price === "number" ? data.price : Number(data.price));

    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: finalPrice,
        categoryId: data.categoryId,
        image: data.image,

        // ✅ crear variantes si corresponde
        ...(hasVariants && incomingVariants.length
          ? {
              variants: {
                create: incomingVariants
                  .map((v) => ({
                    name: String(v.name).trim(),
                    price: Number(v.price),
                  }))
                  .filter((v) => v.name && v.price > 0),
              },
            }
          : {}),
      },
      select: { categoryId: true },
    });

    const category = await prisma.category.findUnique({
      where: { id: product.categoryId },
      select: { slug: true },
    });

    revalidatePath("/admin/products");
    revalidatePath("/order");
    if (category?.slug) revalidatePath(`/order/${category.slug}`);

    return { success: true };
  } catch (error) {
    console.error("Error creando producto:", error);
    return {
      errors: [{ path: ["name"], message: "Error al crear el producto" }],
    };
  }
}
