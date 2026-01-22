"use client";

import { useState, useMemo, useRef } from "react";
import { X, Plus, Package, Edit2 } from "lucide-react";
import type { ProductVariant } from "@prisma/client";
import { toast } from "react-toastify";

type VariantDraft = {
  id?: number;
  name: string;
  price: number;
};

type VariantInputProps = {
  initialVariants?: ProductVariant[];
  initialPrice?: number;
};

export default function VariantInput({ initialVariants = [], initialPrice }: VariantInputProps) {
  const [hasVariants, setHasVariants] = useState((initialVariants?.length ?? 0) > 0);
  const [variantsBackup, setVariantsBackup] = useState<VariantDraft[]>(
    initialVariants.map((v) => ({ id: v.id, name: v.name, price: v.price }))
  );
  const [variants, setVariants] = useState<VariantDraft[]>(
    initialVariants.map((v) => ({ id: v.id, name: v.name, price: v.price }))
  );
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const nameInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);

  // Ordenar variantes por precio de menor a mayor
  const sortedVariants = useMemo(() => {
    return [...variants].sort((a, b) => Number(a.price) - Number(b.price));
  }, [variants]);

  const minPrice = useMemo(() => {
    if (!hasVariants || variants.length === 0) return null;
    return Math.min(...variants.map((v) => Number(v.price)));
  }, [hasVariants, variants]);

  const handleAddVariant = () => {
    const name = newName.trim();
    const price = parseFloat(newPrice);

    if (!name) {
      toast.error("Ingresá un nombre para la variante");
      nameInputRef.current?.focus();
      return;
    }
    if (!price || price <= 0) {
      toast.error("Ingresá un precio válido");
      priceInputRef.current?.focus();
      return;
    }

    if (editingIndex !== null) {
      setVariants((prev) => {
        const updated = [...prev];
        updated[editingIndex] = { ...updated[editingIndex], name, price };
        return updated;
      });
      setEditingIndex(null);
      toast.success("Variante actualizada");
    } else {
      setVariants((prev) => [...prev, { name, price }]);
      toast.success("Variante agregada");
    }
    
    setNewName("");
    setNewPrice("");
    
    if (editingIndex !== null) {
      setVariantsBackup((prev) => {
        const updated = [...prev];
        updated[editingIndex] = { ...updated[editingIndex], name, price };
        return updated;
      });
    } else {
      setVariantsBackup((prev) => [...prev, { name, price }]);
    }
    
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);
  };

  const handleRemove = (index: number) => {
    const variantToRemove = sortedVariants[index];
    setVariants((prev) => prev.filter((v) => 
      !(v.name === variantToRemove.name && v.price === variantToRemove.price)
    ));
    setVariantsBackup((prev) => prev.filter((v) => 
      !(v.name === variantToRemove.name && v.price === variantToRemove.price)
    ));
    if (editingIndex === index) {
      setEditingIndex(null);
      setNewName("");
      setNewPrice("");
    }
    toast.success("Variante eliminada");
  };

  const handleEdit = (index: number) => {
    const variant = sortedVariants[index];
    setNewName(variant.name);
    setNewPrice(String(variant.price));
    setEditingIndex(index);
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 0);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewName("");
    setNewPrice("");
  };

  const handleToggle = () => {
    const newState = !hasVariants;
    setHasVariants(newState);
    
    if (newState) {
      if (variantsBackup.length > 0) {
        setVariants(variantsBackup);
      }
    } else {
      setVariantsBackup(variants);
      setNewName("");
      setNewPrice("");
      setEditingIndex(null);
    }
  };

  const variantsJson = JSON.stringify(variants);

  return (
    <div className="space-y-4 p-5 bg-slate-50 rounded-xl border-2 border-slate-200 relative">
      {/* Header con Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Package size={20} className="text-orange-500" />
            Precio y Variantes
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            ¿Este producto tiene diferentes tamaños o presentaciones?
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className={`
            relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 cursor-pointer
            ${hasVariants ? "bg-orange-500" : "bg-gray-300"}
          `}
          aria-label="Toggle variantes"
        >
          <span
            className={`
              inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 shadow-md
              ${hasVariants ? "translate-x-7" : "translate-x-1"}
            `}
          />
        </button>
      </div>

      <input type="hidden" name="hasVariants" value={hasVariants ? "true" : "false"} />
      <input type="hidden" name="variants" value={variantsJson} />

      {/* Precio Simple */}
      {!hasVariants && (
        <div className="space-y-2">
          <label className="text-slate-800 font-semibold" htmlFor="price">
            Precio del producto
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="Ej: 1500"
            defaultValue={initialPrice ? String(initialPrice) : undefined}
            className="block w-full p-3 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="text-xs text-slate-500">
            Precio único para este producto
          </p>
        </div>
      )}

      {/* Variantes */}
      {hasVariants && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-slate-800 font-semibold">
              Variantes / Tamaños
            </label>
            {minPrice !== null && (
              <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                Precio base: ${minPrice.toFixed(2)}
              </span>
            )}
          </div>

          <input 
            type="hidden" 
            name="price" 
            value={minPrice ?? 0} 
          />

          {/* Lista de variantes */}
          {sortedVariants.length > 0 && (
            <div className="space-y-2">
              {sortedVariants.map((variant, index) => (
                <div
                  key={variant.id ?? `${variant.name}-${variant.price}`}
                  className={`flex items-center gap-3 p-3 bg-white rounded-lg border transition-all ${
                    editingIndex === index
                      ? "border-orange-500 border-2 shadow-md"
                      : "border-slate-300 hover:border-orange-300"
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{variant.name}</p>
                    <p className="text-sm text-slate-600">
                      ${Number(variant.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(index)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      aria-label="Editar variante"
                      title="Editar variante"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      aria-label="Eliminar variante"
                      title="Eliminar variante"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Agregar/Editar variante - Compacto en una fila */}
          <div className={`p-4 bg-white rounded-lg border-2 ${
            editingIndex !== null 
              ? "border-orange-400 border-solid bg-orange-50/30" 
              : "border-dashed border-slate-300"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-700">
                {editingIndex !== null ? "Editando variante" : "Agregar nueva variante"}
              </p>
              {editingIndex !== null && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-slate-500 hover:text-slate-700 underline cursor-pointer"
                >
                  Cancelar
                </button>
              )}
            </div>
            
            {/* Inputs y botón en una sola fila */}
            <div className="flex gap-2">
              <input
                ref={nameInputRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre (ej: 500ml)"
                className="flex-1 p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    priceInputRef.current?.focus();
                  }
                }}
                tabIndex={1}
              />
              <input
                ref={priceInputRef}
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Precio"
                step="0.01"
                min="0"
                className="w-28 p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddVariant();
                  }
                }}
                tabIndex={2}
              />
              <button
                type="button"
                onClick={handleAddVariant}
                className="flex items-center justify-center gap-1.5 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors cursor-pointer shadow-sm hover:shadow-md whitespace-nowrap text-sm"
                tabIndex={3}
              >
                {editingIndex !== null ? (
                  <>
                    <Edit2 size={16} />
                    Guardar
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Agregar
                  </>
                )}
              </button>
            </div>
          </div>

          {sortedVariants.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Package size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">
                Todavía no agregaste ninguna variante
              </p>
              <p className="text-xs mt-1">
                Agregá al menos una para continuar
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}