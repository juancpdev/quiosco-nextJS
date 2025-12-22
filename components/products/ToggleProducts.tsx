import { useState } from "react";
import { toast } from "react-toastify";

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
      const response = await fetch(`/api/products/${productId}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !isAvailable })
      });

      if (!response.ok) throw new Error('Error al actualizar');

      setIsAvailable(!isAvailable);
      toast.success(
        !isAvailable 
          ? '✓ Producto disponible' 
          : 'Producto no disponible'
      );
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar disponibilidad');
    } finally {
      setIsLoading(false);
    }
  };


export default function ToggleProducts() {
  return (
    <div className="flex items-center justify-center gap-2">
                        <AvailabilityToggle
                          productId={product.id}
                          initialAvailable={product.available ?? true}
                        />
                        <span className={`text-xs font-medium ${product.available ? 'text-green-600' : 'text-gray-500'}`}>
                          {product.available ? 'Sí' : 'No'}
                        </span>
                      </div>
  )
}
