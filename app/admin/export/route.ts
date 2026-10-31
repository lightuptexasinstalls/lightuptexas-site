import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { listLeads } from '@/lib/leads';

// CSV for importing into an email marketing tool (Mailchimp, Klaviyo, etc).
export async function GET() {
  if (!(await isAdmin())) return new NextResponse('Unauthorized', { status: 401 });
  const cols = ['created_at', 'stage', 'status', 'first_name', 'phone', 'email', 'consent', 'zip', 'in_area', 'address', 'roofline_ft', 'coverage', 'home_size', 'stories', 'owner', 'timing', 'hoa', 'price_low', 'price_high', 'callback', 'tags', 'notes', 'utm_source', 'utm_campaign'] as const;
  const q = (v: unknown) => { const s = Array.isArray(v) ? v.join('; ') : String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const rows = (await listLeads()).map((l) => cols.map((c) => q(c === 'utm_source' || c === 'utm_campaign' ? l.utm[c] : (l as Record<string, unknown>)[c])).join(','));
  return new NextResponse([cols.join(','), ...rows].join('\n'), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"` },
  });
}
