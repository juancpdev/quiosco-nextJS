'use client'

import { updateProduct } from "@/actions/product/update-product-actions"
import { ProductSchema } from "@/src/schema"
import { useParams, useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function EditProductForm({children} : {children : React.ReactNode}) {
    const param = useParams()
    const id = +param.id!
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() // Previene el comportamiento por defecto
        
        const formData = new FormData(e.currentTarget)
        
        const data = {
            name: formData.get('name'),
            price: formData.get('price'),
            categoryId: formData.get('categoryId'),
            image: formData.get('image')
        }
        
        const result = ProductSchema.safeParse(data)
        
        if(!result.success) {
            result.error.issues.forEach(issue => {
                const toastId = issue.path.join('-')
                // Solo muestra el toast si no existe ya
                if(!toast.isActive(toastId)) {
                    toast.error(issue.message, {
                        toastId: toastId
                    })
                }
            })
            return
        }
        
        const response = await updateProduct(result.data, id)
        
        if(response?.errors) {
            response.errors.forEach(issue => {
                const toastId = issue.path.join('-')
                if(!toast.isActive(toastId)) {
                    toast.error(issue.message, {
                        toastId: toastId
                    })
                }
            })
            return
        }

        toast.success('Producto editado')
        router.back()
    }

    return (
        <div className="bg-white mt-10 px-5 py-10 rounded-xl shadow-md max-w-3xl mx-auto">
            <form
                className="space-y-5"
                onSubmit={handleSubmit}
            >
                {children}

                <input 
                    className="bg-orange-500 hover:bg-orange-700 transition text-white w-full rounded-lg mt-5 p-3 uppercase font-bold cursor-pointer" 
                    type="submit" 
                    value={'Guardar Cambios'} 
                />
            </form>
        </div>
    )
}