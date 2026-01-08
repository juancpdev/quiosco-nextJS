import { prisma } from "@/src/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    take: 12,
    where: {
      status: "completed",
    },
    include: {
      orderProducts: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });
  return Response.json(orders)
}