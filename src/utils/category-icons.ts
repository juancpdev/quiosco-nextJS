// src/data/category-icons.ts
import { 
  // 🍔 COMIDAS
  Pizza,
  Hamburger,
  Sandwich,
  Drumstick,
  Fish,
  Soup,
  Salad,
  Croissant,
  Beef,
  Popcorn,
  
  // ☕ BEBIDAS
  Coffee,
  CupSoda,
  Wine,
  Beer,
  Milk,
  GlassWater, // Mejor que Droplets
  
  // 🍰 POSTRES Y DULCES
  Cake,
  IceCream2 as IceCream, // Helado
  Cookie,
  Candy,
  
  // 🍎 SALUDABLE
  Apple,
  Citrus,
  Cherry,
  Carrot,
  
  // 🍴 GENERAL
  Utensils,
  UtensilsCrossed,
  ChefHat,
  ConciergeBell,

  CircleSlash, // Para "Sin icono"
  
  type LucideIcon
} from "lucide-react"

// Mapa de iconos con tipos seguros
export const iconMap: Record<string, LucideIcon> = {
  // Sin icono
  CircleSlash,
  
  // Comidas
  Pizza,
  Hamburger,
  Sandwich,
  Drumstick,
  Fish,
  Soup,
  Salad,
  Croissant,
  Beef,
  Popcorn,
  
  // Bebidas
  Coffee,
  CupSoda,
  Wine,
  Beer,
  Milk,
  GlassWater,
  
  // Postres
  Cake,
  IceCream,
  Cookie,
  Candy,
  
  // Frutas/Saludable
  Apple,
  Citrus,
  Cherry,
  Carrot,
  
  // General
  Utensils,
  UtensilsCrossed,
  ChefHat,
  ConciergeBell,
}

// Tipo para los iconos
type CategoryIcon = {
  name: string
  label: string
  group: string
}

// Array de iconos organizados por categorías
export const categoryIcons: CategoryIcon[] = [
  // === ⭕ SIN ICONO ===
  { name: "CircleSlash", label: "Sin icono", group: "Sin Icono" },
  
  // === 🍔 COMIDAS ===
  { name: "Pizza", label: "Pizzas", group: "Comidas" },
  { name: "Hamburger", label: "Hamburguesas", group: "Comidas" },
  { name: "Sandwich", label: "Sándwiches", group: "Comidas" },
  { name: "Drumstick", label: "Pollo", group: "Comidas" },
  { name: "Fish", label: "Pescados", group: "Comidas" },
  { name: "Soup", label: "Sopas", group: "Comidas" },
  { name: "Salad", label: "Ensaladas", group: "Comidas" },
  { name: "Croissant", label: "Panadería", group: "Comidas" },
  { name: "Beef", label: "Carnes", group: "Comidas" },
  { name: "Popcorn", label: "Snacks", group: "Comidas" },
  
  // === ☕ BEBIDAS ===
  { name: "Coffee", label: "Café", group: "Bebidas" },
  { name: "CupSoda", label: "Gaseosas", group: "Bebidas" },
  { name: "Beer", label: "Cervezas", group: "Bebidas" },
  { name: "Wine", label: "Vinos", group: "Bebidas" },
  { name: "Milk", label: "Licuados", group: "Bebidas" },
  { name: "GlassWater", label: "Agua", group: "Bebidas" },
  
  // === 🍰 POSTRES ===
  { name: "Cake", label: "Tortas", group: "Postres" },
  { name: "IceCream", label: "Helados", group: "Postres" },
  { name: "Cookie", label: "Galletas", group: "Postres" },
  { name: "Candy", label: "Dulces", group: "Postres" },
  
  // === 🍎 SALUDABLE ===
  { name: "Apple", label: "Frutas", group: "Saludable" },
  { name: "Citrus", label: "Cítricos", group: "Saludable" },
  { name: "Cherry", label: "Berries", group: "Saludable" },
  { name: "Carrot", label: "Vegetales", group: "Saludable" },
  
  // === 🍴 GENERAL ===
  { name: "Utensils", label: "General", group: "General" },
  { name: "UtensilsCrossed", label: "Restaurante", group: "General" },
  { name: "ChefHat", label: "Chef", group: "General" },
  { name: "ConciergeBell", label: "Servicio", group: "General" },
]

// Agrupar iconos por categoría
export const iconsByGroup = categoryIcons.reduce((acc, icon) => {
  if (!acc[icon.group]) {
    acc[icon.group] = []
  }
  acc[icon.group].push(icon)
  return acc
}, {} as Record<string, CategoryIcon[]>)