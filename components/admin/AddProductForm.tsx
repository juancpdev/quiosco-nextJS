'use client'

import { createProduct } from "@/actions/create-product-actions"
import { ProductSchema } from "@/src/schema"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"


export default function AddProductForm({children} : {children : React.ReactNode}) {
    const router = useRouter()

    const handleSubmit = async (formData : FormData) => {
        const data = {
            name: formData.get('name'),
            price: formData.get('price'),
            categoryId: formData.get('categoryId'),
            image: formData.get('image')
        }
        const result = ProductSchema.safeParse(data)
        if(!result.success) {
            result.error.issues.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }
        const response = await createProduct(result.data)
        if(response?.errors) {
            response.errors.forEach(issue => {
                toast.error(issue.message)
            })
            return
        }

        toast.success('Producto creado')
        router.push('/admin/products')
    }

  return (
    <div className="bg-white mt-10 px-5 py-10 rounded-xl shadow-md max-w-3xl mx-auto">
        <form
            className="space-y-5"
            action={handleSubmit}
        >
            {children}

            <input 
                className="bg-orange-500 hover:bg-orange-700 transition text-white w-full rounded-lg mt-5 p-3 uppercase font-bold cursor-pointer" 
                type="submit" 
                value={'Crear Producto'} 
            />
        </form>
    </div>
  )
}
