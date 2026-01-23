// scripts/fill-product-snapshot.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const orderProducts = await prisma.orderProducts.findMany({
    include: { product: true }
  });

  console.log(`Actualizando ${orderProducts.length} registros...`);

  for (const op of orderProducts) {
    if (op.product) {
      await prisma.orderProducts.update({
        where: { id: op.id },
        data: {
          productName: op.product.name,
          productPrice: op.product.price,
          productImage: op.product.image
        }
      });
      console.log(`✓ Actualizado OrderProduct ${op.id}`);
    }
  }

  console.log('¡Completado!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());