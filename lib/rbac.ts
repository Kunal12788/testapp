import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from './auth';
import type { Role } from './types';

export async function requireRole(request: NextRequest, roles: Role[]) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!roles.includes(decoded.role)) {
      return NextResponse.json({ error: 'Role violation blocked' }, { status: 403 });
    }

    return decoded;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
