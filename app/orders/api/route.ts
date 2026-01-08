import { prisma } from "@/src/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
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