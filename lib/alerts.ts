import 'server-only';
import type { Lead } from './leads';
import { SITE } from '@/config/site';
import { money } from './estimate';

// ─────────────────────────────────────────────────────────────
//  Branded emails: lead alerts to the team, and the homeowner's
//  copy of their ballpark estimate. Sent through Resend.
// ─────────────────────────────────────────────────────────────

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Public address of the site, for links and the logo image in emails. */
function siteBase() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return SITE.url;
}

const C = { night: '#141A1D', ink: '#1C2326', slate: '#4A5559', cream: '#F6F3EC', lime: '#EDE7DB', line: '#E2DBCC', gold: '#C9A66B', pale: '#E6D2A6' };
const SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const SANS = "Jost, 'Helvetica Neue', Arial, sans-serif";

/** Shared shell: dark logo band, white card, quiet footer. Table-based so it holds up in Gmail and Outlook. */
function shell(preheader: string, body: string) {
  const base = siteBase();
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:${C.lime};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.lime};"><tr><td align="center" style="padding:28px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
    <tr><td style="background:${C.night};border-radius:14px 14px 0 0;padding:26px 32px;">
      <a href="${base}" style="text-decoration:none;"><img src="${base}/email/logo-dark.png" width="240" alt="Light Up Texas Installs" style="display:block;width:240px;max-width:100%;height:auto;border:0;color:${C.cream};font-family:${SERIF};font-size:20px;letter-spacing:3px;"></a>
    </td></tr>
    <tr><td style="background:#FFFFFF;padding:32px;border-left:1px solid ${C.line};border-right:1px solid ${C.line};font-family:${SANS};color:${C.ink};font-size:15px;line-height:1.6;">
      ${body}
    </td></tr>
    <tr><td style="background:${C.cream};border:1px solid ${C.line};border-top:0;border-radius:0 0 14px 14px;padding:18px 32px;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.slate};">
      ${esc(SITE.name)} · ${esc(SITE.serviceAreaLabel)} · <a href="tel:${SITE.phoneTel}" style="color:${C.slate};">${esc(SITE.phoneDisplay)}</a>
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

const h1 = (t: string) => `<h1 style="margin:0 0 10px;font-family:${SERIF};font-weight:400;font-size:30px;line-height:1.15;color:${C.ink};">${t}</h1>`;
const eyebrow = (t: string) => `<div style="font-size:11px;font-weight:500;letter-spacing:3px;color:${C.slate};margin:0 0 8px;">${t}</div>`;
const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 4px;"><tr><td style="background:${C.ink};border-radius:999px;"><a href="${href}" style="display:inline-block;padding:13px 26px;font-family:${SANS};font-size:15px;font-weight:500;color:${C.cream};text-decoration:none;letter-spacing:.3px;">${label}</a></td></tr></table>`;

function rows(pairs: [string, unknown][]) {
  const r = pairs
    .filter(([, v]) => v !== '' && v !== null && v !== undefined)
    .map(([k, v]) => `<tr><td style="padding:9px 14px 9px 0;border-bottom:1px solid ${C.line};color:${C.slate};font-size:13px;white-space:nowrap;vertical-align:top;">${esc(k)}</td><td style="padding:9px 0;border-bottom:1px solid ${C.line};font-size:14px;color:${C.ink};">${esc(v)}</td></tr>`)
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.line};margin-top:18px;">${r}</table>`;
}

async function send(to: string[], subject: string, html: string, replyTo?: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to.length) {
    console.log(`[email skipped: not configured] ${subject}`);
    return false;
  }
  const from = process.env.ALERT_FROM_EMAIL || 'Light Up Texas <onboarding@resend.dev>';
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    if (!r.ok) console.error('Resend error', r.status, await r.text());
    return r.ok;
  } catch (e) {
    console.error('Resend failed', e);
    return false;
  }
}

const alertRecipients = () => (process.env.LEAD_ALERT_EMAILS || '').split(',').map((s) => s.trim()).filter(Boolean);
const priceText = (l: Lead) => (l.price_low && l.price_high ? `${money(l.price_low)} – ${money(l.price_high)}` : '');

