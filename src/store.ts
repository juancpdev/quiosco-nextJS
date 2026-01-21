import { create } from "zustand";
import { OrderItem } from "./types";
import { Product, ProductVariant } from "@prisma/client";

const makeItemKey = (productId: number, variantId?: number | null) =>
  `${productId}:${variantId ?? "base"}`;

interface Store {
  order: OrderItem[];

  addToOrder: (product: Product, variant?: ProductVariant | null) => void;

  increaseQuantity: (itemKey: string) => void;
  decreaseQuantity: (itemKey: string) => void;
  removeItem: (itemKey: string) => void;

  clearOrder: () => void;

  verifiedPhone: string;
  isPhoneVerified: boolean;
  setVerifiedPhone: (phone: string) => void;
  setIsPhoneVerified: (verified: boolean) => void;
  clearVerifiedPhone: () => void;
}

export const useStore = create<Store>((set, get) => ({
  order: [],

  addToOrder: (product, variant) => {
    const itemKey = makeItemKey(product.id, variant?.id);

    const price = variant?.price ?? product.price;

    const existing = get().order.find((i) => i.itemKey === itemKey);

    let order: OrderItem[] = [];

    if (existing) {
      order = get().order.map((i) =>
        i.itemKey === itemKey
          ? {
              ...i,
              quantity: i.quantity < 5 ? i.quantity + 1 : i.quantity,
              subtotal: i.quantity < 5 ? (i.quantity + 1) * i.price : i.subtotal,
            }
          : i
      );
    } else {
      order = [
        ...get().order,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          price,
          quantity: 1,
          subtotal: price,
          variantId: variant?.id ?? null,
          variantName: variant?.name ?? null,
          itemKey,
        },
      ];
    }

    set({ order });
  },

  increaseQuantity: (itemKey) => {
    set((state) => ({
      order: state.order.map((item) =>
        item.itemKey === itemKey
          ? {
              ...item,
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * item.price,
            }
          : item
      ),
    }));
  },

  decreaseQuantity: (itemKey) => {
    set((state) => ({
      order: state.order.map((item) =>
        item.itemKey === itemKey
          ? {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : item.quantity,
              subtotal: item.quantity > 1 ? (item.quantity - 1) * item.price : item.subtotal,
            }
          : item
      ),
    }));
  },

  removeItem: (itemKey) => {
    set((state) => ({
      order: state.order.filter((item) => item.itemKey !== itemKey),
    }));
  },

  clearOrder: () => set({ order: [] }),

  verifiedPhone: "",
  isPhoneVerified: false,
  setVerifiedPhone: (phone) => set({ verifiedPhone: phone }),
  setIsPhoneVerified: (verified) => set({ isPhoneVerified: verified }),
  clearVerifiedPhone: () => set({ verifiedPhone: "", isPhoneVerified: false }),
}));
