import { z } from "zod";

export const OrderSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(5),
  address: z.string().optional(),
  deliveryType: z.enum(["local", "delivery"]),
  table: z.number().optional(),
  paymentMethod: z.enum(["efectivo", "tarjeta"]),
  note: z.string().optional(),
  total: z.number().min(1),
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
});
