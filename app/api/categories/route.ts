import { prisma } from "@/src/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany();
  return new Response(JSON.stringify(categories));
}
