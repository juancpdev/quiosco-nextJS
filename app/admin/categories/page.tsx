import CategorySearchForm from "@/components/admin/categories/CategorySearchForm";
import CategoryTable from "@/components/admin/categories/CategoryTable";
import ProductNavigation from "@/components/admin/products/ProductNavigation";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type CategoriesPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};
export async function categoriesCount() {
  const totalCategories = await prisma.category.count();
  return totalCategories;
}

export async function getCategories(skip: number, take: number) {
  const categories = await prisma.category.findMany({
    take,
    skip,
    include: {
      _count: true
    },
  });

  return categories;
}

export type categoryWithProducts = Awaited<ReturnType<typeof getCategories>>;

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const { page } = await searchParams;
  const parsedPage = Number(page);

  if (!page || Number.isNaN(parsedPage) || parsedPage <= 0) {
    redirect("/admin/categories?page=1");
  }

  const currentPage = parsedPage;

  const take = 10;
  const skip = take * (currentPage - 1);
  const [categories, totalCategories] = await Promise.all([
    getCategories(skip, take),
    categoriesCount(),
  ]);

  const totalPages = Math.ceil(totalCategories / take);

  if (currentPage > totalPages) redirect("/admin/categories?page=1");

  return (
    <>
      <Heading>Administrar Categorias</Heading>

      <div className="flex flex-col gap-5 items-center xl:flex-row xl:justify-between">
        <Link
            className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 cursor-pointer rounded-lg font-semibold flex items-center gap-2 transition-all'
            href={'/admin/categories/new'}
        >
          <Plus size={20} />
          Crear Categoria
        </Link>

        <CategorySearchForm />
      </div>

      <CategoryTable categories={categories} />

      <ProductNavigation page={currentPage} totalPages={totalPages} />
    </>
  );
}
