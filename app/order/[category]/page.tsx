import ProductCard from "@/components/products/ProductCard";
import { prisma } from "@/src/lib/prisma";

async function getProducts(category: string) {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: category
      }
    },
    orderBy: [
      { available: 'desc' },
      { id: 'asc'}
    ]
  })
  return products
}

export default async function OrderPage({params} : {params : Promise<{category : string}>}) {
  const { category } = await params
  const products = await getProducts(category)
  
  return (
    <div className="grid gap-10 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 pb-10">

        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
   
    </div>
  )
}