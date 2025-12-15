'use client';

export default function Logout() {
  return (
    <button
      onClick={() =>
        fetch("/api/logout", { method: "POST" }).then(() => {
          window.location.href = "/login";
        })
      }
      className="text-red-500 cursor-pointer font-bold text-lg w-full p-3 hover:bg-red-100 rounded-xl transition"
    >
      Cerrar sesión
    </button>
  );
}
