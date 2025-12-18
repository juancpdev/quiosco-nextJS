import { Order, OrderProducts, Product, Table } from "@prisma/client";

export type OrderItem = Pick<Product, 'id' | 'image' | 'name' | 'price'> & {
    quantity: number,
    subtotal: number
}

export type OrderWithProducts = Order & {
    orderProducts: (OrderProducts & {
        product: Product
    })[]
}

// ✨ NUEVO: Tipo para mesas con órdenes
export type TableWithOrders = Table & {
    orders: OrderWithProducts[]
}

// ✨ NUEVO: Tipo para sesión de mesa (órdenes agrupadas)
export type TableSession = {
    tableNumber: number
    tableId: number
    sessionId: string
    status: string
    orders: OrderWithProducts[]
    totalAmount: number
    customerName: string
    phone: string
}
