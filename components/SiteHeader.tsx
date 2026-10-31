import Link from 'next/link';
import { SITE } from '@/config/site';

export function Logo() {
  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#1C2326' }}>
      <svg width="44" height="37" viewBox="0 0 120 100" aria-hidden="true">
        <g fill="#C9A66B" style={{ filter: 'blur(1.5px)', opacity: 0.55 }}>
          <path d="M22 41 L60 8.8 L98 41 L98 49 L60 17 L22 49 Z" />
        </g>
        <g fill="none" stroke="#1C2326" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round">
          <path d="M6 92 H114" />
          <path d="M16 46 L60 8 L104 46" />
          <path d="M22 41 V92 M98 41 V92" />
          <path d="M51 92 V68 A9 9 0 0 1 69 68 V92" />
          <path d="M80 25 V6 H87 V31" />
        </g>
      </svg>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 19, letterSpacing: '0.22em', lineHeight: 1 }}>LIGHT UP TEXAS</span>
        <span style={{ fontSize: 10, letterSpacing: '0.45em', color: '#4A5559', lineHeight: 1 }}>INSTALLS LLC</span>
      </span>
      <span className="sr-only">{SITE.name} home</span>
    </Link>
  );
}

export default function SiteHeader({ variant = 'landing' }: { variant?: 'landing' | 'estimate' }) {
  return (
    <header style={{ background: '#F6F3EC', borderBottom: '1px solid #E2DBCC' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '14px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <Logo />
        {variant === 'landing' ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18 }}>
            <a href={`tel:${SITE.phoneTel}`} style={{ fontSize: 14, color: '#3A4549', textDecoration: 'none' }}>{SITE.phoneDisplay}</a>
            <Link href="/estimate" className="btn-primary" style={{ minHeight: 44, padding: '0 22px', fontSize: 14, letterSpacing: '0.04em' }}>Get my estimate</Link>
          </div>
        ) : (
          <Link href="/" style={{ fontSize: 14, color: '#3A4549' }}>Back to home</Link>
        )}
      </div>
    </header>
  );
}
