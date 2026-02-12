import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

const allotmentSchema = z.object({
  productId: z.string(),
  customerId: z.string(),
  doubleVerified: z.boolean().refine((v) => v, 'Double verification is mandatory')
});

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, ['SECOND_ADMIN', 'MAIN_ADMIN']);
  if (auth instanceof NextResponse) return auth;

  const parsed = allotmentSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product || product.status !== 'IN_ADMIN_STOCK') {
    return NextResponse.json({ error: 'Product unavailable for allotment' }, { status: 409 });
  }

  const allotment = await prisma.$transaction(async (tx) => {
    const created = await tx.allotment.create({
      data: {
        ...parsed.data,
        allottedBy: auth.userId
      }
    });

    await tx.product.update({
      where: { id: parsed.data.productId },
      data: { status: 'ALLOTTED' }
    });

    return created;
  });

  await logAudit('PRODUCT_ALLOTTED', auth.userId, parsed.data);
  return NextResponse.json(allotment, { status: 201 });
}
