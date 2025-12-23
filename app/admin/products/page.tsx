import ProductNavigation from "@/components/products/ProductNavigation";
import ProductSearchForm from "@/components/products/ProductSearchForm";
import ProductTable from "@/components/products/ProductTable";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type ProductsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};
export async function productCont() {
  const totalProducts = await prisma.product.count();
  return totalProducts;
}

export async function getProducts(skip: number, take: number) {
  const products = await prisma.product.findMany({
    take,
    skip,
    include: {
      category: true,
    },
  });

  return products;
}

export type productWithCategory = Awaited<ReturnType<typeof getProducts>>;

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { page } = await searchParams;
  const parsedPage = Number(page);

  if (!page || Number.isNaN(parsedPage) || parsedPage <= 0) {
    redirect("/admin/products?page=1");
  }

  const currentPage = parsedPage;

  const take = 10;
  const skip = take * (currentPage - 1);
  const [products, totalProducts] = await Promise.all([
    getProducts(skip, take),
    productCont(),
  ]);

  const totalPages = Math.ceil(totalProducts / take);

  if (currentPage > totalPages) redirect("/admin/products?page=1");

  return (
    <>
      <Heading>Administrar Productos</Heading>

      <div className="flex flex-col gap-5 items-center xl:flex-row xl:justify-between">
        <Link
            className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 cursor-pointer rounded-lg font-semibold flex items-center gap-2 transition-all'
            href={'/admin/products/new'}
        >
          <Plus size={20} />
          Crear Producto
        </Link>

        <ProductSearchForm />
      </div>

      <ProductTable products={products} />

      <ProductNavigation page={currentPage} totalPages={totalPages} />
    </>
  );
}
