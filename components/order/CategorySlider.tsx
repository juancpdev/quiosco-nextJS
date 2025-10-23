"use client";

import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { Category } from "@prisma/client";

export default function CategorySlider() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
      slides: { perView: "auto", spacing: 10 },
      loop: true,
      
    breakpoints: {
      "(min-width: 1280px)": { // Desktop
        slides: { perView: 1, spacing: 0 }
      },
    },
  });

  return (
    <nav ref={sliderRef} className="flex xl:flex-col keen-slider ">
      {categories.map((cat) => (
        <div key={cat.id} className="keen-slider__slide flex justify-center items-center xl:border-b xl:rounded-b-xl xl:border-gray-200 ">
          <CategoryIcon category={cat} />
        </div>
      ))}
    </nav>
  );
}
