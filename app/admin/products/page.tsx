import ProductTable from "@/components/products/ProductTable";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";

type searchParamsType = {
  searchParams: Promise<{ page: number }>
}

export async function getProducts(skip : number, take : number) {
  const products = await prisma.product.findMany({
    take,
    skip,
    include: {
      category: true
    }
  })

  return products
}

export type productWithCategory = Awaited<ReturnType<typeof getProducts>>

export default async function ProductsPage({searchParams} : searchParamsType) {
  
  const page = (await searchParams).page || 1


  const take = 10
  const skip = take * (page - 1)

  const products = await getProducts(skip, take)

  return (
    <>
      <Heading>Administrar Productos</Heading>

      <ProductTable
        products={products}
      />
    </>
  )
}
