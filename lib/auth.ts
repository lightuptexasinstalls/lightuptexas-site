import 'server-only';
import { cookies } from 'next/headers';
import { createHash, timingSafeEqual } from 'crypto';

const token = () => createHash('sha256').update('lut:' + (process.env.ADMIN_PASSWORD || '')).digest('hex');

export async function isAdmin() {
  if (!process.env.ADMIN_PASSWORD) return false;
  const c = (await cookies()).get('lut_admin')?.value || '';
  const t = token();
  return c.length === t.length && timingSafeEqual(Buffer.from(c), Buffer.from(t));
}

export async function login(pw: string) {
  const real = process.env.ADMIN_PASSWORD || '';
  if (!real || pw !== real) return false;
  (await cookies()).set('lut_admin', token(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
  return true;
}
