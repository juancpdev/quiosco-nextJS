'use client'
import { SearchSchema } from "@/src/schema"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function CategorySearchForm() {
    const router = useRouter()
    const handleSearchForm = (formData: FormData) => {
        const data = {
            search : formData.get('search')
        }
        const result = SearchSchema.safeParse(data)
        
        if(!result.success) {
            result.error.issues.forEach(issue => {
                toast.dismiss()
                toast.error(issue.message)
            })
            return
        }
        router.push(`/admin/categories/search?search=${result.data.search}`)     
    }

  return (
    <form 
        action={handleSearchForm}
        className="flex items-center"
    >
        <input 
            type="text" 
            placeholder="Buscar Categoría"
            className="bg-white border border-gray-200 rounded p-2"
            name="search"
        />

        <input 
            type="submit" 
            value={'Buscar'}
            className="cursor-pointer p-2 font-bold text-white bg-linear-to-tr from-indigo-400 to-indigo-500 rounded shadow-sm transition duration-400 hover:bg-linear-to-tr hover:from-indigo-500 hover:to-indigo-400"
        />
    </form>
  )
}
