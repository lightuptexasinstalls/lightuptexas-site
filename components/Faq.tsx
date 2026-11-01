'use client';
import { useId, useState } from 'react';

const ITEMS = [
  { q: "Can you see the lights during the day?", a: "Barely. The track is cut to fit your home and comes in hundreds of colors to match your soffit and fascia. In daylight, most people only notice small, evenly spaced lenses." },
  { q: "Will it work on my house?", a: "Almost certainly. Every track is custom-made for the home, including houses with gutters in front of the soffit, no soffit at all, stucco, or unusual rooflines. We confirm the details at your free in-person measurement." },
  { q: "Will installation damage my roof?", a: "[ANSWER TO CONFIRM WITH CLIENT: how the track is mounted]" },
  { q: "How long does installation take?", a: "Your track is made to measure first. Once it's ready, most homes are installed in a single day, and we walk you through the app before we leave." },
  { q: "How long will the lights last?", a: "The LEDs are rated for more than 100,000 hours, built for years of nightly use outdoors." },
  { q: "Is it expensive to run?", a: "No. Lighting an entire home draws less power than a single 200-watt bulb." },
  { q: "What's the warranty?", a: "[WARRANTY DETAILS TO CONFIRM WITH CLIENT]" },
  { q: "What about my HOA?", a: "Rules vary by neighborhood. Mention it on your call and we'll help you check what your HOA allows before anything is installed." },
  { q: "When should I book to be lit for the holidays?", a: "As early as you can. Install dates fill up as the holidays get closer, and each track is custom-made before installation." },
];

/**
 * FAQ that opens on hover with a mouse, and on tap or keyboard everywhere.
 * Clicking pins an answer open so it stays put when the pointer moves away.
 */
export default function Faq() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<Set<number>>(new Set());
  const base = useId();

  const toggle = (i: number) =>
    setPinned((p) => {
      const n = new Set(p);
      if (n.has(i)) n.delete(i); else n.add(i);
      return n;
    });

  return (
    <section style={{ background: '#EDE7DB' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '88px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(2rem, 3.6vw, 2.9rem)', lineHeight: 1.1 }}>
          Good questions, straight answers
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #D4CBB8' }} onPointerLeave={() => setHovered(null)}>
          {ITEMS.map((it, i) => {
            const open = pinned.has(i) || hovered === i;
            const id = `${base}-a${i}`;
            return (
              <div key={it.q}
                onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHovered(i); }}
                style={{ borderBottom: '1px solid #D4CBB8' }}>
                <h3 style={{ margin: 0 }}>
                  <button type="button" aria-expanded={open} aria-controls={id} onClick={() => toggle(i)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 0', minHeight: 44, border: 0, background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 17, fontWeight: 500, color: '#1C2326' }}>
                    <span>{it.q}</span>
                    <span aria-hidden="true" style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', border: `1px solid ${open ? '#1C2326' : '#C8BEA9'}`, background: open ? '#1C2326' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .25s, border-color .25s' }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" style={{ transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .3s ease' }}>
                        <path d="M6 1 V11 M1 6 H11" stroke={open ? '#F6F3EC' : '#1C2326'} strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div id={id} role="region" style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows .35s ease' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ margin: 0, padding: '0 48px 22px 0', fontSize: 15, fontWeight: 300, lineHeight: 1.65, color: '#3A4549', opacity: open ? 1 : 0, transition: 'opacity .3s ease' }}>{it.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
