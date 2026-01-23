import { Order, OrderProducts, Product, Table, ProductVariant } from "@prisma/client";

export type OrderItem = Pick<Product, "id" | "image" | "name"> & {
  quantity: number;
  subtotal: number;

  // precio FINAL (variante o base)
  price: number;

  // ✅ variantes
  variantId?: number | null;
  variantName?: string | null;

  // ✅ key único para diferenciar coca 250ml vs 500ml
  itemKey: string;
};

export type OrderWithProducts = Order & {
  orderProducts: (OrderProducts & {
    product: Product | null;
  })[];
};

export type TableWithOrders = Table & {
  orders: OrderWithProducts[];
};

export type TableSession = {
  tableNumber: number;
  tableId: number;
  sessionId: string;
  status: string;
  orders: OrderWithProducts[];
  totalAmount: number;
  customerName: string;
  phone: string;
};

// ✅ tipos útiles para UI
export type ProductWithVariants = Product & { variants: ProductVariant[] };
