'use server'

import { prisma } from "@/src/lib/prisma"
import { CategorySchema } from "@/src/schema"
import { revalidatePath } from "next/cache"

export async function updateCategory(data : unknown, id : number) {
    const result = CategorySchema.safeParse(data)
    if(!result.success) {
        return {
            errors: result.error.issues
        }
    }

    await prisma.category.update({
        where : {
            id
        },
        data: result.data
    })
    
    revalidatePath('/admin/categories');
}