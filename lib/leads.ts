import { NEXT_STEPS } from '@/config/site';
import 'server-only';
import postgres from 'postgres';
import { promises as fs } from 'fs';
import path from 'path';

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  stage: 'contact' | 'address' | 'complete';
  status: string;
  tags: string[];
  notes: string;
  first_name: string;
  phone: string;
  email: string;
  consent: boolean;
  zip: string;
  in_area: boolean;
  address: string;
  lat: number | null;
  lng: number | null;
  home_found: boolean | null;
  roofline_ft: number | null;
  coverage: string;
  home_size: string;
  stories: string;
  owner: string;
  timing: string;
  hoa: string;
  price_low: number | null;
  price_high: number | null;
  callback: string;
  next_step?: string;
  utm: Record<string, string>;
  alerted_contact: boolean;
  alerted_complete: boolean;
};

// Find the database connection whatever name Vercel's Neon integration gave it
// (DATABASE_URL, POSTGRES_URL, or a custom prefix like STORAGE_DATABASE_URL).
function findDbUrl(): { url: string; name: string } | null {
  const preferred = ['DATABASE_URL', 'POSTGRES_URL', 'POSTGRES_PRISMA_URL', 'STORAGE_URL', 'NEON_DATABASE_URL'];
  for (const n of preferred) if (process.env[n]?.startsWith('postgres')) return { url: process.env[n]!, name: n };
  for (const [n, v] of Object.entries(process.env)) {
    if (v && /^postgres(ql)?:\/\//.test(v) && /(DATABASE_URL|POSTGRES_URL)$/.test(n) && !/UNPOOLED|NON_POOLING/.test(n)) return { url: v, name: n };
  }
  for (const [n, v] of Object.entries(process.env)) if (v && /^postgres(ql)?:\/\//.test(v)) return { url: v, name: n };
  return null;
}
const found = findDbUrl();
const url = found?.url;
export const dbVarName = found?.name ?? null;
const sql = url ? postgres(url, { ssl: url.includes('localhost') ? false : 'require', max: 3 }) : null;
let ready: Promise<unknown> | null = null;

function ensureTable() {
  if (!sql) return Promise.resolve();
  ready ??= sql`
    create table if not exists leads (
      id text primary key,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      data jsonb not null
    )`;
  return ready;
}

// Local fallback so the site works on a laptop without a database.
const FILE = path.join(process.env.VERCEL ? '/tmp' : process.cwd(), '.data', 'leads.json');
async function readFile(): Promise<Record<string, Lead>> {
  try { return JSON.parse(await fs.readFile(FILE, 'utf8')); } catch { return {}; }
}
async function writeFile(all: Record<string, Lead>) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(all, null, 2));
}

export const storageMode = sql ? 'postgres' : 'local file';

/** Quick check used by the dashboard's status bar. */
export async function dbStatus(): Promise<{ ok: boolean; mode: string; detail: string; count?: number }> {
  if (!sql) return { ok: false, mode: 'temporary storage', detail: process.env.VERCEL ? 'No database connection found on Vercel. Leads are only kept temporarily.' : 'Local file (fine for testing on a laptop).' };
  try {
    await ensureTable();
    const r = await sql`select count(*)::int as n from leads`;
    return { ok: true, mode: 'postgres', detail: `Connected via ${dbVarName}`, count: r[0].n };
  } catch (e) {
    return { ok: false, mode: 'postgres', detail: 'Database found but could not connect: ' + String((e as Error).message).slice(0, 160) };
  }
}

export async function getLead(id: string): Promise<Lead | null> {
  if (sql) {
    await ensureTable();
    const rows = await sql`select data from leads where id = ${id}`;
    return (rows[0]?.data as Lead) ?? null;
  }
  return (await readFile())[id] ?? null;
}

export async function saveLead(lead: Lead): Promise<void> {
  lead.updated_at = new Date().toISOString();
  if (sql) {
    await ensureTable();
    await sql`
      insert into leads (id, created_at, updated_at, data)
      values (${lead.id}, ${lead.created_at}, ${lead.updated_at}, ${sql.json(lead as never)})
      on conflict (id) do update set updated_at = excluded.updated_at, data = excluded.data`;
    return;
  }
  const all = await readFile();
  all[lead.id] = lead;
  await writeFile(all);
}

export async function deleteLead(id: string): Promise<void> {
  if (sql) {
    await ensureTable();
    await sql`delete from leads where id = ${id}`;
    return;
  }
  const all = await readFile();
  delete all[id];
  await writeFile(all);
}

export async function listLeads(): Promise<Lead[]> {
  if (sql) {
    await ensureTable();
    const rows = await sql`select data from leads order by created_at desc limit 2000`;
    return rows.map((r) => r.data as Lead);
  }
  return Object.values(await readFile()).sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function blankLead(id: string): Lead {
  const now = new Date().toISOString();
  return {
    id, created_at: now, updated_at: now, stage: 'contact', status: 'new', tags: [], notes: '',
    first_name: '', phone: '', email: '', consent: false, zip: '', in_area: false,
    address: '', lat: null, lng: null, home_found: null, roofline_ft: null, coverage: '', home_size: '',
    stories: '', owner: '', timing: '', hoa: '', price_low: null, price_high: null, callback: '', next_step: '',
    utm: {}, alerted_contact: false, alerted_complete: false,
  };
}

/** Automatic tags for email marketing segments. */
export function autoTags(l: Lead): string[] {
  const t = new Set(l.tags.filter((x) => !x.startsWith('auto:')));
  t.add(l.stage === 'complete' ? 'auto:completed-estimate' : 'auto:started-estimate');
  if (!l.in_area) t.add('auto:outside-area');
  if (l.timing === 'Before the holidays') t.add('auto:holiday-buyer');
  if (l.timing === 'Just exploring for now') t.add('auto:exploring');
  if (l.owner === 'No') t.add('auto:not-owner');
  if (l.hoa === 'Yes') t.add('auto:hoa');
  if (l.utm.utm_source) t.add('auto:src-' + l.utm.utm_source.toLowerCase());
  const ns = NEXT_STEPS.find((n) => n.label === l.next_step);
  if (ns) t.add('auto:' + ns.tag);
  return [...t];
}
