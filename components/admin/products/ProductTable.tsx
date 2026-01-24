'use client';

import { deleteProduct } from "@/actions/product/delete-product-actions";
import { toggleProductAvailability } from "@/actions/product/product-availability-actions";
import { productWithCategory } from "@/app/admin/products/page";
import { formatCurrency, getImagePath } from "@/src/utils";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

type ProductTableType = {
  products: productWithCategory;
};

// 🎯 Toggle Component
function AvailabilityToggle({ 
  productId, 
  initialAvailable 
}: { 
  productId: number; 
  initialAvailable: boolean;
}) {
  const [isAvailable, setIsAvailable] = useState(initialAvailable);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    
    try {
      const result = await toggleProductAvailability(productId, !isAvailable);

      if (!result.success) throw new Error(result.error);

      setIsAvailable(!isAvailable);
      toast.success(
        !isAvailable 
          ? 'Producto disponible' 
          : 'Producto no disponible'
      );
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar disponibilidad');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer
        ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
      `}
      aria-label={isAvailable ? 'Desactivar producto' : 'Activar producto'}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
          ${isAvailable ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
}

// 🗑️ Delete Button Component
function DeleteButton({ 
  productId, 
  productName 
}: { 
  productId: number; 
  productName: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Mostrar SweetAlert de confirmación
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el producto "${productName}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    setIsDeleting(true);

    try {
      const deleteResult = await deleteProduct(productId);

      if (!deleteResult.success) {
        throw new Error(deleteResult.message);
      }

      // Mostrar alerta de éxito
      await Swal.fire({
        title: '¡Eliminado!',
        text: 'El producto ha sido eliminado correctamente.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        timer: 2000
      });

    } catch (error) {
      console.error('Error:', error);
      
      // Mostrar alerta de error
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el producto. Intenta de nuevo.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
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
        ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label={`Eliminar ${productName}`}
    >
      <Trash2 className={isDeleting ? 'animate-pulse' : ''} />
    </button>
  );
}

export default function ProductTable({ products }: ProductTableType) {
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
                    Producto
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-md font-bold text-gray-900 sm:pl-0"
                  >
                    Imagen
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-md font-bold text-gray-900"
                  >
                    Precio
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-md font-bold text-gray-900"
                  >
                    Categoría
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-center text-md font-bold text-gray-900"
                  >
                    Variantes
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-center text-md font-bold text-gray-900"
                  >
                    Disponible
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
                {products.map((product) => {
                  const imagePath = getImagePath(product.image);
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {product.name}
                      </td>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        <div className="w-12 h-12 relative">
                          <Image
                            className="rounded-xl object-cover"
                            src={imagePath}
                            fill
                            alt={`Imagen de ${product.name}`}
                          />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                          {product.category.name}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          product.variants.length > 0
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-50 text-gray-600'
                        }`}>
                          {product.variants.length}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <AvailabilityToggle
                            productId={product.id}
                            initialAvailable={product.available ?? true}
                          />
                          <span
                            className={`text-xs font-medium ${
                              product.available
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {product.available ? "Sí" : "No"}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            className="text-indigo-500 hover:text-indigo-800 transition-colors cursor-pointer"
                            href={`/admin/products/${product.id}/edit`}
                          >
                            <Edit />
                          </Link>
                          <DeleteButton
                            productId={product.id}
                            productName={product.name}
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