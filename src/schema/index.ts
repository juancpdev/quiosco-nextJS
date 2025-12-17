import { z } from 'zod'

export const OrderSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  address: z.string().optional(),
  deliveryType: z.enum(['local', 'delivery']),
  table: z.number().optional(),
  paymentMethod: z.enum(['efectivo', 'tarjeta']),
  note: z.string().optional(),
  total: z.number(),
  order: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
      subtotal: z.number(),
      image: z.string()
    })
  ),
  paymentInfo: z.any().optional(),
}).superRefine((data, ctx) => {
  // 🔒 Cliente → teléfono obligatorio
  if (data.deliveryType === 'local' && !data.phone) {
    ctx.addIssue({
      path: ['phone'],
      message: 'El teléfono es obligatorio para pedidos en mesa',
      code: z.ZodIssueCode.custom,
    })
  }
})
