"use client";

import { useEffect, useState } from "react";

export default function PriceInput({
  defaultValue,
  name = "price",
  label = "Precio base",
}: {
  defaultValue?: string;
  name?: string;
  label?: string;
}) {
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState(defaultValue ?? "");

  // expone handlers vía window (simple y efectivo para tu caso)
  useEffect(() => {
    (window as any).__setMinVariantPrice = (min: number | null) => {
      if (min == null) {
        setDisabled(false);
        return;
      }
      setDisabled(true);
      setValue(String(min)); // ✅ guardamos el min como price
    };

    return () => {
      delete (window as any).__setMinVariantPrice;
    };
  }, []);

  return (
    <div className="space-y-2">
      <label className="text-slate-800 font-semibold" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        className={`block w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
          disabled ? "bg-slate-200 cursor-not-allowed" : "bg-slate-100"
        }`}
        placeholder={disabled ? "Se calcula desde variantes" : "Ej: 1200"}
      />
      {disabled && (
        <p className="text-xs text-gray-500">
          Este precio se define automáticamente como el más barato de las variantes.
        </p>
      )}
    </div>
  );
}
