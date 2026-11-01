import { NextResponse } from 'next/server';
import { dbStatus } from '@/lib/leads';

// Shows which services are configured (never shows any keys).
export const dynamic = 'force-dynamic';
export async function GET() {
  const db = await dbStatus();
  return NextResponse.json({
    database: db,
    adminPassword: !!process.env.ADMIN_PASSWORD,
    email: { resendKey: !!process.env.RESEND_API_KEY, alertRecipients: (process.env.LEAD_ALERT_EMAILS || '').split(',').filter((s) => s.trim()).length },
    google: !!process.env.GOOGLE_SERVER_KEY,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
  });
}
