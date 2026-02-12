import { SignJWT, jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { Role } from './types';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');

export async function signToken(payload: { userId: string; role: Role }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as { userId: string; role: Role };
}

export function getTokenFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  return request.cookies.get('auth_token')?.value;
}
