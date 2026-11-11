import { isAdmin } from '@/lib/auth';
import { listLeads, dbStatus, type Lead } from '@/lib/leads';
import { loginAction, updateLead, deleteLeadAction } from './actions';
import DeleteLeadButton from '@/components/DeleteLeadButton';
import { LEAD_STATUSES, LEGACY_STATUS } from '@/config/site';
import { money } from '@/lib/estimate';
import { Logo } from '@/components/SiteHeader';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Leads | Light Up Texas', robots: { index: false } };

const TZ = 'America/Chicago';
/** YYYY-MM-DD for a moment, in Abilene's time zone. */
const dayOf = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: TZ });
const shiftDays = (n: number) => dayOf(new Date(Date.now() - n * 86400000));
const fmt = (iso: string) => new Date(iso).toLocaleString('en-US', { timeZone: 'America/Chicago', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export default async function Admin({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  if (!(await isAdmin())) {
    return (
      <main style={{ maxWidth: 360, margin: '80px auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Logo />
        {!process.env.ADMIN_PASSWORD && <p className="err">Set ADMIN_PASSWORD in Vercel to turn on the dashboard.</p>}
        <form action={loginAction} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label htmlFor="pw" className="est-label">Password</label>
          <input id="pw" name="password" type="password" className="est-input" autoFocus />
          {sp.e && <div className="err">Wrong password.</div>}
          <button className="btn-primary">Sign in</button>
        </form>
      </main>
    );
  }

  const status = await dbStatus();
  let all: Lead[] = [];
  let loadError = '';
  try { all = await listLeads(); } catch (e) { loadError = String((e as Error).message).slice(0, 200); }
  all = all.map((l) => ({ ...l, status: LEGACY_STATUS[l.status] ?? l.status }));
  const view = sp.view || 'all';
  const from = /^\d{4}-\d{2}-\d{2}$/.test(sp.from || '') ? sp.from! : '';
  const to = /^\d{4}-\d{2}-\d{2}$/.test(sp.to || '') ? sp.to! : '';
  const tag = sp.tag || '';
  const allTags = [...new Set(all.flatMap((l) => l.tags))].sort((a, b) => Number(a.startsWith('auto:')) - Number(b.startsWith('auto:')) || a.localeCompare(b));
  const tagLabel = (t: string) => (t.startsWith('auto:') ? `${t.slice(5)} (auto)` : t);
  const inRange = all.filter((l) => { const d = dayOf(new Date(l.created_at)); return (!from || d >= from) && (!to || d <= to) && (!tag || l.tags.includes(tag)); });
  const leads = inRange.filter((l) =>
    view === 'all' ? true : view === 'started' ? l.stage !== 'complete' : view === 'completed' ? l.stage === 'complete' : l.status === view);
  const count = (f: (l: (typeof all)[number]) => boolean) => inRange.filter(f).length;
  const qs = (o: Record<string, string>) => { const p = new URLSearchParams(); Object.entries(o).forEach(([k, v]) => v && p.set(k, v)); const s = p.toString(); return s ? `/admin?${s}` : '/admin'; };
  const today = dayOf(new Date());
  const presets: [string, string, string][] = [['Today', today, today], ['Last 7 days', shiftDays(6), today], ['Last 30 days', shiftDays(29), today], ['All time', '', '']];
  const tabs: [string, string][] = [
    ['all', `All (${inRange.length})`],
    ['started', `Started only (${count((l) => l.stage !== 'complete')})`],
    ['completed', `Saw price (${count((l) => l.stage === 'complete')})`],
    ...LEAD_STATUSES.map((s) => [s, `${s} (${count((l) => l.status === s)})`] as [string, string]),
  ];

  return (
    <main style={{ padding: '20px 16px 60px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Logo />
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', fontSize: 13 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: status.ok ? '#2F6B3A' : '#9B2C2C' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: status.ok ? '#2F6B3A' : '#9B2C2C' }} />
            {status.ok ? `Database connected · ${status.count} leads` : 'Database problem'}
          </span>
          <a href={`/admin/export${from || to || tag ? `?${new URLSearchParams({ ...(from && { from }), ...(to && { to }), ...(tag && { tag }) })}` : ''}`}>Download CSV</a>
        </div>
      </div>
      {(!status.ok || loadError) && (
        <div role="alert" style={{ background: '#FBEAEA', border: '1px solid #E5B8B8', color: '#7A1F1F', borderRadius: 10, padding: '12px 14px', fontSize: 14, marginBottom: 14 }}>
          <b style={{ fontWeight: 500 }}>Leads aren&apos;t being stored permanently.</b> {status.detail}{loadError ? ` (${loadError})` : ''} In Vercel: Storage → make sure the Neon database is connected to this project, then Deployments → Redeploy.
        </div>
      )}
      <form method="get" action="/admin" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 8, marginBottom: 12, fontSize: 13 }}>
        {view !== 'all' && <input type="hidden" name="view" value={view} />}
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>From<input type="date" name="from" defaultValue={from} /></label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>To<input type="date" name="to" defaultValue={to} /></label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>Tag
          <select name="tag" defaultValue={tag}>
            <option value="">Any tag</option>
            {allTags.map((t) => <option key={t} value={t}>{tagLabel(t)} ({all.filter((l) => l.tags.includes(t)).length})</option>)}
          </select>
        </label>
        <button className="pill" style={{ minHeight: 34 }}>Apply</button>
        {presets.map(([label, f, t]) => (
          <a key={label} href={qs({ view: view === 'all' ? '' : view, from: f, to: t, tag })} className="pill" aria-pressed={from === f && to === t} style={{ textDecoration: 'none', minHeight: 34, fontSize: 13 }}>{label}</a>
        ))}
      </form>
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {tabs.map(([k, l]) => (
          <a key={k} href={qs({ view: k === 'all' ? '' : k, from, to, tag })} className="pill" aria-pressed={view === k} style={{ textDecoration: 'none', minHeight: 34, fontSize: 13 }}>{l}</a>
        ))}
      </nav>
      <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #E2DBCC', borderRadius: 12 }}>
        <table className="adm">
          <thead><tr><th>When</th><th>Lead</th><th>Home</th><th>Ballpark</th><th>Answers</th><th>Source</th><th>Status · tags · notes</th></tr></thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{fmt(l.created_at)}<br /><span style={{ color: l.stage === 'complete' ? '#2F6B3A' : '#9B6B1F' }}>{l.stage === 'complete' ? 'Saw price' : 'Started'}</span></td>
                <td><b>{l.first_name}</b><br /><a href={`tel:${l.phone.replace(/\D/g, '')}`}>{l.phone}</a><br /><a href={`mailto:${l.email}`}>{l.email}</a>{l.callback && <><br />Call: {l.callback}</>}</td>
                <td>{l.address || '—'}<br />ZIP {l.zip}{!l.in_area && ' (outside area)'}<br />{l.roofline_ft ? `~${l.roofline_ft} ft · ${l.coverage}` : ''}{l.home_found === false ? ' · size estimate' : ''}{l.home_size ? <><br />{l.home_size}</> : ''}</td>
                <td style={{ whiteSpace: 'nowrap' }}>{l.price_low ? `${money(l.price_low)}–${money(l.price_high!)}` : '—'}</td>
                <td>{[l.stories, l.owner && `Owner: ${l.owner}`, l.timing, l.hoa && `HOA: ${l.hoa}`].filter(Boolean).join(' · ')}</td>
                <td>
                  <b style={{ fontWeight: 500 }}>{l.utm.utm_source || (l.utm.fbclid ? 'facebook' : 'direct')}</b>
                  {l.utm.utm_content && <><br />Ad: <b style={{ fontWeight: 500 }}>{l.utm.utm_content}</b></>}
                  {l.utm.utm_term && <><br /><span style={{ color: '#7A8487' }}>Ad set: {l.utm.utm_term}</span></>}
                  {l.utm.utm_campaign && <><br /><span style={{ color: '#7A8487' }}>Campaign: {l.utm.utm_campaign}</span></>}
                </td>
                <td>
                  <form action={updateLead} style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220 }}>
                    <input type="hidden" name="id" value={l.id} />
                    <select name="status" defaultValue={l.status}>{LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                    <input name="tags" placeholder="tags, comma separated" defaultValue={l.tags.filter((t) => !t.startsWith('auto:')).join(', ')} />
                    <input name="notes" placeholder="notes" defaultValue={l.notes} />
                    <div style={{ fontSize: 11, color: '#7A8487' }}>{l.tags.filter((t) => t.startsWith('auto:')).map((t) => t.slice(5)).join(' · ')}</div>
                    <button className="pill" style={{ minHeight: 30, alignSelf: 'flex-start' }}>Save</button>
                  </form>
                  <form action={deleteLeadAction} style={{ marginTop: 8 }}>
                    <input type="hidden" name="id" value={l.id} />
                    <DeleteLeadButton name={l.first_name} />
                  </form>
                </td>
              </tr>
            ))}
            {!leads.length && <tr><td colSpan={7} style={{ padding: 24, color: '#5E6A6E' }}>No leads here yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
