import { NextRequest, NextResponse } from 'next/server';
import { getLead, saveLead, blankLead, autoTags, type Lead } from '@/lib/leads';
import { sendLeadAlert, sendCustomerEstimate } from '@/lib/alerts';
import { inServiceArea, priceRange } from '@/lib/estimate';
import { STORIES, COVERAGE, HOME_SIZES, OWNER, TIMING, HOA, CALLBACK_SLOTS, NEXT_STEPS } from '@/config/site';

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const pick = (v: unknown, list: readonly string[]) => (typeof v === 'string' && list.includes(v) ? v : '');
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

export async function POST(req: NextRequest) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  if (str(b.website)) return NextResponse.json({ ok: true }); // honeypot: bots fill hidden fields

  const id = str(b.id, 64);
  if (!/^[a-zA-Z0-9-]{16,64}$/.test(id)) return NextResponse.json({ ok: false, error: 'bad id' }, { status: 400 });

  const existing = await getLead(id);
  const lead: Lead = existing ?? blankLead(id);

  // Contact info (step 2) is required before anything is saved.
  const first = str(b.first_name, 60) || lead.first_name;
  const phone = str(b.phone, 30) || lead.phone;
  const email = str(b.email, 120) || lead.email;
  if (!first || phone.replace(/\D/g, '').length < 10 || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'contact info missing' }, { status: 400 });
  }
  lead.first_name = first; lead.phone = phone; lead.email = email;
  if (b.consent === true) lead.consent = true;

  const zip = str(b.zip, 5);
  if (/^\d{5}$/.test(zip)) { lead.zip = zip; lead.in_area = inServiceArea(zip); }
  if (str(b.address, 300)) lead.address = str(b.address, 300);
  if (num(b.lat) !== null) lead.lat = num(b.lat);
  if (num(b.lng) !== null) lead.lng = num(b.lng);
  if (typeof b.home_found === 'boolean') lead.home_found = b.home_found;
  if (num(b.roofline_ft) !== null) lead.roofline_ft = Math.max(0, Math.min(2000, Math.round(num(b.roofline_ft)!)));
  lead.coverage = pick(b.coverage, COVERAGE.map((c) => c.label)) || lead.coverage;
  lead.home_size = pick(b.home_size, HOME_SIZES.map((c) => c.label)) || lead.home_size;
  lead.stories = pick(b.stories, STORIES) || lead.stories;
  lead.owner = pick(b.owner, OWNER) || lead.owner;
  lead.timing = pick(b.timing, TIMING) || lead.timing;
  lead.hoa = pick(b.hoa, HOA) || lead.hoa;
  const callback = pick(b.callback, CALLBACK_SLOTS);
  const nextStep = pick(b.next_step, NEXT_STEPS.map((n) => n.label));
  if (b.utm && typeof b.utm === 'object' && !Object.keys(lead.utm).length) {
    for (const [k, v] of Object.entries(b.utm as Record<string, unknown>).slice(0, 12)) lead.utm[str(k, 30)] = str(v, 200);
  }

  const stage = str(b.stage, 20);
  if (stage === 'address' && lead.stage === 'contact') lead.stage = 'address';
  if (stage === 'complete') lead.stage = 'complete';

  // Price is always recalculated here so it can't be edited in the browser.
  const si = STORIES.indexOf(lead.stories);
  const range = lead.roofline_ft && si >= 0 ? priceRange(lead.roofline_ft, si) : null;
  lead.price_low = range?.low ?? null;
  lead.price_high = range?.high ?? null;

  let alert: 'new' | 'complete' | 'callback' | 'next' | null = null;
  if (!lead.alerted_contact) { alert = 'new'; lead.alerted_contact = true; }
  else if (lead.stage === 'complete' && !lead.alerted_complete) { alert = 'complete'; lead.alerted_complete = true; }
  if (callback && callback !== lead.callback) { lead.callback = callback; alert = 'callback'; }
  if (nextStep && nextStep !== lead.next_step) { lead.next_step = nextStep; alert = 'next'; }

  lead.tags = autoTags(lead);
  await saveLead(lead);
  if (alert) await sendLeadAlert(lead, alert);
  if (alert === 'complete') await sendCustomerEstimate(lead);

  return NextResponse.json({ ok: true, price_low: lead.price_low, price_high: lead.price_high, in_area: lead.in_area });
}
