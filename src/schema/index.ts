import { z } from 'zod'

export const OrderSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  phone: z.string().optional(),
  address: z.string().optional(),
  deliveryType: z.enum(['local', 'delivery']),
  table: z.number().optional(),
  paymentMethod: z.enum(['efectivo', 'tarjeta']),
  note: z.string().optional(),
  total: z.number().positive('El total debe ser mayor a 0'),
  order: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
      subtotal: z.number(),
      image: z.string(),
      variantId: z.number().optional().nullable(),
      variantName: z.string().optional().nullable()
    })
  ).min(1, 'Debe haber al menos un producto'),
  paymentInfo: z.any().optional(),
  isAdminOrder: z.boolean().optional().default(false),
}).superRefine((data, ctx) => {
  if (!data.isAdminOrder) {
    // Para pedidos en mesa (local)
    if (data.deliveryType === 'local' && !data.phone) {
      ctx.addIssue({
        path: ['phone'],
        message: 'El teléfono es obligatorio para pedidos en mesa. Por favor, verifica tu número.',
        code: 'custom',
      })
    }
    
    // Para pedidos a domicilio (delivery)
    if (data.deliveryType === 'delivery') {
      if (!data.phone) {
        ctx.addIssue({
          path: ['phone'],
          message: 'El teléfono es obligatorio para pedidos a domicilio',
          code: 'custom',
        })
      }
      if (!data.address) {
        ctx.addIssue({
          path: ['address'],
          message: 'La dirección es obligatoria para pedidos a domicilio',
          code: 'custom',
        })
      }
    }
  }
  
  // Validar que si es mesa, tenga número de mesa
  if (data.deliveryType === 'local' && !data.table) {
    ctx.addIssue({
      path: ['table'],
      message: 'Debes seleccionar una mesa',
      code: 'custom',
    })
  }
})

// Type inference para TypeScript
export type OrderType = z.infer<typeof OrderSchema>

export const SearchSchema = z.object({
  search : z.string()
              .trim()
              .min(1, {message: 'El campo no puede ir vacio'})
})

export const ProductSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "El nombre del producto es obligatorio" }),

  price: z
    .union([z.string(), z.number()])
    .transform((v) => {
      if (v === undefined || v === "" || v === null) return 0
      return Number(v)
    })
    .refine((v) => !isNaN(v) && v >= 0, { 
      message: "Precio inválido" 
    }),

  categoryId: z
    .union([z.string(), z.number()])
    .transform((value) => Number(value))
    .refine((value) => value > 0, { 
      message: "La categoría es obligatoria" 
    }),

  image: z.string()
    .min(1, { message: "La imagen es obligatoria" }),

  hasVariants: z
    .union([z.string(), z.boolean()])
    .transform((v) => v === true || v === "true")
    .default(false),

  variants: z
    .string()
    .optional()
    .default("[]")
    .transform((v) => {
      if (!v || v === "[]") return []
      try {
        const parsed = JSON.parse(v)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    })
}).superRefine((data, ctx) => {
  const hasVariants = data.hasVariants
  const variants = data.variants as Array<{ name?: string; price?: number }>
  const price = Number(data.price)

  // Si tiene variantes activado, debe tener al menos 1
  if (hasVariants && variants.length === 0) {
    ctx.addIssue({
      path: ["variants"],
      code: "custom",
      message: "Agregá al menos 1 variante o desactivá el toggle de variantes",
    })
  }

  // Si NO tiene variantes, debe tener un precio > 0
  if (!hasVariants && (!price || price <= 0)) {
    ctx.addIssue({
      path: ["price"],
      code: "custom",
      message: "Ingresá un precio válido",
    })
  }
})



export const CategorySchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
  icon: z.string().min(1, { message: 'El icono es obligatorio'})
})