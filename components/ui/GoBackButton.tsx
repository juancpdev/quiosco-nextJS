'use client'
import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function GoBackButton() {
    const router = useRouter()
  return (
    <button
      className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 cursor-pointer rounded-lg font-semibold flex items-center gap-2 transition-all"
      onClick={() => router.back()}
    >
      <Undo2 size={20} />
      Volver
    </button>
  );
}