/** Internal alert to the team. */
export async function sendLeadAlert(lead: Lead, kind: 'new' | 'complete' | 'callback'): Promise<boolean> {
  const price = priceText(lead);
  const subject =
    kind === 'new' ? `New lead: ${lead.first_name} ${lead.phone} — call now` :
    kind === 'complete' ? `Estimate finished: ${lead.first_name} ${price}` :
    `Callback requested: ${lead.first_name} — ${lead.callback}`;
  const title =
    kind === 'new' ? `${esc(lead.first_name)} just started an estimate` :
    kind === 'complete' ? `${esc(lead.first_name)} saw their price` :
    `${esc(lead.first_name)} picked a call time`;
  const intro =
    kind === 'new' ? 'They&rsquo;re on the site right now. Calling in the next few minutes is your best shot.' :
    kind === 'complete' ? 'They finished the estimator and saw their ballpark price.' :
    'They can&rsquo;t talk now and chose a time for you to call.';
  const phoneDigits = lead.phone.replace(/\D/g, '');
  const body = `
    ${eyebrow(kind === 'new' ? 'NEW LEAD' : kind === 'complete' ? 'ESTIMATE COMPLETED' : 'CALLBACK')}
    ${h1(title)}
    <p style="margin:0;color:${C.slate};">${intro}</p>
    ${price ? `<div style="margin:20px 0 0;padding:16px 18px;background:${C.cream};border-radius:10px;"><div style="font-size:11px;letter-spacing:3px;color:${C.slate};">BALLPARK</div><div style="font-family:${SERIF};font-size:28px;line-height:1.2;color:${C.ink};">${price}</div></div>` : ''}
    ${button(`tel:${phoneDigits}`, `Call ${esc(lead.phone)}`)}
    ${rows([
      ['Name', lead.first_name], ['Phone', lead.phone], ['Email', lead.email],
      ['ZIP', lead.zip + (lead.in_area ? '' : ' (outside service area)')], ['Address', lead.address],
      ['Roofline', lead.roofline_ft ? `~${lead.roofline_ft} ft` : ''], ['Coverage', lead.coverage], ['Home size', lead.home_size],
      ['Stories', lead.stories], ['Owns home', lead.owner], ['Timing', lead.timing], ['HOA', lead.hoa],
      ['Call', lead.callback || (kind === 'complete' ? 'ASAP' : '')],
      ['Source', lead.utm.utm_source ? `${lead.utm.utm_source}${lead.utm.utm_campaign ? ' / ' + lead.utm.utm_campaign : ''}` : lead.utm.fbclid ? 'facebook' : ''],
    ])}
    <p style="margin:22px 0 0;font-size:13px;"><a href="${siteBase()}/admin" style="color:${C.ink};">Open the leads dashboard →</a></p>`;
  return send(alertRecipients(), subject, shell(`${lead.first_name} · ${lead.phone}${price ? ' · ' + price : ''}`, body));
}

/** The homeowner's copy of their ballpark estimate. */
export async function sendCustomerEstimate(lead: Lead): Promise<boolean> {
  const price = priceText(lead);
  if (!lead.email || !price) return false;
  const body = `
    ${eyebrow('YOUR BALLPARK ESTIMATE')}
    ${h1(`Thanks, ${esc(lead.first_name)}. Here&rsquo;s your ballpark.`)}
    <div style="margin:18px 0 0;padding:20px 22px;background:${C.night};border-radius:12px;color:${C.cream};">
      <div style="font-size:11px;letter-spacing:3px;color:${C.pale};">ESTIMATED RANGE</div>
      <div style="font-family:${SERIF};font-size:36px;line-height:1.15;color:${C.cream};">${price}</div>
      <div style="font-size:13px;color:#C9CFD0;margin-top:4px;">${esc([lead.roofline_ft ? `About ${lead.roofline_ft} ft of roofline` : '', lead.coverage.replace('Traced on map · ', ''), lead.stories].filter(Boolean).join(' · '))}</div>
    </div>
    <p style="margin:20px 0 0;">${esc(SITE.specialistName)}, our lighting specialists, will text you at <b style="font-weight:500;">${esc(lead.phone)}</b> to answer your questions and set up a free in-person measurement.</p>
    <p style="margin:14px 0 0;color:${C.slate};font-size:14px;"><b style="font-weight:500;color:${C.ink};">This is a ballpark, not a quote.</b> It&rsquo;s based on your home&rsquo;s size and typical installs. Your official price comes after we measure in person, before any work begins. No obligation.</p>
    ${button(`tel:${SITE.phoneTel}`, `Call us at ${esc(SITE.phoneDisplay)}`)}
    <p style="margin:18px 0 0;font-size:13px;color:${C.slate};">Questions? Just reply to this email.</p>`;
  const replyTo = alertRecipients()[0];
  return send([lead.email], `Your lighting estimate: ${price}`, shell(`Your ballpark for permanent lighting: ${price}`, body), replyTo);
}
