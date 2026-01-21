"use client";

import { useMemo, useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductVariant } from "@prisma/client";
import type { ProductWithVariants } from "@/src/types";
import { formatCurrency, getImagePath } from "@/src/utils";
import AddProductButton from "./AddProductButton";

type ProductCardProps = {
  product: ProductWithVariants;
};

export default function ProductCard({ product }: ProductCardProps) {
  const isAvailable = product.available;
  const imagePath = getImagePath(product.image);

  const variants = useMemo(() => {
    const allVariants = product.variants ?? [];
    return allVariants.sort((a, b) => Number(a.price) - Number(b.price));
  }, [product.variants]);
  const hasVariants = variants.length > 0;

  const minVariantPrice = useMemo(() => {
    if (!hasVariants) return null;
    const min = Math.min(...variants.map((v) => Number(v.price)));
    return Number.isFinite(min) ? min : null;
  }, [hasVariants, variants]);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  const displayPrice = selectedVariant?.price ?? minVariantPrice ?? product.price;

  const mobileSliderRef = useRef<HTMLDivElement>(null);
  const desktopSliderRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (!ref.current) return;
    const scrollAmount = 200;
    const newScrollLeft = ref.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
    ref.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  };

  return (
    <div
      className={`shadow-sm border border-gray-100 bg-white rounded-xl p-4 flex flex-col justify-between h-full w-full xl:p-0 xl:shadow-lg ${
        !isAvailable ? "opacity-60 grayscale" : ""
      }`}
    >
      {/* Imagen + Nombre */}
      <div className="flex gap-4 items-start xl:flex-col xl:gap-0 xl:bg-gradient-to-br xl:from-orange-100 xl:to-orange-400 xl:justify-center xl:rounded-2xl">
        {/* Imagen */}
        <div className="relative flex-shrink-0 w-20 aspect-square overflow-hidden rounded-lg xl:w-full xl:aspect-[4/3] xl:rounded-2xl">
          <Image
            fill
            src={imagePath}
            alt={`Imagen de ${product.name}`}
            className="object-cover object-center transition-transform duration-300 hover:scale-105"
            priority
          />

          {/* Badge No Disponible */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/70 rounded-lg xl:rounded-2xl flex items-center justify-center">
              <div className="bg-red-500 text-white text-center px-3 py-2 rounded-full font-bold text-xs shadow-lg">
                NO DISPONIBLE
              </div>
            </div>
          )}

          {/* Variantes Desktop - Overlay en parte inferior de la imagen */}
          {hasVariants && (
            <div className="hidden xl:block absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-3 rounded-b-2xl">
              <div className="relative px-3 group">
                {/* Botón Izquierdo */}
                <button
                  type="button"
                  onClick={() => scroll(desktopSliderRef as React.RefObject<HTMLDivElement>, "left")}
                  className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white text-gray-700 rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Slider */}
                <div
                  ref={desktopSliderRef}
                  className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {variants.map((v) => {
                    const active = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(active ? null : v)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
                          active
                            ? "bg-orange-500 text-white border-orange-500 shadow-lg"
                            : "bg-white/95 backdrop-blur-sm text-gray-700 border-gray-300 hover:bg-orange-50"
                        }`}
                        title={`${v.name} - $${Number(v.price).toFixed(2)}`}
                      >
                        <span className="block leading-none">{v.name}</span>
                        <span className={`text-xs leading-none mt-0.5 ${
                          active ? "text-orange-100" : "text-gray-500"
                        }`}>
                          ${Number(v.price).toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Botón Derecho */}
                <button
                  type="button"
                  onClick={() => scroll(desktopSliderRef as React.RefObject<HTMLDivElement>, "right")}
                  className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white text-gray-700 rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Nombre */}
        <div className="flex flex-col flex-1 min-w-0">
          <p className="font-bold text-gray-800 xl:p-2 xl:text-center text-lg truncate">
            {product.name}
          </p>
        </div>
      </div>

      {/* Variantes Mobile - Slide horizontal entre secciones */}
      {hasVariants && (
        <div className="xl:hidden mt-3 -mx-4">
          <div className="relative px-4 group">
            {/* Botón Izquierdo */}
            <button
              type="button"
              onClick={() => scroll(mobileSliderRef as React.RefObject<HTMLDivElement>, "left")}
              className="cursor-pointer absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-gray-700 rounded-full p-1.5 shadow-md border border-gray-200"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Slider */}
            <div
              ref={mobileSliderRef}
              className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 scroll-smooth mx-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {variants.map((v) => {
                const active = selectedVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(active ? null : v)}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-orange-50 hover:border-orange-300"
                    }`}
                    title={`${v.name} - $${Number(v.price).toFixed(2)}`}
                  >
                    <span className="block leading-none">{v.name}</span>
                    <span className={`text-xs leading-none mt-0.5 ${
                      active ? "text-orange-100" : "text-gray-500"
                    }`}>
                      ${Number(v.price).toFixed(2)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Botón Derecho */}
            <button
              type="button"
              onClick={() => scroll(mobileSliderRef as React.RefObject<HTMLDivElement>, "right")}
              className="cursor-pointer absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-gray-700 rounded-full p-1.5 shadow-md border border-gray-200"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Precio + Botón */}
      <div className="flex items-center justify-between xl:bg-white xl:rounded-2xl xl:p-2 xl:mt-2">
        <div className="flex flex-col">
          <p className="font-black text-2xl xl:text-3xl text-orange-400 leading-none">
            {formatCurrency(displayPrice)}
          </p>
        </div>

        <AddProductButton
          product={product}
          isAvailable={isAvailable}
          selectedVariant={selectedVariant}
        />
      </div>
    </div>
  );
}