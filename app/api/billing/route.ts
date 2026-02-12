import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

const billingSchema = z.object({
  productId: z.string(),
  customerId: z.string(),
  goldRatePer10gm: z.number().positive(),
  makingChargePercentage: z.number().positive(),
  doubleVerified: z.boolean().refine((v) => v, 'Double verification is mandatory')
});

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, ['THIRD_ADMIN', 'MAIN_ADMIN']);
  if (auth instanceof NextResponse) return auth;

  const parsed = billingSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const ratePerGram = parsed.data.goldRatePer10gm / 10;
  const makingChargeAmount = ratePerGram * Number(product.goldWeight) * (parsed.data.makingChargePercentage / 100);

  const billing = await prisma.billing.create({
    data: {
      ...parsed.data,
      makingChargeAmount,
      totalMakingCharge: makingChargeAmount,
      billingStatus: 'PENDING',
      createdBy: auth.userId
    }
  });

  await logAudit('BILLING_CREATED', auth.userId, { billingId: billing.id });
  return NextResponse.json(billing, { status: 201 });
}
