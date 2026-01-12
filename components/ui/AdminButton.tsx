"use client";

import { Shield } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminButton() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/verify-token")
      .then((res) => res.json())
      .then((data) => {
        setIsAdmin(data.valid);
      })
      .catch((err) => {
        console.error("Error verificando token:", err);
        setIsAdmin(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // No mostrar nada mientras carga o si no es admin
  if (isLoading || !isAdmin) return null;

  return (
    <Link
      href="/admin/orders"
      className="
        group relative inline-flex items-center justify-center gap-2 
        px-6 py-3 w-full
        rounded-xl font-bold text-sm
        text-white
        bg-gradient-to-r from-purple-600 to-pink-500
        shadow-lg
        transition-all duration-300
        hover:scale-105 hover:shadow-xl
        active:scale-95
      "
    >
      <Shield className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
      <span>Panel Admin</span>
      
      {/* Efecto de brillo */}
      <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    </Link>
  );
}