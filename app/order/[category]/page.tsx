import ProductCard from "@/components/products/ProductCard";
import { prisma } from "@/src/lib/prisma";

async function getProducts(category: string) {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: category,
      },
    },
    orderBy: [{ available: "desc" }, { id: "asc" }],
  });

  return products;
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const products = await getProducts(category);

  // 🟡 EMPTY STATE
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="text-6xl">🛒</div>
        <p className="text-gray-500 max-w-md">
          Esta categoría no tiene productos por el momento.  
          Elegí otra categoría o volvé más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-10 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 pb-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
