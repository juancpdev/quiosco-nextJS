import { formatCurrency } from "@/src/utils";
import { Product } from "@prisma/client";
import Image from "next/image";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border border-gray-100 rounded-xl bg-white p-5 flex flex-col justify-between h-full max-w-md ">
      {/* Imagen */}
      <Image
        width={400}
        height={500}
        src={`/products/${product.image}.jpg`}
        alt={`Imagen de ${product.name}`}
        className="rounded-xl"
      />

      {/* Contenido */}
      <div className="mt-5 flex flex-col flex-grow">
        <p className="font-bold text-2xl">{product.name}</p>
      </div>
        <p className="font-black text-4xl mt-3 text-orange-400">{formatCurrency(product.price)}</p>

      {/* Botón */}
      <button className="bg-indigo-500 p-3 text-white w-full font-bold mt-5 text-xl rounded cursor-pointer hover:bg-indigo-400 transition">
        Agregar
      </button>
    </div>
  );
}
