"use client";

import Link from "next/link";
import Logo from "../ui/Logo";
import Logout from "../ui/Logout";
import { usePathname, useRouter } from "next/navigation";

type NavigationItem = {
  url: string;
  text: string;
  blank: boolean;
};

const adminNavigation: NavigationItem[] = [
  { url: "/admin/orders", text: "Órdenes", blank: false },
  { url: "/admin/tables", text: "Mesas", blank: false },
  { url: "/admin/products", text: "Productos", blank: false },
  { url: "/order/cafe", text: "Ver Quiosco", blank: true },
  { url: "/orders", text: "Ver Órdenes Listas", blank: true },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = async (e: React.MouseEvent, url: string, blank: boolean) => {
    // Si el link debe abrirse en blank, no hacemos nada
    // dejamos que el comportamiento por defecto del Link funcione
    if (blank) {
      return;
    }

    // Solo para navegación interna refrescamos la sesión
    e.preventDefault();
    await fetch("/api/refresh-session", { method: "POST" });
    router.push(url);
  };

  return (
    <div className="xl:w-72 md:h-screen xl:bg-white p-3 xl:p-5 relative">
      <nav className="flex flex-col gap-2 mt-2">
        {adminNavigation.map((item) => {
          const isActive = pathname.startsWith(item.url);

          return (
            <Link
              target={item.blank ? "_blank" : undefined}
              rel={item.blank ? "noopener noreferrer" : undefined}
              key={item.url}
              href={item.url}
              onClick={(e) => handleClick(e, item.url, item.blank)}
              className={` ${
                isActive
                  ? "bg-gradient-to-tl from-orange-200 to-orange-400 hover:bg-orange-400 xl:cursor-default"
                  : "xl:bg-white"
              } flex items-center font-bold text-lg gap-2 xl:w-full xl:h-16 rounded-xl p-3 last-of-type:border-none hover:bg-orange-50 transition-all`}
            >
              {item.text}
            </Link>
          );
        })}

        {/* Logout abajo, mismo estilo visual */}
        <div className="mt-5">
          <Logout />
        </div>
      </nav>
      <div className="mt-24 flex items-center justify-center w-full  md:absolute md:bottom-0 md:left-0 md:mb-5 md:order-1">
        <Logo />
      </div>
    </div>
  );
}