import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { confirmationSchema } from '@/lib/validators';
import { prisma } from '@/lib/prisma';
import { addAuditLog } from '@/lib/audit';

const nearlyEqual = (a: number, b: number, epsilon = 0.001) => Math.abs(a - b) <= epsilon;

export async function POST(request: NextRequest) {
  const session = await requireRole(request, ['CUSTOMER', 'MAIN_ADMIN']);
  if (session instanceof NextResponse) return session;

  const parsed = confirmationSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const matched = nearlyEqual(parsed.data.enteredGoldWeight, product.goldWeight)
    && parsed.data.enteredPurity === product.purity
    && nearlyEqual(parsed.data.enteredStoneWeight, product.stoneWeight);

  const result = await prisma.$transaction(async (tx) => {
    const confirmation = await tx.customerConfirmation.create({ data: { ...parsed.data, matched } });
    if (matched) {
      await tx.customer.update({ where: { id: parsed.data.customerId }, data: { totalGoldInventoryWeight: { increment: product.goldWeight } } });
    }
    return confirmation;
  });

  await addAuditLog('CUSTOMER_CONFIRMATION', session.id, { ...parsed.data, matched });
  return NextResponse.json(result, { status: 201 });
}
