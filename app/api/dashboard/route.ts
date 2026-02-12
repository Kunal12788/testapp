import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await requireRole(request, ['MAIN_ADMIN']);
  if (session instanceof NextResponse) return session;

  const [adminStock, customerStock, pendingBills, completedProducts, auditLogs] = await Promise.all([
    prisma.product.aggregate({ where: { status: 'IN_ADMIN_STOCK' }, _sum: { goldWeight: true } }),
    prisma.customer.aggregate({ _sum: { totalGoldInventoryWeight: true } }),
    prisma.billing.count({ where: { billingStatus: 'PENDING' } }),
    prisma.product.count({ where: { status: 'COMPLETED' } }),
    prisma.auditLog.findMany({ take: 50, orderBy: { timestamp: 'desc' } })
  ]);

  return NextResponse.json({
    adminStock: adminStock._sum.goldWeight || 0,
    customerStock: customerStock._sum.totalGoldInventoryWeight || 0,
    pendingBills,
    completedProducts,
    auditLogs
  });
}
