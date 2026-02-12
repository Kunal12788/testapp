import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { intakeSchema } from '@/lib/validators';
import { prisma } from '@/lib/prisma';
import { addAuditLog } from '@/lib/audit';

export async function POST(request: NextRequest) {
  const session = await requireRole(request, ['FIRST_ADMIN', 'MAIN_ADMIN']);
  if (session instanceof NextResponse) return session;

  const parsed = intakeSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const exists = await prisma.product.findUnique({ where: { barcodeId: parsed.data.barcodeId } });
  if (exists) return NextResponse.json({ error: 'Duplicate barcode blocked.' }, { status: 409 });

  const totalWeight = parsed.data.goldWeight + parsed.data.otherMetalWeight + parsed.data.stoneWeight + parsed.data.diamondWeight;
  const product = await prisma.product.create({
    data: { ...parsed.data, totalWeight, createdBy: session.id, status: 'IN_ADMIN_STOCK' }
  });

  await addAuditLog('PRODUCT_INTAKE', session.id, { productId: product.id, barcodeId: product.barcodeId });
  return NextResponse.json(product, { status: 201 });
}
