"use client";

import Link from "next/link";
import Logo from "../ui/Logo";
import Logout from "../ui/Logout";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

type NavigationItem = {
  url: string;
  text: string;
  blank: boolean;
};

const adminNavigation: NavigationItem[] = [
  { url: "/admin/orders", text: "Órdenes", blank: false },
  { url: "/admin/tables", text: "Mesas", blank: false },
  { url: "/admin/categories", text: "Categorías", blank: false },
  { url: "/admin/products", text: "Productos", blank: false },
  { url: "/order/cafe", text: "Ver Quiosco", blank: true },
  { url: "/orders", text: "Ver Órdenes Listas", blank: true },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Cerrar menú móvil al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-menu') && !target.closest('.menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevenir scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleClick = async (e: React.MouseEvent, url: string, blank: boolean) => {
    // Si el link debe abrirse en blank, no hacemos nada
    if (blank) {
      return;
    }

    // Solo para navegación interna refrescamos la sesión
    e.preventDefault();
    await fetch("/api/refresh-session", { method: "POST" });
    router.push(url);
  };

  return (
    <>
      {/* Botón hamburguesa para mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="menu-toggle bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg shadow-lg transition-colors"
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay para mobile */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        suppressHydrationWarning
        className={`
          md:w-72 md:h-screen md:sticky md:top-0
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen 
            ? 'mobile-menu fixed left-0 top-0 h-full w-72 bg-white z-50 shadow-2xl translate-x-0' 
            : 'fixed -translate-x-full md:translate-x-0 md:relative'
          }
        `}
      >
        <div className="h-full flex flex-col bg-white p-5">
          {/* Header con logo para mobile */}
          <div className="md:hidden flex items-center justify-between pb-4 border-b border-gray-200">
            <Logo />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Cerrar menú"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 flex flex-col gap-2 mt-4 md:mt-0 overflow-y-auto">
            {adminNavigation.map((item) => {
              const isActive = pathname.startsWith(item.url);

              return (
                <Link
                  target={item.blank ? "_blank" : undefined}
                  rel={item.blank ? "noopener noreferrer" : undefined}
                  key={item.url}
                  href={item.url}
                  onClick={(e) => handleClick(e, item.url, item.blank)}
                  className={`
                    flex items-center font-bold text-lg gap-2 
                    w-full h-16 rounded-xl p-3 
                    transition-all duration-200
                    ${isActive
                      ? "bg-linear-to-tr from-orange-400 to-orange-500 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-orange-50"
                    }
                  `}
                >
                  {item.text}
                </Link>
              );
            })}

            {/* Logout */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Logout />
            </div>
          </nav>

          {/* Logo para desktop (al fondo) */}
          <div className="hidden md:flex items-center justify-center mt-6 pt-6 border-t border-gray-200">
            <Logo />
          </div>
        </div>
      </aside>
    </>
  );
}