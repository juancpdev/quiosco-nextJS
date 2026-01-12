// src/data/category-icons.ts
import { 
  // 🍔 COMIDAS
  Pizza,
  Beef,
  Ham,
  Drumstick,
  Fish,
  Sandwich,
  Soup,
  Salad,
  Croissant,
  EggFried,
  Popcorn,
  
  // ☕ BEBIDAS
  Coffee,
  CupSoda,
  Beer,
  Wine,
  Martini,
  Milk,
  GlassWater,
  
  // 🍰 POSTRES
  Cake,
  CakeSlice,
  Dessert,
  Cookie,
  Donut,
  IceCreamBowl,
  IceCreamCone,
  Popsicle,
  Candy,
  
  // 🍎 SALUDABLE Y FRUTAS
  Apple,
  Banana,
  Cherry,
  Citrus,
  Carrot,
  Vegan,
  
  // 🍴 GENERAL
  Utensils,
  UtensilsCrossed,
  ChefHat,
  ConciergeBell,
  CircleSlash,
  
  type LucideIcon
} from "lucide-react"

// Mapa de iconos con tipos seguros
export const iconMap: Record<string, LucideIcon> = {
  // Sin icono
  CircleSlash,
  
  // Comidas
  Pizza,
  Beef,
  Ham,
  Drumstick,
  Fish,
  Sandwich,
  Soup,
  Salad,
  Croissant,
  EggFried,
  Popcorn,
  
  // Bebidas
  Coffee,
  CupSoda,
  Beer,
  Wine,
  Martini,
  Milk,
  GlassWater,
  
  // Postres
  Cake,
  CakeSlice,
  Dessert,
  Cookie,
  Donut,
  IceCreamBowl,
  IceCreamCone,
  Popsicle,
  Candy,
  
  // Saludable/Frutas
  Apple,
  Banana,
  Cherry,
  Citrus,
  Carrot,
  Vegan,
  
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
  { name: "Beef", label: "Hamburguesas", group: "Comidas" },
  { name: "Sandwich", label: "Sándwiches", group: "Comidas" },
  { name: "Ham", label: "Jamón", group: "Comidas" },
  { name: "Drumstick", label: "Pollo", group: "Comidas" },
  { name: "Fish", label: "Pescados", group: "Comidas" },
  { name: "Soup", label: "Sopas", group: "Comidas" },
  { name: "Salad", label: "Ensaladas", group: "Comidas" },
  { name: "Croissant", label: "Panadería", group: "Comidas" },
  { name: "EggFried", label: "Desayunos", group: "Comidas" },
  { name: "Popcorn", label: "Snacks", group: "Comidas" },
  
  // === ☕ BEBIDAS ===
  { name: "Coffee", label: "Café", group: "Bebidas" },
  { name: "CupSoda", label: "Gaseosas", group: "Bebidas" },
  { name: "Beer", label: "Cervezas", group: "Bebidas" },
  { name: "Wine", label: "Vinos", group: "Bebidas" },
  { name: "Martini", label: "Cócteles", group: "Bebidas" },
  { name: "Milk", label: "Licuados", group: "Bebidas" },
  { name: "GlassWater", label: "Agua", group: "Bebidas" },
  
  // === 🍰 POSTRES ===
  { name: "Cake", label: "Tortas", group: "Postres" },
  { name: "CakeSlice", label: "Porciones", group: "Postres" },
  { name: "Dessert", label: "Postres", group: "Postres" },
  { name: "Donut", label: "Donas", group: "Postres" },
  { name: "Cookie", label: "Galletas", group: "Postres" },
  { name: "IceCreamBowl", label: "Helados", group: "Postres" },
  { name: "IceCreamCone", label: "Conos", group: "Postres" },
  { name: "Popsicle", label: "Paletas", group: "Postres" },
  { name: "Candy", label: "Dulces", group: "Postres" },
  
  // === 🍎 SALUDABLE ===
  { name: "Apple", label: "Manzanas", group: "Saludable" },
  { name: "Banana", label: "Bananas", group: "Saludable" },
  { name: "Cherry", label: "Cerezas", group: "Saludable" },
  { name: "Citrus", label: "Cítricos", group: "Saludable" },
  { name: "Carrot", label: "Vegetales", group: "Saludable" },
  { name: "Vegan", label: "Vegano", group: "Saludable" },
  
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