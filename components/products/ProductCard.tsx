import { formatCurrency, getImagePath } from "@/src/utils";
import { Product } from "@prisma/client";
import Image from "next/image";
import AddProductButton from "./AddProductButton";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {

  const isAvailable = product.available
  const imagePath = getImagePath(product.image)

  return (
    <div className={`shadow-sm border border-gray-100 bg-white rounded-xl p-5 flex flex-col justify-between h-full max-w-md xl:p-0 ${!isAvailable ? 'opacity-60 grayscale bg-red-500' : ''}`} >
      
      {/* Imagen + Nombre */}
      <div className="flex gap-5 items-center xl:flex-col xl:gap-0 bg- xl:bg-gradient-to-br xl:from-orange-100 xl:to-orange-400 xl:justify-center xl:rounded-2xl">
        {/* Imagen */}
        <div className="relative flex-shrink-0 w-24 aspect-square overflow-hidden rounded-xl xl:w-full xl:aspect-[4/3]">
        
          <Image
            fill
            src={imagePath}
            alt={`Imagen de ${product.name}`}
            className="object-cover object-center transition-transform duration-300 hover:scale-105"
            priority
          />

        {/* Badge de No Disponible */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/70 rounded-t-2xl flex items-center justify-center">
            <div className="bg-red-500 text-white text-center px-4 py-2 rounded-full font-bold text-sm shadow-lg">
              NO DISPONIBLE
            </div>
          </div>
        )}
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

        <AddProductButton product={product} isAvailable={isAvailable} /> 

      </div>
    </div>
  );
}
