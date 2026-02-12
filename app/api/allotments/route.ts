import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { allotmentSchema } from '@/lib/validators';
import { prisma } from '@/lib/prisma';
import { addAuditLog } from '@/lib/audit';

export async function POST(request: NextRequest) {
  const session = await requireRole(request, ['SECOND_ADMIN', 'MAIN_ADMIN']);
  if (session instanceof NextResponse) return session;

  const parsed = allotmentSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product || product.status !== 'IN_ADMIN_STOCK') return NextResponse.json({ error: 'Product unavailable for allotment.' }, { status: 409 });

  const allotment = await prisma.$transaction(async (tx) => {
    const created = await tx.allotment.create({ data: { ...parsed.data, allottedBy: session.id } });
    await tx.product.update({ where: { id: parsed.data.productId }, data: { status: 'ALLOTTED' } });
    return created;
  });

  await addAuditLog('ALLOTMENT_CREATED', session.id, parsed.data);
  return NextResponse.json(allotment, { status: 201 });
}
