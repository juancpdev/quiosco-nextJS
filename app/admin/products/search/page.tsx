// app/admin/products/search/page.tsx
import ProductTable from "@/components/admin/products/ProductTable";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductSearchForm from "@/components/admin/products/ProductSearchForm";

type SearchPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

// Función para normalizar texto (quitar acentos)
function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

async function searchProducts(searchTerm: string) {
  // Obtener todos los productos
  const allProducts = await prisma.product.findMany({
    include: {
      category: true,
    },
  });

  // Normalizar el término de búsqueda
  const normalizedSearch = normalizeText(searchTerm);

  // Filtrar productos que coincidan con la búsqueda (nombre o categoría)
  const filteredProducts = allProducts.filter((product) => {
    const normalizedName = normalizeText(product.name);
    const normalizedCategory = normalizeText(product.category.name);
    
    return (
      normalizedName.includes(normalizedSearch) ||
      normalizedCategory.includes(normalizedSearch)
    );
  });

  return filteredProducts;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { search } = await searchParams;

  if (!search) {
    return (
      <>
        <Heading>Búsqueda de Productos</Heading>
        <div className="text-center py-10">
          <p className="text-gray-500">
            No se proporcionó un término de búsqueda
          </p>
          <Link
            href="/admin/products"
            className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft size={20} />
            Volver a Productos
          </Link>
        </div>
      </>
    );
  }

  const products = await searchProducts(search);

  return (
    <>
      <Heading>Resultados de Búsqueda</Heading>

      <div className="mb-5 flex flex-col gap-5 items-center xl:flex-row xl:justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
        >
          <ArrowLeft size={20} />
          Volver a Productos
        </Link>

        <ProductSearchForm />
      </div>

      <div className="mb-5 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-700">
          Mostrando <span className="font-bold">{products.length}</span>{" "}
          resultado{products.length !== 1 ? "s" : ""} para:{" "}
          <span className="font-bold text-indigo-600">"{search}"</span>
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            No se encontraron productos que coincidan con tu búsqueda
          </p>
          <p className="text-gray-400 mt-2">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      ) : (
        <ProductTable products={products} />
      )}
    </>
  );
}