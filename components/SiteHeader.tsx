import Link from 'next/link';
import { SITE } from '@/config/site';
import TexasMark from './TexasMark';

export function Logo() {
  return (
    <Link href="/" className="hdr-logo" style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', color: '#1C2326' }}>
      <TexasMark width={62} icon />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: 26, letterSpacing: '0.2em', lineHeight: 1 }}>LIGHT UP TEXAS</span>
        <span style={{ fontSize: 12, letterSpacing: '0.62em', color: '#4A5559', lineHeight: 1 }}>INSTALLS LLC</span>
      </span>
      <span className="sr-only">{SITE.name} home</span>
    </Link>
  );
}

export default function SiteHeader({ variant = 'landing' }: { variant?: 'landing' | 'estimate' }) {
  return (
    <header style={{ background: '#F6F3EC', borderBottom: '1px solid #E2DBCC' }}>
      <div className="hdr-inner" style={{ maxWidth: 1120, margin: '0 auto', padding: '26px 24px', display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <Logo />
        {variant === 'landing' ? (
          <div className="hdr-actions" style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Light Up Texas on Facebook" className="social-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 8.5h2.5V5H14a3.5 3.5 0 0 0-3.5 3.5V11H8v3.5h2.5V21H14v-6.5h2.5L17 11h-3V9a.5.5 0 0 1 .5-.5z" /></svg>
              </a>
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Light Up Texas on Instagram" className="social-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" /></svg>
              </a>
            </div>
            <a href={`tel:${SITE.phoneTel}`} className="hdr-phone" aria-label={`Call ${SITE.phoneDisplay}`} style={{ fontSize: 17, color: '#1C2326', textDecoration: 'none', letterSpacing: '0.02em' }}>
              <svg className="hdr-phone-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1.5 1.5 0 0 1-1.5 1.5A15.5 15.5 0 0 1 3.5 5.5 1.5 1.5 0 0 1 5 4z" /></svg>
              <span className="hdr-phone-text">{SITE.phoneDisplay}</span>
            </a>
          </div>
        ) : (
          <div className="hdr-actions" style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
            <a href={`tel:${SITE.phoneTel}`} className="hdr-phone" aria-label={`Call ${SITE.phoneDisplay}`} style={{ fontSize: 17, color: '#1C2326', textDecoration: 'none', letterSpacing: '0.02em' }}>
              <svg className="hdr-phone-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1.5 1.5 0 0 1-1.5 1.5A15.5 15.5 0 0 1 3.5 5.5 1.5 1.5 0 0 1 5 4z" /></svg>
              <span className="hdr-phone-text">{SITE.phoneDisplay}</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
