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
      image: z.string()
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
        .min(1, { message: 'El Nombre del Producto no puede ir vacio'}),
    price: z.string()
        .trim()
        .transform((value) => parseFloat(value)) 
        .refine((value) => value > 0, { message: 'Precio no válido' })
        .or(z.number().min(1, {message: 'La Categoría es Obligatoria' })),
    categoryId: z.string()
        .trim()
        .transform((value) => parseInt(value)) 
        .refine((value) => value > 0, { message: 'La Categoría es Obligatoria' })
        .or(z.number().min(1, {message: 'La Categoría es Obligatoria' })),
    image: z.string().min(1, {message: 'La Imagen es Obligatoria'})
})

export const CategorySchema = z.object({
  name: z.string().min(1, { message: 'El nombre es obligatorio' }),
  icon: z.string().min(1, { message: 'El icono es obligatorio'})
})