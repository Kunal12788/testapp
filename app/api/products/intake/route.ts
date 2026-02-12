import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

const intakeSchema = z.object({
  barcodeId: z.string().min(3),
  jewelleryType: z.string().min(1),
  purity: z.string().min(1),
  goldWeight: z.number().positive(),
  otherMetalWeight: z.number().nonnegative(),
  stoneWeight: z.number().nonnegative(),
  diamondWeight: z.number().nonnegative(),
  imageUrl: z.string().url().optional()
});

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, ['FIRST_ADMIN', 'MAIN_ADMIN']);
  if (auth instanceof NextResponse) return auth;

  const parsed = intakeSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const exists = await prisma.product.findUnique({ where: { barcodeId: parsed.data.barcodeId } });
  if (exists) return NextResponse.json({ error: 'Duplicate barcode blocked' }, { status: 409 });

  const totalWeight =
    parsed.data.goldWeight + parsed.data.otherMetalWeight + parsed.data.stoneWeight + parsed.data.diamondWeight;

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      totalWeight,
      createdBy: auth.userId,
      status: 'IN_ADMIN_STOCK'
    }
  });

  await logAudit('PRODUCT_INTAKE', auth.userId, { productId: product.id, barcodeId: product.barcodeId });
  return NextResponse.json(product, { status: 201 });
}
