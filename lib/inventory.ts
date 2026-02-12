import { prisma } from './prisma';

export async function getInventorySummary() {
  const adminStock = await prisma.product.aggregate({
    where: { status: 'IN_ADMIN_STOCK' },
    _sum: { goldWeight: true }
  });

  const customerStock = await prisma.customerConfirmation.aggregate({
    where: { matched: true },
    _sum: { enteredGoldWeight: true }
  });

  return {
    adminStockGoldWeight: adminStock._sum.goldWeight ?? 0,
    customerStockGoldWeight: customerStock._sum.enteredGoldWeight ?? 0
  };
}
