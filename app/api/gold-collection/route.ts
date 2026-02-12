import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { addAuditLog } from '@/lib/audit';

export async function POST(request: NextRequest) {
  const session = await requireRole(request, ['FOURTH_ADMIN', 'MAIN_ADMIN']);
  if (session instanceof NextResponse) return session;
  const body = await request.json();

  const totalValue = body.goldWeightReceived * (body.rateApplied / 10);
  const collection = await prisma.goldCollection.create({
    data: {
      customerId: body.customerId,
      goldWeightReceived: body.goldWeightReceived,
      rateApplied: body.rateApplied,
      totalValue,
      confirmedByFourthAdmin: true
    }
  });

  await addAuditLog('GOLD_COLLECTION_RECORDED', session.id, { collectionId: collection.id, customerId: body.customerId });
  return NextResponse.json(collection, { status: 201 });
}
