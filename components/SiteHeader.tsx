import Link from 'next/link';
import { SITE } from '@/config/site';
import TexasMark from './TexasMark';

export function Logo() {
  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: '#1C2326' }}>
      <TexasMark width={46} icon />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 19, letterSpacing: '0.2em', lineHeight: 1 }}>LIGHT UP TEXAS</span>
        <span style={{ fontSize: 10, letterSpacing: '0.55em', color: '#4A5559', lineHeight: 1 }}>INSTALLS LLC</span>
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
