import Heading from "@/components/ui/Heading";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-5 items-center">
        <Heading>Categoria No Encontrada</Heading>

        <Link
            href={`/admin/categories`}
            className="rounded bg-orange-400 hover:bg-orange-500 transition w-fit font-bold py-3 px-8 text-white"
        >Ir a Categorias</Link>
    </div>
  )
}
