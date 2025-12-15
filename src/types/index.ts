import { Order, OrderProducts, Product } from "@prisma/client";

export type OrderItem = Pick<Product, 'id' | 'image' | 'name' | 'price'> & {
    quantity: number,
    subtotal: number
}

export type OrderWithProducts = Order & {
    orderProducts: (OrderProducts & {
        product: Product
    })[]
}