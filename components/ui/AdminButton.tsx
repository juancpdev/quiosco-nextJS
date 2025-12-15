"use client";
import { Shield } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminButton() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/verify-token")
      .then((res) => res.json())
      .then((data) => {
        setIsAdmin(data.valid);
      });
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="flex justify-center items-center mt-5">
      <Link
        href="/admin/orders"
        className="
        group relative inline-flex items-center gap-2 px-6 py-3
        rounded-2xl font-bold
        text-white
        bg-gradient-to-r from-purple-600 to-pink-500
        shadow-xl
        transition-all duration-300
        hover:scale-105 
      "
      >
        <Shield className="w-5 h-5 group-hover:rotate-12 transition-all duration-300" />
        Panel Admin
        
      </Link>
    </div>
  );
}
