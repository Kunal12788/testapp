import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { getInventorySummary } from '@/lib/inventory';

export async function GET(request: NextRequest) {
  const auth = await requireRole(request, ['MAIN_ADMIN', 'FIRST_ADMIN', 'SECOND_ADMIN', 'THIRD_ADMIN', 'FOURTH_ADMIN']);
  if (auth instanceof NextResponse) return auth;

  const summary = await getInventorySummary();
  return NextResponse.json(summary);
}
