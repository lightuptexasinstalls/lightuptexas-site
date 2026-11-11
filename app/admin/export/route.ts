import { NextResponse, type NextRequest } from 'next/server';
import { LEGACY_STATUS } from '@/config/site';
import { isAdmin } from '@/lib/auth';
import { listLeads } from '@/lib/leads';

// CSV for importing into an email marketing tool (Mailchimp, Klaviyo, etc).
export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return new NextResponse('Unauthorized', { status: 401 });
  const cols = ['created_at', 'stage', 'status', 'first_name', 'phone', 'email', 'consent', 'zip', 'in_area', 'address', 'roofline_ft', 'coverage', 'home_size', 'stories', 'owner', 'timing', 'hoa', 'price_low', 'price_high', 'callback', 'tags', 'notes', 'utm_source', 'utm_campaign', 'utm_term', 'utm_content'] as const;
  const q = (v: unknown) => { const s = Array.isArray(v) ? v.join('; ') : String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const day = (iso: string) => new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
  const ok = (v: string | null) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : '');
  const from = ok(req.nextUrl.searchParams.get('from'));
  const to = ok(req.nextUrl.searchParams.get('to'));
  const tag = req.nextUrl.searchParams.get('tag') || '';
  const list = (await listLeads())
    .filter((l) => { const d = day(l.created_at); return (!from || d >= from) && (!to || d <= to) && (!tag || l.tags.includes(tag)); })
    .map((l) => ({ ...l, status: LEGACY_STATUS[l.status] ?? l.status }));
  const rows = list.map((l) => cols.map((c) => q(c.startsWith('utm_') ? l.utm[c] : (l as Record<string, unknown>)[c])).join(','));
  return new NextResponse([cols.join(','), ...rows].join('\n'), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"` },
  });
}
