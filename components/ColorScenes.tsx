'use client';
import { useEffect, useRef, useState } from 'react';

const SCENES = [
  { key: 'warm', label: 'Everyday warm white', colors: ['#FFD9A0'] },
  { key: 'christmas', label: 'Christmas', colors: ['#FF3B3B', '#2BD46B'] },
  { key: 'gameday', label: 'Game day', colors: ['#4E2683', '#C5C6C8', '#FFFFFF'] },
  { key: 'july4', label: 'Fourth of July', colors: ['#FF3B3B', '#F3F3F3', '#4F8BFF'] },
  { key: 'halloween', label: 'Halloween', colors: ['#FF8A1F', '#A855F7'] },
  { key: 'valentine', label: 'Valentine’s Day', colors: ['#FF4F8B', '#FFC2D4'] },
  { key: 'cool', label: 'Cool white', colors: ['#E8F1FF'] },
];
const LAST = SCENES.length - 1;
const SPAN = 6.6; // a little dwell on the final scene before the section releases

/** Pinned section: scrolling wipes the lights left-to-right through each scene. */
export default function ColorScenes() {
  const ref = useRef<HTMLElement>(null);
  const [t, setT] = useState(0);
  const [pin, setPin] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = window.innerHeight > 0 && window.innerHeight < 1400;
      setPin(p);
      const el = ref.current;
      if (!el || !p) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      if (total <= 0) return;
      const prog = Math.min(1, Math.max(0, -r.top / total));
      setT(Math.min(LAST, prog * SPAN));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const go = (i: number) => {
    const el = ref.current;
    if (!el || !pin) { setT(i); return; }
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + total * (i / SPAN) + 1, behavior: 'smooth' });
  };

  const k = Math.min(LAST, Math.floor(t));
  const f = t - k;
  const sw = k >= LAST ? 0 : Math.min(1, Math.max(0, (f - 0.3) / 0.7));
  const cur = sw > 0.5 ? k + 1 : k;
  const F = 12;
  const edge = sw * (100 + F) - F;
  const layer = (i: number): React.CSSProperties => {
    if (i === k) return { opacity: 1 };
    if (i === k + 1 && sw > 0) {
      const m = `linear-gradient(90deg, #000 ${edge.toFixed(2)}%, transparent ${(edge + F).toFixed(2)}%)`;
      return { opacity: 1, WebkitMaskImage: m, maskImage: m };
    }
    return { opacity: 0 };
  };
  const label = SCENES[cur].label;

  return (
    <section ref={ref} style={{ position: 'relative', background: '#0E1315', color: '#F3EEE4', height: pin ? '560vh' : 'auto' }}>
      <div style={{ position: pin ? 'sticky' : 'relative', top: 0, height: pin ? '100vh' : 'auto', padding: pin ? 0 : '72px 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #FF3B3B, #FF8A1F, #FFD9A0, #2BD46B, #4F8BFF, #A855F7, #FF4F8B)', boxShadow: '0 0 24px 4px rgba(255, 200, 140, 0.35)' }} />
        <div style={{ width: '100%', maxWidth: 1120, margin: '0 auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px 32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 620 }}>
              <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.3em', color: '#E6D2A6' }}>ONE SYSTEM FOR EVERY OCCASION</div>
              <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(1.9rem, 3.4vw, 2.7rem)', lineHeight: 1.1 }}>Change the look in seconds.</h2>
            </div>
            <p style={{ margin: 0, maxWidth: 380, fontSize: 16, fontWeight: 300, lineHeight: 1.55, color: '#C9CFD0' }}>Warm white on a Tuesday, red and green in December, your team&apos;s colors on game day.</p>
          </div>

          <div style={{ position: 'relative', width: 'min(100%, calc(58vh * 1.598))', margin: '0 auto', borderRadius: 18, overflow: 'hidden', background: '#0B1220', isolation: 'isolate' }}>
            <img src="/images/scenes/off.jpg" alt={`A brick ranch home at dusk with roofline lights shown in the ${label} scene`} width={1304} height={816} style={{ width: '100%', height: 'auto', display: 'block' }} />
            {SCENES.map((s, i) => (
              <img key={s.key} src={`/images/scenes/${s.key}.jpg`} alt="" aria-hidden="true" loading={i < 2 ? 'eager' : 'lazy'}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', ...layer(i) }} />
            ))}
            <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(14, 19, 21, 0.75)', color: '#F3EEE4', fontSize: 13, padding: '6px 12px', borderRadius: 999 }} aria-live="polite">{label}</div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            {SCENES.map((s, i) => (
              <button key={s.key} type="button" aria-pressed={cur === i} onClick={() => go(i)}
                style={{ minHeight: 44, padding: '0 14px', borderRadius: 999, border: `1.5px solid ${cur === i ? '#E6D2A6' : '#3A4549'}`, background: cur === i ? '#1F2A2F' : 'transparent', color: '#F3EEE4', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, opacity: i <= cur ? 1 : 0.55, transition: 'opacity 0.3s, background 0.3s' }}>
                <span aria-hidden="true" style={{ display: 'inline-flex', gap: 3 }}>
                  {s.colors.map((c) => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}` }} />)}
                </span>
                {s.label}
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center', fontSize: 13, color: '#9AA5A8' }}>{cur < LAST ? 'Keep scrolling to see more looks' : 'Keep scrolling to continue'}</div>
        </div>
      </div>
    </section>
  );
}
