import AddProductForm from "@/components/admin/products/AddProductForm";
import ProductForm from "@/components/admin/products/ProductForm";
import GoBackButton from "@/components/ui/GoBackButton";
import Heading from "@/components/ui/Heading";

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
