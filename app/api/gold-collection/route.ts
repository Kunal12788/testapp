import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

const collectionSchema = z.object({
  customerId: z.string(),
  goldWeightReceived: z.number().positive(),
  rateApplied: z.number().positive(),
  confirmedByFourthAdmin: z.boolean().refine((v) => v)
});

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, ['FOURTH_ADMIN', 'MAIN_ADMIN']);
  if (auth instanceof NextResponse) return auth;

  const parsed = collectionSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const totalValue = parsed.data.goldWeightReceived * parsed.data.rateApplied;
  const row = await prisma.goldCollection.create({ data: { ...parsed.data, totalValue } });

  await logAudit('GOLD_COLLECTED', auth.userId, { collectionId: row.id });
  return NextResponse.json(row, { status: 201 });
}
