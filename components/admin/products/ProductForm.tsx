import { prisma } from "@/src/lib/prisma"
import ImageUpload from "./ImageUpload"
import VariantInput from "./VariantInput"
import type { ProductWithVariants } from "@/src/types"

async function getCategories() {
  return await prisma.category.findMany({ orderBy: { name: "asc" } })
}

type ProductFormProps = {
  product?: ProductWithVariants
}

export default async function ProductForm({ product }: ProductFormProps) {
  const categories = await getCategories()

  return (
    <>
      {/* Nombre */}
      <div className="space-y-2">
        <label className="text-slate-800 font-semibold" htmlFor="name">
          Nombre del Producto
        </label>
        <input
          id="name"
          type="text"
          name="name"
          className="block w-full p-3 bg-slate-100 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Ej: Coca Cola, Pizza Muzzarella..."
          defaultValue={product?.name}
          required
        />
      </div>

      {/* Categoría */}
      <div className="space-y-2">
        <label className="text-slate-800 font-semibold" htmlFor="categoryId">
          Categoría
        </label>
        <select
          className="block w-full p-3 bg-slate-100 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          id="categoryId"
          name="categoryId"
          defaultValue={product?.categoryId ?? ""}
          required
        >
          <option value="">-- Seleccione una categoría --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* VARIANTES (incluye toggle interno, precio base, y gestión) */}
      <VariantInput 
        initialVariants={product?.variants ?? []}
        initialPrice={product?.price}
      />
      
      {/* Imagen */}
      <ImageUpload image={product?.image} />

    </>
  )
}