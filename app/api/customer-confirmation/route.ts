import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

const confirmationSchema = z.object({
  productId: z.string(),
  customerId: z.string(),
  enteredGoldWeight: z.number().positive(),
  enteredPurity: z.string(),
  enteredStoneWeight: z.number().nonnegative()
});

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, ['CUSTOMER']);
  if (auth instanceof NextResponse) return auth;

  const parsed = confirmationSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const matched =
    Number(product.goldWeight) === parsed.data.enteredGoldWeight &&
    product.purity === parsed.data.enteredPurity &&
    Number(product.stoneWeight) === parsed.data.enteredStoneWeight;

  const confirmation = await prisma.customerConfirmation.create({
    data: {
      ...parsed.data,
      matched
    }
  });

  await logAudit('CUSTOMER_CONFIRMATION', auth.userId, {
    confirmationId: confirmation.id,
    matched,
    productId: parsed.data.productId
  });

  return NextResponse.json({ confirmation, mismatchFlag: !matched }, { status: 201 });
}
