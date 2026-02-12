import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  const auth = await requireRole(request, ['MAIN_ADMIN']);
  if (auth instanceof NextResponse) return auth;

  const logs = await prisma.auditLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: 200
  });

  return NextResponse.json(logs);
}
