import CategoryTable from "@/components/admin/categories/CategoryTable";
import CategorySearchForm from "@/components/admin/categories/CategorySearchForm";
import { prisma } from "@/src/lib/prisma";
import { filterBySearch } from "@/src/lib/search";
import SearchLayout from "@/components/admin/SearchLayout";

type SearchPageProps = {
  searchParams: Promise<{ search?: string }>;
};

// Función para buscar categorías
async function searchCategories(search: string) {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } }, // necesario para CategoryTable
  });

  // Filtrar usando helper genérico
  return filterBySearch(categories, search, (c) => [c.name]);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { search } = await searchParams;

  if (!search) {
    // Caso sin término de búsqueda
    return (
      <SearchLayout
        title="Búsqueda de Categorías"
        backHref="/admin/categories"
        backLabel="Volver a Categorías"
        searchForm={<CategorySearchForm />}
        total={0}
        query=""
        emptyMessage="No se proporcionó un término de búsqueda"
      />
    );
  }

  const categories = await searchCategories(search);

  return (
    <SearchLayout
      title="Resultados de Búsqueda"
      backHref="/admin/categories"
      backLabel="Volver a Categorías"
      searchForm={<CategorySearchForm />}
      total={categories.length}
      query={search}
      emptyMessage="No se encontraron categorías"
    >
      <CategoryTable categories={categories} />
    </SearchLayout>
  );
}
