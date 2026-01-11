"use client";

import { Category } from "@prisma/client";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import * as Icons from "lucide-react";
import { categoryWithProducts } from "@/app/admin/categories/page";
import { deleteCategory } from "@/actions/category/delete-category-actions";

type CategoryTableType = {
  categories: categoryWithProducts;
};

// 🗑️ Delete Button Component
function DeleteButton({
  categoryId,
  categoryName,
}: {
  categoryId: number;
  categoryName: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Mostrar SweetAlert de confirmación
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminará la categoria "${categoryName}". Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setIsDeleting(true);

    try {
       const deleteResult = await deleteCategory(categoryId);
      if (!deleteResult.success) {
        await Swal.fire({
          title: "No se puede eliminar",
          text: deleteResult.error,
          icon: "warning",
          confirmButtonColor: "#f59e0b",
        });
        return;
      }


      // Mostrar alerta de éxito
      await Swal.fire({
        title: "¡Eliminado!",
        text: "La categoría ha sido eliminada correctamente.",
        icon: "success",
        confirmButtonColor: "#10b981",
        timer: 2000,
      });
    } catch (error) {
      console.error("Error:", error);

      // Mostrar alerta de error
      await Swal.fire({
        title: "Error",
        text: "No se pudo eliminar la categoría. Intenta de nuevo.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`
        text-red-500 hover:text-red-800 transition-colors
        ${isDeleting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      aria-label={`Eliminar ${categoryName}`}
    >
      <Trash2 className={isDeleting ? "animate-pulse" : ""} />
    </button>
  );
}

export default function CategoryTable({ categories }: CategoryTableType) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 ">
      <div className="mt-12 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 bg-white p-5 rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-md font-bold text-gray-900 sm:pl-0"
                  >
                    Categoria
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-md font-bold text-gray-900 sm:pl-0"
                  >
                    Icono
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-md font-bold text-gray-900"
                  >
                    Productos
                  </th>

                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4 sm:pr-0 text-right text-md font-bold text-gray-900"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => {
                  const IconComponent = (Icons[
                    category.icon as keyof typeof Icons
                  ] || Icons.Utensils) as Icons.LucideIcon;
                  return (
                    <tr
                      key={category.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {category.name}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        <IconComponent
                          className="w-12 h-12 text-orange-600"
                          strokeWidth={2}
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {category._count.products}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            className="text-indigo-500 hover:text-indigo-800 transition-colors cursor-pointer"
                            href={`/admin/categories/${category.id}/edit`}
                          >
                            <Edit />
                          </Link>
                          <DeleteButton
                            categoryId={category.id}
                            categoryName={category.name}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
