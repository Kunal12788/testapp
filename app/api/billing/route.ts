import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { addAuditLog } from '@/lib/audit';

export async function POST(request: NextRequest) {
  const session = await requireRole(request, ['THIRD_ADMIN', 'MAIN_ADMIN']);
  if (session instanceof NextResponse) return session;
  const body = await request.json();

  if (!body.doubleVerified) return NextResponse.json({ error: 'Missing double verification.' }, { status: 400 });
  const product = await prisma.product.findUnique({ where: { id: body.productId } });
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const ratePerGram = body.goldRatePer10gm / 10;
  const makingChargeAmount = ratePerGram * product.goldWeight * (body.makingChargePercentage / 100);
  const billing = await prisma.billing.create({
    data: {
      productId: body.productId,
      customerId: body.customerId,
      goldRatePer10gm: body.goldRatePer10gm,
      makingChargePercentage: body.makingChargePercentage,
      makingChargeAmount,
      totalMakingCharge: makingChargeAmount,
      doubleVerified: true,
      createdBy: session.id
    }
  });

  await addAuditLog('BILLING_CREATED', session.id, { billingId: billing.id, productId: body.productId });
  return NextResponse.json(billing, { status: 201 });
}
