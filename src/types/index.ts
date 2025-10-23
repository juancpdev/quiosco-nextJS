import { Product } from "@prisma/client";

export type OrderItem = Pick<Product, 'id' | 'image' | 'name' | 'price'> & {
    quantity: number,
    subtotal: number
}
