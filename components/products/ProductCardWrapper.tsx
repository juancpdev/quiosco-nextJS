import { ProductWithVariants } from "@/src/types";
import ProductCard from "./ProductCard";

type Props = {
  product: ProductWithVariants;
};

export default function ProductCardWrapper({ product }: Props) {
  return <ProductCard product={product} />;
}
