import CategoryForm from "@/components/admin/categories/CategoryForm";
import AddCategoryForm from "@/components/admin/categories/AddCategoryForm";
import GoBackButton from "@/components/ui/GoBackButton";
import Heading from "@/components/ui/Heading";

export default function CreateCategoryPage() {
  return (
    <>
      <Heading>Crear Categoría</Heading>
      
      <GoBackButton/>

      <AddCategoryForm>
        <CategoryForm />
      </AddCategoryForm>
    </>
  )
}
