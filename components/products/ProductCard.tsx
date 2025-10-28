import { formatCurrency } from "@/src/utils";
import { Product } from "@prisma/client";
import Image from "next/image";
import AddProductButton from "./AddProductButton";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className=" shadow-sm border border-gray-100 bg-white rounded-xl p-5 flex flex-col justify-between h-full max-w-md xl:p-0 xl:bg-white">
      {/* Imagen + Nombre */}
      <div className="flex gap-5 items-center xl:flex-col xl:gap-0 bg- xl:bg-gradient-to-br xl:from-orange-100 xl:to-orange-400 xl:justify-center xl:rounded-2xl">
        {/* Imagen */}
        <div className="relative flex-shrink-0 w-24 aspect-square overflow-hidden rounded-xl xl:w-full xl:aspect-[4/3]">
          <Image
            fill
            src={`/products/${product.image}.jpg`}
            alt={`Imagen de ${product.name}`}
            className="object-cover object-center transition-transform duration-300 hover:scale-105"
            priority
          />
        </div>

        {/* Contenido */}
        <div className="flex flex-col flex-grow mt-0 ">
          <p className="font-bold text-xl text-gray-800 xl:text-base xl:p-2">{product.name}</p>
        </div>
      </div>

      {/* Precio + Botón */}
      <div className="flex items-center justify-between xl:bg-white xl:rounded-2xl xl:p-2">
        <p className="font-black text-2xl text-orange-400">
          {formatCurrency(product.price)}
        </p>

        <AddProductButton product={product} />
      </div>
    </div>
  );
}
