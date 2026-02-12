import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const user = await prisma.user.findUnique({ where: { email: body.email } });

  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const valid = await bcrypt.compare(body.password, user.passwordHash);
  if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const token = await signToken({ userId: user.id, role: user.role });

  const response = NextResponse.json({ role: user.role, userId: user.id });
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/'
  });

  return response;
}
