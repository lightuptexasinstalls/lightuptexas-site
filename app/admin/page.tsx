import { isAdmin } from '@/lib/auth';
import { listLeads, storageMode } from '@/lib/leads';
import { loginAction, updateLead } from './actions';
import { LEAD_STATUSES } from '@/config/site';
import { money } from '@/lib/estimate';
import { Logo } from '@/components/SiteHeader';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Leads | Light Up Texas', robots: { index: false } };

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

  const all = await listLeads();
  const view = sp.view || 'all';
  const leads = all.filter((l) =>
    view === 'all' ? true : view === 'started' ? l.stage !== 'complete' : view === 'completed' ? l.stage === 'complete' : l.status === view);
  const count = (f: (l: (typeof all)[number]) => boolean) => all.filter(f).length;
  const tabs: [string, string][] = [
    ['all', `All (${all.length})`],
    ['started', `Started only (${count((l) => l.stage !== 'complete')})`],
    ['completed', `Saw price (${count((l) => l.stage === 'complete')})`],
    ...LEAD_STATUSES.map((s) => [s, `${s} (${count((l) => l.status === s)})`] as [string, string]),
  ];

  return (
    <main style={{ padding: '20px 16px 60px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Logo />
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', fontSize: 13 }}>
          <span style={{ color: '#5E6A6E' }}>Storage: {storageMode}</span>
          <a href="/admin/export">Download CSV</a>
        </div>
      </div>
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {tabs.map(([k, l]) => (
          <a key={k} href={`/admin?view=${encodeURIComponent(k)}`} className="pill" aria-pressed={view === k} style={{ textDecoration: 'none', minHeight: 34, fontSize: 13 }}>{l}</a>
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
                <td>{l.utm.utm_source ? `${l.utm.utm_source}${l.utm.utm_campaign ? ' / ' + l.utm.utm_campaign : ''}` : l.utm.fbclid ? 'facebook' : 'direct'}</td>
                <td>
                  <form action={updateLead} style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220 }}>
                    <input type="hidden" name="id" value={l.id} />
                    <select name="status" defaultValue={l.status}>{LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                    <input name="tags" placeholder="tags, comma separated" defaultValue={l.tags.filter((t) => !t.startsWith('auto:')).join(', ')} />
                    <input name="notes" placeholder="notes" defaultValue={l.notes} />
                    <div style={{ fontSize: 11, color: '#7A8487' }}>{l.tags.filter((t) => t.startsWith('auto:')).map((t) => t.slice(5)).join(' · ')}</div>
                    <button className="pill" style={{ minHeight: 30, alignSelf: 'flex-start' }}>Save</button>
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
