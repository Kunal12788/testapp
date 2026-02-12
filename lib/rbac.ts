import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export async function requireRole(request: NextRequest, roles: string[]) {
  const token = request.cookies.get('session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const session = await verifyToken(token).catch(() => null);
  if (!session || !roles.includes(session.role)) {
    return NextResponse.json({ error: 'Role violation blocked.' }, { status: 403 });
  }

  return session;
}
