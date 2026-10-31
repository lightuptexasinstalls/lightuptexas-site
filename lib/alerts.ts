import 'server-only';
import type { Lead } from './leads';
import { SITE } from '@/config/site';
import { money } from './estimate';

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function row(k: string, v: unknown) {
  return v === '' || v === null || v === undefined ? '' :
    `<tr><td style="padding:4px 12px 4px 0;color:#5E6A6E">${esc(k)}</td><td style="padding:4px 0"><b>${esc(v)}</b></td></tr>`;
}

export async function sendLeadAlert(lead: Lead, kind: 'new' | 'complete' | 'callback'): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = (process.env.LEAD_ALERT_EMAILS || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!key || !to.length) {
    console.log(`[lead alert skipped: email not configured] ${kind} ${lead.first_name} ${lead.phone}`);
    return false;
  }
  const from = process.env.ALERT_FROM_EMAIL || 'Light Up Texas <onboarding@resend.dev>';
  const price = lead.price_low ? `${money(lead.price_low)} – ${money(lead.price_high!)}` : '';
  const subject =
    kind === 'new' ? `New lead: ${lead.first_name} ${lead.phone} — call now` :
    kind === 'complete' ? `Estimate finished: ${lead.first_name} ${price}` :
    `Callback requested: ${lead.first_name} — ${lead.callback}`;
  const intro =
    kind === 'new' ? 'Someone just started an estimate. Call them while they’re still on the site.' :
    kind === 'complete' ? 'This lead saw their ballpark price.' :
    'They can’t talk now and picked a time for you to call.';
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1C2326">
    <p>${intro}</p>
    <p style="font-size:22px;margin:8px 0"><a href="tel:${esc(lead.phone.replace(/\D/g, ''))}">${esc(lead.phone)}</a></p>
    <table>${row('Name', lead.first_name)}${row('Email', lead.email)}${row('ZIP', lead.zip + (lead.in_area ? '' : ' (outside service area)'))}
    ${row('Address', lead.address)}${row('Ballpark', price)}${row('Roofline', lead.roofline_ft ? '~' + lead.roofline_ft + ' ft' : '')}
    ${row('Coverage', lead.coverage)}${row('Home size', lead.home_size)}${row('Stories', lead.stories)}${row('Owns home', lead.owner)}
    ${row('Timing', lead.timing)}${row('HOA', lead.hoa)}${row('Call', lead.callback || (kind === 'complete' ? 'ASAP' : ''))}
    ${row('Source', lead.utm.utm_source ? `${lead.utm.utm_source} / ${lead.utm.utm_campaign || ''}` : '')}</table>
    <p><a href="${SITE.url}/admin">Open the leads dashboard</a></p></div>`;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!r.ok) console.error('Resend error', r.status, await r.text());
    return r.ok;
  } catch (e) {
    console.error('Resend failed', e);
    return false;
  }
}
