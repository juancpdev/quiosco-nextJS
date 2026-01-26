"use server";

import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@prisma/client";

export type VentasStats = {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  averageTicket: number;
  revenueByPaymentMethod: {
    efectivo: number;
    tarjeta: number;
  };
  revenueByDeliveryType: {
    local: number;
    delivery: number;
  };
  ordersByDay: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
  topProducts: Array<{
    productName: string;
    productImage: string;
    variantName: string | null;
    quantity: number;
    revenue: number;
  }>;
};

export async function getVentasStats(
  startDate?: Date,
  endDate?: Date
): Promise<VentasStats> {
  try {
    const now = new Date();
    const defaultStartDate = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultEndDate = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const orders = await prisma.order.findMany({
      where: {
        date: {
          gte: defaultStartDate,
          lte: defaultEndDate,
        },
      },
      include: {
        orderProducts: true,
      },
    });

    type OrderWithProducts = Prisma.OrderGetPayload<{
      include: { orderProducts: true };
    }>;
    
    const typedOrders = orders as OrderWithProducts[];

    const totalRevenue = typedOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = typedOrders.length;
    const completedOrders = typedOrders.filter((o) => o.status === "completed").length;
    const pendingOrders = typedOrders.filter((o) => o.status === "pending").length;
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const revenueByPaymentMethod = typedOrders.reduce(
      (acc, order) => {
        if (order.paymentMethod === "efectivo") {
          acc.efectivo += order.total;
        } else {
          acc.tarjeta += order.total;
        }
        return acc;
      },
      { efectivo: 0, tarjeta: 0 }
    );

    const revenueByDeliveryType = typedOrders.reduce(
      (acc, order) => {
        if (order.deliveryType === "local") {
          acc.local += order.total;
        } else {
          acc.delivery += order.total;
        }
        return acc;
      },
      { local: 0, delivery: 0 }
    );

    const ordersByDayMap = new Map<string, { orders: number; revenue: number }>();
    
    typedOrders.forEach((order) => {
      const dateKey = order.date.toISOString().split("T")[0];
      const existing = ordersByDayMap.get(dateKey) || { orders: 0, revenue: 0 };
      ordersByDayMap.set(dateKey, {
        orders: existing.orders + 1,
        revenue: existing.revenue + order.total,
      });
    });

    const ordersByDay = Array.from(ordersByDayMap.entries())
      .map(([date, data]) => ({
        date,
        ...data,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const productMap = new Map<string, { quantity: number; revenue: number; productImage: string }>();
    typedOrders.forEach((order) => {
      order.orderProducts.forEach((op) => {
        const key = op.variantName
          ? `${op.productName} - ${op.variantName}`
          : op.productName;
        const existing = productMap.get(key) || { quantity: 0, revenue: 0, productImage: op.productImage };
        productMap.set(key, {
          quantity: existing.quantity + op.quantity,
          revenue: existing.revenue + op.productPrice * op.quantity,
          productImage: op.productImage
        });
      });
    });
    const topProducts = Array.from(productMap.entries())
      .map(([key, data]) => {
        const parts = key.split(" - ");
        return {
          productName: parts[0],
          productImage: data.productImage,
          variantName: parts.length > 1 ? parts[1] : null,
          quantity: data.quantity,
          revenue: data.revenue
        };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
    return {
      totalRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      averageTicket,
      revenueByPaymentMethod,
      revenueByDeliveryType,
      ordersByDay,
      topProducts
    };
  } catch (error) {
    console.error("Error getting ventas stats:", error);
    throw new Error("Error al obtener estadísticas de ventas");
  }
}
