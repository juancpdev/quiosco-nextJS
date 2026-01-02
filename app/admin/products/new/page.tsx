import AddProductForm from "@/components/admin/AddProductForm";
import ProductForm from "@/components/admin/ProductForm";
import GoBackButton from "@/components/ui/GoBackButton";
import Heading from "@/components/ui/Heading";
import { Undo2 } from "lucide-react";
import Link from "next/link";

export default function CreateProductPage() {
  return (
    <>
      <Heading>Crear Producto</Heading>
      
      <GoBackButton/>

      <AddProductForm>
        <ProductForm />
      </AddProductForm>
    </>
  )
}
