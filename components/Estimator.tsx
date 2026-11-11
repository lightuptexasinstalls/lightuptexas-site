'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { readUtm, track } from './UtmCapture';
import { COVERAGE, HOME_SIZES, STORIES, OWNER, TIMING, HOA, SITE } from '@/config/site';
import { inServiceArea, perimeterFromHomeSize, coverageFeet, priceRange, money } from '@/lib/estimate';

type Lookup = 'idle' | 'searching' | 'found' | 'notfound';
type Roof = { totalFeet: number; center?: { lat: number; lng: number }; bbox?: { sw: { lat: number; lng: number }; ne: { lat: number; lng: number } } };
type Place = { address: string; lat: number; lng: number; zip: string };

const uid = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto) ? crypto.randomUUID() : 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);

const DEMO_FEET = 210;

export default function Estimator({ startZip = '', demo = false }: { startZip?: string; demo?: boolean }) {
  const z0 = startZip.replace(/\D/g, '').slice(0, 5);
  const [step, setStep] = useState(z0.length === 5 ? 2 : 1);
  const [zip, setZip] = useState(z0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState('');
  const [address, setAddress] = useState('');
  const [place, setPlace] = useState<Place | null>(null);
  const [suggest, setSuggest] = useState<{ id: string; text: string }[]>([]);
  const [lookup, setLookup] = useState<Lookup>('idle');
  const [roof, setRoof] = useState<Roof | null>(null);
  const [satOk, setSatOk] = useState(true);
  const [streetOk, setStreetOk] = useState(true);
  const [cover, setCover] = useState<number | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const [stories, setStories] = useState<number | null>(null);
  const [owner, setOwner] = useState<number | null>(null);
  const [timing, setTiming] = useState<number | null>(null);
  const [hoa, setHoa] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState('');
  const [touched, setTouched] = useState(false);

  const leadId = useRef('');
  const session = useRef(uid());
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => { leadId.current = uid(); track('ViewContent', { content_name: 'estimator' }); }, []);

  // ── address search (debounced) ──
  useEffect(() => {
    if (demo || place || address.trim().length < 4) { setSuggest([]); return; }
    const ctl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/places?q=${encodeURIComponent(address)}&session=${session.current}`, { signal: ctl.signal });
        const j = await r.json();
        setSuggest(j.suggestions || []);
      } catch {}
    }, 250);
    return () => { clearTimeout(t); ctl.abort(); };
  }, [address, place, demo]);

  const live = lookup === 'found';
  const digits = phone.replace(/\D/g, '');
  const zipDone = zip.length === 5;
  const inArea = zipDone && inServiceArea(zip);

  const totalFeet = live ? roof?.totalFeet ?? 0 : size !== null ? perimeterFromHomeSize(size, stories) : 0;
  const feet = cover !== null && totalFeet ? coverageFeet(totalFeet, cover) : 0;
  const range = stories !== null ? priceRange(feet, stories) : null;

  const ok: Record<number, boolean> = {
    1: zipDone,
    2: name.trim().length > 0 && digits.length >= 10 && /^\S+@\S+\.\S+$/.test(email.trim()) && consent,
    3: (live || lookup === 'notfound') && cover !== null && (live || size !== null),
    4: size !== null && stories !== null && owner !== null && timing !== null && hoa !== null,
  };

  const payload = (extra: Record<string, unknown> = {}) => ({
    id: leadId.current, website: honey, zip, first_name: name.trim(), phone: phone.trim(), email: email.trim(), consent,
    address: place?.address || address.trim(), lat: place?.lat ?? null, lng: place?.lng ?? null,
    home_found: lookup === 'found' ? true : lookup === 'notfound' ? false : null,
    roofline_ft: feet || null,
    coverage: cover !== null ? COVERAGE[cover].label : '',
    home_size: size !== null ? HOME_SIZES[size].label : '',
    stories: stories !== null ? STORIES[stories] : '', owner: owner !== null ? OWNER[owner] : '',
    timing: timing !== null ? TIMING[timing] : '', hoa: hoa !== null ? HOA[hoa] : '',
    utm: readUtm(), ...extra,
  });

  async function save(extra: Record<string, unknown>) {
    const r = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload(extra)) });
    if (!r.ok) throw new Error('save failed');
    return r.json();
  }

  function scrollTop() { try { topRef.current?.scrollIntoView({ block: 'start' }); window.scrollTo(0, 0); } catch {} }

  async function next() {
    setTouched(true);
    if (!ok[step] || saving) return;
    setSaveErr('');
    if (step === 2 || step === 3 || step === 4) {
      setSaving(true);
      try {
        await save({ stage: step === 2 ? 'contact' : step === 3 ? 'address' : 'complete' });
        if (step === 2) track('Lead');
        if (step === 4) track('CompleteRegistration', range ? { value: range.low, currency: 'USD' } : undefined);
      } catch {
        setSaving(false);
        if (step === 2) { setSaveErr('Something went wrong saving your info. Please check your connection and try again.'); return; }
        // later steps: still show them the next screen; the contact info is already saved
      }
      setSaving(false);
    }
    setTouched(false);
    setStep(step + 1);
    scrollTop();
  }

  async function choosePlace(s: { id: string; text: string }) {
    setSuggest([]);
    setAddress(s.text);
    setLookup('searching');
    try {
      const r = await fetch(`/api/places?id=${encodeURIComponent(s.id)}&session=${session.current}`);
      if (!r.ok) throw 0;
      const p: Place = await r.json();
      setPlace(p);
      session.current = uid(); // a new billing session for any further searches
      const rr = await fetch(`/api/roof?lat=${p.lat}&lng=${p.lng}`);
      const roofJ = await rr.json();
      if (roofJ.found) { setRoof(roofJ); setCover(2); setLookup('found'); }
      else { setRoof(null); setCover(null); setLookup('notfound'); }
    } catch {
      setLookup('notfound');
    }
  }

  function findDemo() {
    if (address.trim().length < 5) return;
    setLookup('searching');
    setTimeout(() => {
      if (/not ?found/i.test(address)) { setLookup('notfound'); setCover(null); return; }
      setPlace({ address: address.trim(), lat: 32.4487, lng: -99.7331, zip });
      setRoof({ totalFeet: DEMO_FEET });
      setCover(2);
      setLookup('found');
    }, 900);
  }

  function resetAddress() {
    setLookup('idle'); setAddress(''); setPlace(null); setRoof(null); setSize(null); setCover(null); setSatOk(true); setStreetOk(true);
  }

  const phoneShown = useMemo(() => {
    const d = digits.slice(-10);
    return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : phone;
  }, [digits, phone]);

  const storyLabel = stories !== null ? STORIES[stories] : '';
  const summary = live
    ? `About ${feet} ft of roofline · ${cover !== null ? COVERAGE[cover].label : ''} · ${storyLabel}`
    : `About ${feet} ft, estimated from your home’s size · ${cover !== null ? COVERAGE[cover].label : ''} · ${storyLabel}`;

  const showErr = (cond: boolean) => touched && cond;

  return (
    <main ref={topRef} style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px 72px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {step <= 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#4A5559' }}>
            <span>Step {step} of 4</span><span>Under 2 minutes</span>
          </div>
          <div style={{ height: 4, borderRadius: 4, background: '#E2DBCC', overflow: 'hidden' }} role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={4}>
            <div style={{ height: 4, width: `${step * 25}%`, background: '#1C2326', borderRadius: 4, transition: 'width .3s' }} />
          </div>
        </div>
      )}

      <form
        noValidate
        onSubmit={(e) => { e.preventDefault(); if (step <= 4) next(); }}
        style={{ background: '#fff', border: '1px solid #E2DBCC', borderRadius: 18, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}
      >
        {/* honeypot */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} className="sr-only" aria-hidden="true" />

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h1 className="est-h1">Where&apos;s the home?</h1>
              <p className="est-sub">Enter your ZIP code so we can check that we serve your area.</p>
            </div>
            <div className="est-field">
              <label htmlFor="zip" className="est-label">ZIP code</label>
              <input id="zip" className="est-input" style={{ maxWidth: 200 }} type="text" inputMode="numeric" autoComplete="postal-code" maxLength={5}
                value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))} autoFocus />
              {showErr(!zipDone) && <div className="err">Enter a 5-digit ZIP code.</div>}
            </div>
            {zipDone && inArea && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1C2326" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M8 12.5 L11 15.5 L16 9.5" /></svg>
                <span>Good news, we install in your area.</span>
              </div>
            )}
            {zipDone && !inArea && <div style={{ fontSize: 15, color: '#3A4549', lineHeight: 1.5 }}>We may not serve that area yet. Continue and we&apos;ll let you know.</div>}
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h1 className="est-h1">Who&apos;s this estimate for?</h1>
              <p className="est-sub">We&apos;ll email you a copy of your estimate, and a lighting specialist will reach out to answer any questions.</p>
            </div>
            <div className="est-field">
              <label htmlFor="firstname" className="est-label">First name</label>
              <input id="firstname" className="est-input" type="text" autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} />
              {showErr(!name.trim()) && <div className="err">Enter your first name.</div>}
            </div>
            <div className="est-field">
              <label htmlFor="phone" className="est-label">Mobile phone</label>
              <input id="phone" className="est-input" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              {showErr(digits.length < 10) && <div className="err">Enter a 10-digit phone number.</div>}
            </div>
            <div className="est-field">
              <label htmlFor="email" className="est-label">Email</label>
              <input id="email" className="est-input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {showErr(!/^\S+@\S+\.\S+$/.test(email.trim())) && <div className="err">Enter a valid email.</div>}
            </div>
            <label htmlFor="consent" style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 13, fontWeight: 300, lineHeight: 1.5, color: '#3A4549', cursor: 'pointer' }}>
              <input id="consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ width: 20, height: 20, margin: '1px 0 0', flexShrink: 0, accentColor: '#1C2326' }} />
              <span>By checking this box, I agree that Light Up Texas Installs LLC may contact me about my estimate by call, text, or email, including automated messages. Consent isn’t required to purchase. Message and data rates may apply. Reply STOP to opt out.</span>
            </label>
            {showErr(!consent) && <div className="err">Please check the box so we can contact you.</div>}
            {saveErr && <div className="err" role="alert">{saveErr}</div>}
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h1 className="est-h1">{live ? 'Choose what to light' : 'Let’s find your home'}</h1>
              <p className="est-sub">{live ? 'Here’s your home from above. Pick how much of the roofline you’d like lit.' : 'Enter your address and we’ll pull up your home from above.'}</p>
            </div>

            {!live && lookup !== 'notfound' && (
              <div className="est-field" style={{ position: 'relative' }}>
                <label htmlFor="addr" className="est-label">Street address</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <input id="addr" className="est-input" style={{ flex: '1 1 240px', width: 'auto', minWidth: 0 }} type="text" autoComplete="street-address"
                    placeholder="Start typing your address" value={address} role="combobox" aria-expanded={suggest.length > 0} aria-controls="addr-list"
                    onChange={(e) => { setAddress(e.target.value); setPlace(null); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (demo) findDemo(); else if (suggest[0]) choosePlace(suggest[0]); } }} />
                  {demo && (
                    <button type="button" className="btn-primary" style={{ borderRadius: 12, padding: '0 20px', fontSize: 15 }} disabled={address.trim().length < 5 || lookup === 'searching'} onClick={findDemo}>Find my home</button>
                  )}
                </div>
                {suggest.length > 0 && (
                  <ul id="addr-list" role="listbox" style={{ listStyle: 'none', margin: 0, padding: 6, position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 5, background: '#fff', border: '1px solid #D9D2C3', borderRadius: 12, boxShadow: '0 12px 30px rgba(0,0,0,.12)' }}>
                    {suggest.map((s) => (
                      <li key={s.id} role="option" aria-selected="false">
                        <button type="button" onClick={() => choosePlace(s)} style={{ width: '100%', textAlign: 'left', minHeight: 44, padding: '8px 12px', border: 0, background: 'none', fontSize: 15, cursor: 'pointer', borderRadius: 8 }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#F6F3EC')} onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}>{s.text}</button>
                      </li>
                    ))}
                    <li style={{ fontSize: 11, color: '#7A8487', padding: '4px 12px' }}>Powered by Google</li>
                  </ul>
                )}
                {demo && <div style={{ fontSize: 12, color: '#9B6B1F' }}>Demo mode (no Google key yet). Type any address. Include “not found” to test the fallback.</div>}
              </div>
            )}

            {lookup !== 'notfound' && (
              <HomeView lookup={lookup} demo={demo} place={place} roof={roof} satOk={satOk} onSatFail={() => setSatOk(false)} streetOk={streetOk} onStreetFail={() => setStreetOk(false)} />
            )}

            {live && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 14, color: '#3A4549' }}>{place?.address}</div>
                <div className="stack">
                  {COVERAGE.map((c, i) => (
                    <button key={c.key} type="button" className="opt opt-left" aria-pressed={cover === i} onClick={() => setCover(i)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                      <span>{c.label}</span><span style={{ fontWeight: 400, opacity: 0.85 }}>~{coverageFeet(roof!.totalFeet, i)} ft</span>
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 13, color: '#4A5559', lineHeight: 1.5 }}>
                  Measurements from above are approximate. <button type="button" className="link-btn" onClick={resetAddress}>Not your home?</button>
                </div>
              </div>
            )}

            {lookup === 'notfound' && (
              <div style={{ background: '#F6F3EC', border: '1px solid #E2DBCC', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>We couldn&apos;t pull up this home from above</h2>
                  <p className="est-sub">That&apos;s okay. Answer two quick questions and we&apos;ll still give you a ballpark. It&apos;ll just be a little less exact.</p>
                </div>
                <fieldset>
                  <legend>About how big is the home?</legend>
                  <div className="grid-2">
                    {HOME_SIZES.map((o, i) => <button key={o.label} type="button" className="opt" aria-pressed={size === i} onClick={() => setSize(i)}>{o.label}</button>)}
                  </div>
                </fieldset>
                <fieldset>
                  <legend>What would you like lit?</legend>
                  <div className="stack">
                    {COVERAGE.map((o, i) => <button key={o.key} type="button" className="opt opt-left" aria-pressed={cover === i} onClick={() => setCover(i)}>{o.label}</button>)}
                  </div>
                </fieldset>
                <button type="button" className="link-btn" style={{ alignSelf: 'flex-start', fontSize: 14 }} onClick={resetAddress}>Try a different address</button>
              </div>
            )}
            {showErr(!ok[3]) && <div className="err">{lookup === 'idle' || lookup === 'searching' ? 'Find your home first.' : 'Pick an option above.'}</div>}
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h1 className="est-h1">A few quick questions</h1>
            {live && <Choice legend="About how big is the home?" opts={HOME_SIZES.map((h) => h.label)} val={size} set={setSize} cls="grid-2" />}
            <Choice legend="How many stories?" opts={STORIES} val={stories} set={setStories} cls="grid-3" />
            <Choice legend="Do you own the home?" opts={OWNER} val={owner} set={setOwner} cls="grid-2" />
            <Choice legend="When would you like it installed?" opts={TIMING} val={timing} set={setTiming} cls="stack" left />
            <Choice legend="Is the home in an HOA?" opts={HOA} val={hoa} set={setHoa} cls="grid-3" />
            {showErr(!ok[4]) && <div className="err">Answer each question to see your price.</div>}
          </div>
        )}

        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.3em', color: '#5E6A6E' }}>YOUR BALLPARK PRICE</div>
              <div data-testid="price" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 'clamp(2.6rem, 8vw, 3.6rem)', lineHeight: 1 }}>
                {range ? `${money(range.low)} – ${money(range.high)}` : '—'}
              </div>
              <div style={{ fontSize: 15, color: '#3A4549' }}>{summary}</div>
            </div>

            <div style={{ background: '#F6F3EC', border: '1px solid #E2DBCC', borderRadius: 14, padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C2326" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="9" /><path d="M12 11 V16.5" /><path d="M12 7.5 V7.6" /></svg>
              <div style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.55 }}>
                <span style={{ fontWeight: 500 }}>This is a ballpark, not a quote.</span> It&apos;s based on {live ? 'your home as seen from above' : 'your home’s size'} and typical installs, to give you an idea of what lighting your home could cost. Your official price comes after a free in-person measurement.
              </div>
            </div>

            {!inArea && (
              <div style={{ fontSize: 14, lineHeight: 1.55, color: '#3A4549' }}>Your ZIP ({zip}) may be outside our usual service area. We&apos;ll confirm when we call.</div>
            )}

            <div style={{ background: '#141A1D', color: '#F3EEE4', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div aria-hidden="true" style={{ width: 52, height: 52, borderRadius: '50%', background: '#2A3438', border: '1.5px solid #C9A66B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E6D2A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21 C4 16.5 7.5 14 12 14 C16.5 14 20 16.5 20 21" /></svg>
                </div>
                <div style={{ fontSize: 16, lineHeight: 1.5 }}><b style={{ fontWeight: 500 }}>{SITE.specialistName}</b> will text you at <b style={{ fontWeight: 500 }}>{phoneShown}</b> in about 10 minutes.</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 500 }}>What happens next</h2>
              <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 15, fontWeight: 300, lineHeight: 1.55 }}>
                <li>On the call, we&apos;ll answer your questions and set up a free in-person measurement.</li>
                <li>You get your official price before any work begins. No obligation.</li>
              </ol>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/" className="btn-primary" style={{ minHeight: 48, padding: '0 22px', fontSize: 15 }}>Back to home</Link>
            </div>
          </div>
        )}

        {step <= 4 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            {step === 1 ? <Link href="/" style={{ fontSize: 15, color: '#3A4549' }}>Cancel</Link>
              : <button type="button" className="btn-ghost" onClick={() => { setTouched(false); setStep(step - 1); }}>Back</button>}
            <button type="submit" className="btn-primary" style={{ marginLeft: 'auto', opacity: ok[step] ? 1 : 0.4 }} aria-disabled={!ok[step]}>
              {saving ? 'Saving…' : step === 4 ? 'See my ballpark price' : 'Continue'}
            </button>
          </div>
        )}
      </form>
    </main>
  );
}

function Choice({ legend, opts, val, set, cls, left }: { legend: string; opts: string[]; val: number | null; set: (n: number) => void; cls: string; left?: boolean }) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <div className={cls}>
        {opts.map((o, i) => <button key={o} type="button" className={'opt' + (left ? ' opt-left' : '')} aria-pressed={val === i} onClick={() => set(i)}>{o}</button>)}
      </div>
    </fieldset>
  );
}

/* ── The home photo: street level when available, then satellite, otherwise nothing ── */

function HomeView({ lookup, demo, place, roof, satOk, onSatFail, streetOk, onStreetFail }: { lookup: Lookup; demo: boolean; place: Place | null; roof: Roof | null; satOk: boolean; onSatFail: () => void; streetOk: boolean; onStreetFail: () => void }) {
  const live = lookup === 'found';
  const useStreet = live && !demo && place && streetOk;
  const useSat = live && !demo && place && !streetOk && satOk;
  if (lookup === 'searching') return <div role="status" style={{ fontSize: 15, color: '#3A4549' }}>Finding your home…</div>;
  // No street or satellite photo for this home: show nothing rather than a stand-in drawing.
  if (!place || !(useStreet || useSat)) return null;
  const c = roof?.center || { lat: place.lat, lng: place.lng };
  return (
    <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', background: '#34423A', aspectRatio: '640 / 400' }}>
      {useStreet ? (
        <img src={`/api/streetview?lat=${place.lat}&lng=${place.lng}`} alt={`Street view of ${place.address}`} onError={onStreetFail}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <img src={`/api/satellite?lat=${c.lat}&lng=${c.lng}&z=20`} alt={`Satellite view of ${place.address}`} onError={onSatFail}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      )}
      <div style={{ position: 'absolute', bottom: 6, right: 8, fontSize: 10, color: '#fff', opacity: 0.85 }}>Imagery ©Google</div>
      <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(14,19,21,.75)', color: '#F3EEE4', fontSize: 12, padding: '5px 10px', borderRadius: 999 }}>Your home</div>
    </div>
  );
}

