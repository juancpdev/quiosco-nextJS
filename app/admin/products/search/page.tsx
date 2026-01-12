import ProductTable from "@/components/admin/products/ProductTable";
import ProductSearchForm from "@/components/admin/products/ProductSearchForm";

import { prisma } from "@/src/lib/prisma";
import { filterBySearch } from "@/src/lib/search";
import SearchLayout from "@/components/admin/SearchLayout";

type SearchPageProps = {
  searchParams: Promise<{ search?: string }>;
};

async function searchProducts(search: string) {
  const products = await prisma.product.findMany({
    include: { category: true },
  });

  return filterBySearch(products, search, (p) => [p.name, p.category.name]);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { search } = await searchParams;

  if (!search) {
    return (
      <SearchLayout
        title="Búsqueda de Productos"
        backHref="/admin/products"
        backLabel="Volver a Productos"
        searchForm={<ProductSearchForm />}
        total={0}
        query=""
        emptyMessage="No se proporcionó un término de búsqueda"
      />
    );
  }

  const products = await searchProducts(search);

  return (
    <SearchLayout
      title="Resultados de Búsqueda"
      backHref="/admin/products"
      backLabel="Volver a Productos"
      searchForm={<ProductSearchForm />}
      total={products.length}
      query={search}
      emptyMessage="No se encontraron productos"
    >
      <ProductTable products={products} />
    </SearchLayout>
  );
}
