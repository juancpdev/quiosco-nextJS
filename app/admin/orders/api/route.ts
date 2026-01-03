import { prisma } from "@/src/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    where: {
      status: "pending",
    },
    include: {
      orderProducts: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
  return Response.json(orders)
}