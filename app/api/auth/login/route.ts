import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/auth';

const routeByRole: Record<string, string> = {
  FIRST_ADMIN: '/first-admin',
  SECOND_ADMIN: '/second-admin',
  THIRD_ADMIN: '/third-admin',
  FOURTH_ADMIN: '/fourth-admin',
  MAIN_ADMIN: '/main-admin',
  CUSTOMER: '/customer'
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const ok = await comparePassword(body.password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const token = await signToken({ id: user.id, role: user.role, email: user.email });
  const response = NextResponse.json({ route: routeByRole[user.role] });
  response.cookies.set('session', token, { httpOnly: true, sameSite: 'strict', secure: true, path: '/' });
  return response;
}
