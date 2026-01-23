"use client";

import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import CategoryIcon from "../ui/CategoryIcon";
import { categoryWithProducts } from "@/app/admin/categories/page";

type CategorySliderProps = {
  onCategoryClick?: () => void;
  horizontal?: boolean; // true para móvil horizontal
};

export default function CategorySlider({ onCategoryClick, horizontal = false }: CategorySliderProps) {
  const [categories, setCategories] = useState<categoryWithProducts>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar categorías:", err);
        setIsLoading(false);
      });
  }, []);

  // Keen Slider SOLO para móvil horizontal
  const [sliderRefMobile] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: "auto",
      spacing: 10,
    },
    mode: "free-snap",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-200 border-t-orange-600 mx-auto" />
          <p className="text-sm text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-2">
          <p className="text-gray-500 font-medium">No hay categorías</p>
        </div>
      </div>
    );
  }

  // Versión horizontal para móvil (con Keen Slider)
  if (horizontal) {
    return (
      <div ref={sliderRefMobile} className="keen-slider">
        {categories.map((category) => (
          <div
            key={category.id}
            className="keen-slider__slide w-auto!"
            onClick={onCategoryClick}
          >
            <CategoryIcon category={category}  />
          </div>
        ))}
      </div>
    );
  }

  // Versión vertical para desktop (sin Keen Slider, scroll nativo)
  return (
    <div className="relative h-full">
      <div
        id="categories-container"
        className="h-full overflow-y-auto overflow-x-hidden space-y-2 pr-2 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-transparent"
      >
        {categories.map((category) => category._count.products > 0 ? (
          <div key={category.id} onClick={onCategoryClick}>
            <CategoryIcon category={category} />
          </div>
          ) : null
        )}
      </div>

    </div>
  );
}