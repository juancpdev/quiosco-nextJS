"use server";

import { prisma } from "@/src/lib/prisma";
import { CategorySchema } from "@/src/schema";
import { generateSlug } from "@/src/utils";

export async function createCategory(data: unknown) {
  const result = CategorySchema.safeParse(data);

  if (!result.success) {
    return { errors: result.error.issues };
  }

  try {
    const slug = generateSlug(result.data.name);

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return {
        errors: [
          {
            path: ["name"],
            message: "Ya existe una categoría con este nombre",
          },
        ],
      };
    }

    await prisma.category.create({
      data: {
        name: result.data.name,
        slug,
        icon: result.data.icon,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    return {
      errors: [
        {
          path: ["name"],
          message: "Error al crear la categoría",
        },
      ],
    };
  }
}
