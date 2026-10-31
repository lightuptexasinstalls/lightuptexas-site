import SiteHeader from '@/components/SiteHeader';
import ColorScenes from '@/components/ColorScenes';
import HeavyScroll from '@/components/HeavyScroll';
import { SITE } from '@/config/site';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#F6F3EC', color: '#1C2326' }}>
      <HeavyScroll />
      <SiteHeader />
      <main>
        <section style={{position: 'relative', background: '#1B2630', color: '#F3EEE4', overflow: 'hidden'}}>
          <img className="hero-img" src="/images/hero.jpg" fetchPriority="high" alt="A white stone and stucco Texas home at twilight, its rooflines glowing warm white from lighting hidden under the eaves" style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'cover', objectPosition: '70% center', display: 'block'}} />
          <div className="hero-shade" aria-hidden="true" style={{position: 'absolute', top: '0', right: '0', bottom: '0', left: '0', background: 'linear-gradient(90deg, rgba(14, 19, 21, 0.85) 0%, rgba(14, 19, 21, 0.6) 40%, rgba(14, 19, 21, 0.12) 65%, rgba(14, 19, 21, 0) 100%)'}}></div>
          <div style={{position: 'relative', padding: '112px 24px 128px max(24px, 5vw)', minHeight: 'clamp(601px, 51.9vw + 30px, 777px)', boxSizing: 'border-box', display: 'flex', alignItems: 'center'}}>
            <div style={{flex: '0 1 760px', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '22px'}}>
              
              <h1 style={{margin: '0', fontFamily: "'Cormorant Garamond', serif", fontWeight: '300', fontSize: 'clamp(2.6rem, 5vw, 4.25rem)', lineHeight: 1.04}}><span style={{display: 'block'}}>Your home, beautifully lit.</span><span style={{display: 'block', fontStyle: 'italic', color: 'rgb(230, 210, 166)'}}>Every night of the year.</span></h1>
              <p style={{margin: '0', maxWidth: '480px', fontSize: '18px', fontWeight: '300', lineHeight: 1.6, color: '#DDE1E2'}}>Lighting that hides under your eaves by day and glows any color of your choice by night, all controlled from your phone.</p>
              <form action="/estimate" method="get" style={{background: '#F6F3EC', color: '#1C2326', borderRadius: '18px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '460px', boxShadow: '0 18px 50px rgba(0, 0, 0, 0.35)'}}>
                <label htmlFor="hero-zip" style={{fontSize: '15px', fontWeight: '500'}}>Receive an estimate in &lt;2 minutes</label>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                  <input id="hero-zip" type="text" inputMode="numeric" autoComplete="postal-code" maxLength={5} placeholder="Enter your ZIP code" name="zip" required pattern="[0-9]{5}" title="5-digit ZIP code" style={{flex: '1 1 180px', minWidth: '0', minHeight: '52px', padding: '0 16px', border: '1.5px solid #D9D2C3', borderRadius: '12px', fontFamily: "'Jost', sans-serif", fontSize: '16px', color: '#1C2326', background: '#FFFFFF', boxSizing: 'border-box'}} />
                  <button type="submit" style={{flex: '0 0 auto', minHeight: '52px', padding: '0 26px', borderRadius: '12px', border: '0', background: '#1C2326', color: '#F6F3EC', fontFamily: "'Jost', sans-serif", fontSize: '16px', fontWeight: '500', letterSpacing: '0.02em', cursor: 'pointer'}}>See My Price</button>
                </div>
                <div style={{fontSize: '13px', color: '#4A5559'}}>Free · No Obligation&nbsp;</div>
              </form>
            </div>
          </div>
        </section>
      
        <section style={{background: '#FFFFFF', borderBottom: '1px solid #E2DBCC'}}>
          <div style={{maxWidth: '1120px', margin: '0 auto', padding: '22px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '16px 32px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C2326" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 L19 6 V11 C19 15.5 16 19 12 21 C8 19 5 15.5 5 11 V6 Z" /><path d="M9 12 L11 14 L15 10" /></svg>
              <span>Certified Lumenary Pro Installer</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C2326" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="5" /><path d="M9 13.5 L8 21 L12 19 L16 21 L15 13.5" /></svg>
              <span>100,000+hr LED Rating</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1C2326" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21 C12 21 5 14.5 5 9.5 A7 7 0 0 1 19 9.5 C19 14.5 12 21 12 21 Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
              <span>Locally owned in Abilene, Texas</span>
            </div>
          </div>
        </section>
      
      <ColorScenes />
      
        <section style={{maxWidth: '1120px', margin: '0 auto', padding: '88px 24px 80px', display: 'flex', flexDirection: 'column', gap: '36px'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '640px'}}>
            
            <h2 style={{margin: '0', fontFamily: "'Cormorant Garamond', serif", fontWeight: '300', fontSize: 'clamp(2rem, 3.6vw, 2.9rem)', lineHeight: 1.1}}>Invisible by day. <br />Unforgettable by night.</h2>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
            <figure style={{margin: '0', display: 'flex', flexDirection: 'column', gap: '14px'}}>
              <img src="/images/by-day.jpg" alt="Looking up at the corner of a brick home in daylight, with a row of small, evenly spaced light lenses barely visible along the white soffit" style={{width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', objectPosition: 'center', borderRadius: '16px', display: 'block'}} />
              <figcaption style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                <span style={{fontSize: '12px', fontWeight: '500', letterSpacing: '0.25em', color: '#5E6A6E'}}>BY DAY</span>
                <span style={{fontSize: '16px', fontWeight: '300', lineHeight: 1.55, color: '#3A4549'}}>A slim track, color-matched to your trim, tucks under the roofline. All you'll notice are small, evenly spaced lenses.</span>
              </figcaption>
            </figure>
            <figure style={{margin: '0', display: 'flex', flexDirection: 'column', gap: '14px'}}>
              <img src="/images/by-night.jpg" alt="A brick ranch home at dusk with rows of small warm-white lights along its gables and eaves, casting soft pools of light down the brick" style={{width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', objectPosition: 'center', borderRadius: '16px', display: 'block'}} />
              <figcaption style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                <span style={{fontSize: '12px', fontWeight: '500', letterSpacing: '0.25em', color: '#5E6A6E'}}>BY NIGHT</span>
                <span style={{fontSize: '16px', fontWeight: '300', lineHeight: 1.55, color: '#3A4549'}}>A seamless glow traces every roofline, in warm white, cool white or any color you pick.</span>
              </figcaption>
            </figure>
          </div>
        </section>
      
        <section style={{background: '#0E0E0E', color: '#F3EEE4'}}>
          <div style={{maxWidth: '1120px', margin: '0 auto', padding: '96px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '48px'}}>
            <div style={{flex: '1 1 380px', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '28px'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                
                <h2 style={{margin: '0', fontFamily: "'Cormorant Garamond', serif", fontWeight: '300', fontSize: 'clamp(2rem, 3.6vw, 2.9rem)', lineHeight: 1.1, color: '#f3eee4'}}>Your lights.&nbsp;<span style={{color: 'rgb(230, 210, 166)'}}>Your phone.&nbsp;</span><span style={{fontStyle: 'italic', color: 'rgb(230, 210, 166)'}}>Your control.</span></h2>
                <p style={{margin: '0', fontSize: '17px', fontWeight: '300', lineHeight: 1.6, color: '#C9CFD0'}}>Pick a scene, dial in the brightness, or set a schedule once and let it run for you automatically.</p>
              </div>
              <dl style={{margin: '0', display: 'flex', flexDirection: 'column', borderTop: '1px solid #2A3438'}}>
                <div style={{display: 'grid', gridTemplateColumns: 'minmax(110px, 0.8fr) minmax(0, 2fr)', gap: '16px', padding: '16px 0', borderBottom: '1px solid #2A3438'}}>
                  <dt style={{fontSize: '12px', fontWeight: '500', letterSpacing: '0.2em', color: '#9AA5A8', paddingTop: '3px'}}>COLOR</dt>
                  <dd style={{margin: '0', fontSize: '15px', lineHeight: 1.55, color: '#DDE1E2'}}>16 million colors, plus separate warm-white and cool-white LEDs for whites that look truly white</dd>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'minmax(110px, 0.8fr) minmax(0, 2fr)', gap: '16px', padding: '16px 0', borderBottom: '1px solid #2A3438'}}>
                  <dt style={{fontSize: '12px', fontWeight: '500', letterSpacing: '0.2em', color: '#9AA5A8', paddingTop: '3px'}}>EFFECTS</dt>
                  <dd style={{margin: '0', fontSize: '15px', lineHeight: 1.55, color: '#DDE1E2'}}>Animations, color sequences and lights that move to your music</dd>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'minmax(110px, 0.8fr) minmax(0, 2fr)', gap: '16px', padding: '16px 0', borderBottom: '1px solid #2A3438'}}>
                  <dt style={{fontSize: '12px', fontWeight: '500', letterSpacing: '0.2em', color: '#9AA5A8', paddingTop: '3px'}}>SCHEDULES</dt>
                  <dd style={{margin: '0', fontSize: '15px', lineHeight: 1.55, color: '#DDE1E2'}}>Set your on and off times once, and they run on their own all year</dd>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'minmax(110px, 0.8fr) minmax(0, 2fr)', gap: '16px', padding: '16px 0', borderBottom: '1px solid #2A3438'}}>
                  <dt style={{fontSize: '12px', fontWeight: '500', letterSpacing: '0.2em', color: '#9AA5A8', paddingTop: '3px'}}>CONNECTION</dt>
                  <dd style={{margin: '0', fontSize: '15px', lineHeight: 1.55, color: '#DDE1E2'}}>Works over your home Wi-Fi or Bluetooth</dd>
                </div>
              </dl>
            </div>
            <div style={{flex: '0 1 360px', minWidth: '0', margin: '0 auto', display: 'flex', justifyContent: 'center', order: -1}}>
              <img src="/images/phone-app.jpg" alt="The lighting app on a phone, showing a color wheel, brightness and white-tone sliders, color presets, and tabs for patterns, music and timers" style={{width: '100%', maxWidth: '360px', height: 'auto', display: 'block'}} />
            </div>
          </div>
        </section>
      
        <section style={{background: '#EDE7DB'}}>
          <div style={{maxWidth: '1120px', margin: '0 auto', padding: '88px 24px', display: 'flex', flexDirection: 'column', gap: '40px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '800px'}}>
              
              <h2 style={{margin: '0', fontFamily: "'Cormorant Garamond', serif", fontWeight: '300', fontSize: 'clamp(2rem, 3.6vw, 2.9rem)', lineHeight: 1.1, maxWidth: '800px'}}>Christmas lights cost you every year. <br />Permanent lighting is a <i>one-time&nbsp;</i><span style={{fontStyle: 'italic'}}>investment.</span></h2>
              
            </div>
      
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'stretch'}}>
              <div style={{background: '#F6F3EC', border: '1px solid #D9D2C3', borderRadius: '18px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <h3 style={{margin: '0', fontSize: '18px', fontWeight: '500', color: '#4A5559'}}>Seasonal Christmas lights</h3>
                  <div style={{fontSize: '13px', letterSpacing: '0.2em', color: '#5E6A6E'}}>A YEARLY EXPENSE</div>
                </div>
                <ul style={{margin: '0', padding: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <li style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A8487" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{flexShrink: '0', marginTop: '2px'}}><path d="M6 6 L18 18 M18 6 L6 18" /></svg>
                    <span style={{fontSize: '15px', lineHeight: 1.5, color: '#3A4549'}}><span style={{fontWeight: '500', color: 'rgb(28, 35, 38)'}}>Cost:</span> paid again every season, in money and in time</span>
                  </li>
                  <li style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A8487" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{flexShrink: '0', marginTop: '2px'}}><path d="M6 6 L18 18 M18 6 L6 18" /></svg>
                    <span style={{fontSize: '15px', lineHeight: 1.5, color: '#3A4549'}}><span style={{fontWeight: '500', color: '#1C2326'}}>Installation:</span> a ladder, a bag of clips and a weekend, every single year</span>
                  </li>
                  <li style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A8487" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{flexShrink: '0', marginTop: '2px'}}><path d="M6 6 L18 18 M18 6 L6 18" /></svg>
                    <span style={{fontSize: '15px', lineHeight: 1.5, color: '#3A4549'}}><span style={{fontWeight: '500', color: '#1C2326'}}>In daylight:</span> wires and clips on display, or empty hooks left up all year</span>
                  </li>
                  <li style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A8487" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{flexShrink: '0', marginTop: '2px'}}><path d="M6 6 L18 18 M18 6 L6 18" /></svg>
                    <span style={{fontSize: '15px', lineHeight: 1.5, color: '#3A4549'}}><span style={{fontWeight: '500', color: '#1C2326'}}>Colors:</span> whatever the box says, for the whole season</span>
                  </li>
                  <li style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A8487" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{flexShrink: '0', marginTop: '2px'}}><path d="M6 6 L18 18 M18 6 L6 18" /></svg>
                    <span style={{fontSize: '15px', lineHeight: 1.5, color: '#3A4549'}}><span style={{fontWeight: '500', color: '#1C2326'}}>When it's on:</span> a few weeks in December</span>
                  </li>
                  <li style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A8487" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{flexShrink: '0', marginTop: '2px'}}><path d="M6 6 L18 18 M18 6 L6 18" /></svg>
                    <span style={{fontSize: '15px', lineHeight: 1.5, color: '#3A4549'}}><span style={{fontWeight: '500', color: '#1C2326'}}>Control:</span> an extension cord and a plug-in timer</span>
                  </li>
                  <li style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A8487" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{flexShrink: '0', marginTop: '2px'}}><path d="M6 6 L18 18 M18 6 L6 18" /></svg>
                    <span style={{fontSize: '15px', lineHeight: 1.5, color: '#3A4549'}}><span style={{fontWeight: '500', color: '#1C2326'}}>Lifespan:</span> bulbs burn out and strands tangle in storage</span>
                  </li>
                  <li style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A8487" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{flexShrink: '0', marginTop: '2px'}}><path d="M6 6 L18 18 M18 6 L6 18" /></svg>
                    <span style={{fontSize: '15px', lineHeight: 1.5, color: '#3A4549'}}><span style={{fontWeight: '500', color: '#1C2326'}}>Safety:</span> ladder climbs and extension cords across the lawn</span>
                  </li>
                </ul>
              </div>
      
              <div style={{background: '#141A1D', color: '#F3EEE4', borderRadius: '18px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 50px rgba(20, 26, 29, 0.25)'}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  <h3 style={{margin: '0', fontSize: '18px', fontWeight: '500', color: '#E6D2A6'}}>Our Permanent Lighting</h3>
                  <div style={{fontSize: '13px', letterSpacing: '0.2em', color: '#C9CFD0'}}>A LASTING INVESTMENT</div>
                </div>
                <ul style={{margin: '0', padding: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <li style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E6D2A6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink: '0', marginTop: '2px'}}><path d="M5 12.5 L10 17 L19 7" /></svg>
                    <span style={{fontSize: '15px', lineHeight: 1.5, color: '#DDE1E2'}}><span style={{fontWeight: '500', color: '#F3EEE4'}}>Cost:</span> a one-time investment that upgrades your home all year</span>
                  </li>
                  <li style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E6D2A6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink: '0', marginTop: '2px'}}><path d="M5 12.5 L10 17 L19 7" /></svg>
                    <span style={{fontSize: '15px', lineHeight: 1.5, color: '#DDE1E2'}}><span style={{fontWeight: '500', color: '#F3EEE4'}}>Installation:</span> done once by a certified crew, usually in a single day</span>
                  </li>
                  <li style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E6D2A6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink: '0', marginTop: '2px'}}><path d="M5 12.5 L10 17 L19 7" /></svg>
                    <span style={{fontSize: '15px', lineHeight: 1.5, color: '#DDE1E2'}}><span style={{fontWeight: '500', color: '#F3EEE4'}}>In daylight:</span> a slim track matched to your trim, with only small lenses showing</span>
                  </li>
                  <li style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E6D2A6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink: '0', marginTop: '2px'}}><path d="M5 12.5 L10 17 L19 7" /></svg>
                    <span style={{fontSize: '15px', lineHeight: 1.5, color: '#DDE1E2'}}><span style={{fontWeight: '500', color: '#F3EEE4'}}>Colors:</span> 16 million options, plus true warm white and cool white</span>
                  </li>
                  <li style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E6D2A6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink: '0', marginTop: '2px'}}><path d="M5 12.5 L10 17 L19 7" /></svg>
                    <span style={{fontSize: '15px', lineHeight: 1.5, color: '#DDE1E2'}}><span style={{fontWeight: '500', color: '#F3EEE4'}}>When it's on:</span> every holiday, game day and ordinary evening, all year long</span>
                  </li>
                  <li style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E6D2A6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink: '0', marginTop: '2px'}}><path d="M5 12.5 L10 17 L19 7" /></svg>
                    <span style={{fontSize: '15px', lineHeight: 1.5, color: '#DDE1E2'}}><span style={{fontWeight: '500', color: '#F3EEE4'}}>Control:</span> a phone app with schedules, animations and music sync</span>
                  </li>
                  <li style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E6D2A6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink: '0', marginTop: '2px'}}><path d="M5 12.5 L10 17 L19 7" /></svg>
                    <span style={{fontSize: '15px', lineHeight: 1.5, color: '#DDE1E2'}}><span style={{fontWeight: '500', color: '#F3EEE4'}}>Lifespan:</span> LEDs rated for more than 100,000 hours of use</span>
                  </li>
                  <li style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E6D2A6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink: '0', marginTop: '2px'}}><path d="M5 12.5 L10 17 L19 7" /></svg>
                    <span style={{fontSize: '15px', lineHeight: 1.5, color: '#DDE1E2'}}><span style={{fontWeight: '500', color: '#F3EEE4'}}>Safety:</span> UL-certified, fused and fire-rated, built for Texas weather</span>
                  </li>
                </ul>
              </div>
            </div>
      
          </div>
        </section>
      
        <section style={{background: '#141A1D', color: '#F3EEE4'}}>
          <div style={{maxWidth: '1120px', margin: '0 auto', padding: '88px 24px', display: 'flex', flexDirection: 'column', gap: '40px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '680px'}}>
              <div style={{fontSize: '12px', fontWeight: '500', letterSpacing: '0.3em', color: '#E6D2A6'}}>PEACE OF MIND</div>
              <h2 style={{margin: '0', fontFamily: "'Cormorant Garamond', serif", fontWeight: '300', fontSize: 'clamp(2rem, 3.6vw, 2.9rem)', lineHeight: 1.1}}>A home that never sits in the dark.</h2>
              <p style={{margin: '0', fontSize: '17px', fontWeight: '300', lineHeight: 1.6, color: '#C9CFD0'}}>A dark house looks empty. Permanent lighting keeps your home bright and lively every night, even when you aren't home.</p>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <div aria-hidden="true" style={{height: '8px', marginBottom: '8px', backgroundImage: 'radial-gradient(circle at 4px 4px, #FFD9A0 0 2px, transparent 3px), radial-gradient(circle at 13px 4px, #FFD9A0 0 2px, transparent 3px)', backgroundSize: '18px 8px', backgroundRepeat: 'repeat-x', filter: 'drop-shadow(0 0 2px #FFD9A0) drop-shadow(0 0 4px #FFD9A0)'}}></div>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E6D2A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="13" r="8" /><path d="M12 9 V13 L15 15" /><path d="M9 2.5 H15" /></svg>
                <h3 style={{margin: '0', fontSize: '18px', fontWeight: '500'}}>On at dusk, every night</h3>
                <p style={{margin: '0', fontSize: '15px', fontWeight: '300', lineHeight: 1.6, color: '#C9CFD0'}}>Set a schedule once and your lights turn on by themselves, all year.</p>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <div aria-hidden="true" style={{height: '8px', marginBottom: '8px', backgroundImage: 'radial-gradient(circle at 4px 4px, #FF3B3B 0 2px, transparent 3px), radial-gradient(circle at 13px 4px, #2BD46B 0 2px, transparent 3px)', backgroundSize: '18px 8px', backgroundRepeat: 'repeat-x', filter: 'drop-shadow(0 0 2px #FF3B3B) drop-shadow(0 0 4px #2BD46B)'}}></div>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E6D2A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 21 H21" /><path d="M5 21 V11 L12 5 L19 11 V21" /><path d="M10 21 V15 H14 V21" /></svg>
                <h3 style={{margin: '0', fontSize: '18px', fontWeight: '500'}}>Lively while you're away</h3>
                <p style={{margin: '0', fontSize: '15px', fontWeight: '300', lineHeight: 1.6, color: '#C9CFD0'}}>Traveling for the weekend or the whole summer? Your schedule keeps running, so the house never looks vacant.</p>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <div aria-hidden="true" style={{height: '8px', marginBottom: '8px', backgroundImage: 'radial-gradient(circle at 4px 4px, #4F8BFF 0 2px, transparent 3px), radial-gradient(circle at 13px 4px, #F3F3F3 0 2px, transparent 3px)', backgroundSize: '18px 8px', backgroundRepeat: 'repeat-x', filter: 'drop-shadow(0 0 2px #4F8BFF) drop-shadow(0 0 4px #F3F3F3)'}}></div>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E6D2A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
                <h3 style={{margin: '0', fontSize: '18px', fontWeight: '500'}}>Bright white when you want it</h3>
                <p style={{margin: '0', fontSize: '15px', fontWeight: '300', lineHeight: 1.6, color: '#C9CFD0'}}>Switch from a soft glow to crisp cool white for clear, even light along every roofline.</p>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <div aria-hidden="true" style={{height: '8px', marginBottom: '8px', backgroundImage: 'radial-gradient(circle at 4px 4px, #FF4F8B 0 2px, transparent 3px), radial-gradient(circle at 13px 4px, #FFC2D4 0 2px, transparent 3px)', backgroundSize: '18px 8px', backgroundRepeat: 'repeat-x', filter: 'drop-shadow(0 0 2px #FF4F8B) drop-shadow(0 0 4px #FFC2D4)'}}></div>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E6D2A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3 L19 6 V11 C19 15.5 16 19 12 21 C8 19 5 15.5 5 11 V6 Z" /><path d="M9 12 L11 14 L15 10" /></svg>
                <h3 style={{margin: '0', fontSize: '18px', fontWeight: '500'}}>Built safe from the start</h3>
                <p style={{margin: '0', fontSize: '15px', fontWeight: '300', lineHeight: 1.6, color: '#C9CFD0'}}>UL-certified, fused electrical components and fire-rated parts, sealed for outdoor use.</p>
              </div>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                <div aria-hidden="true" style={{height: '8px', marginBottom: '8px', backgroundImage: 'radial-gradient(circle at 4px 4px, #FF3B3B 0 2px, transparent 3px), radial-gradient(circle at 13px 4px, #2BD46B 0 2px, transparent 3px)', backgroundSize: '18px 8px', backgroundRepeat: 'repeat-x', filter: 'drop-shadow(0 0 2px #FF3B3B) drop-shadow(0 0 4px #2BD46B)'}}></div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '40px', fontWeight: '400', lineHeight: 1, color: '#F3EEE4'}}>16 million</div>
                <div style={{fontSize: '14px', color: '#C9CFD0'}}>colors, plus warm and cool white</div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                <div aria-hidden="true" style={{height: '8px', marginBottom: '8px', backgroundImage: 'radial-gradient(circle at 4px 4px, #4E2683 0 2px, transparent 3px), radial-gradient(circle at 13px 4px, #C5C6C8 0 2px, transparent 3px)', backgroundSize: '18px 8px', backgroundRepeat: 'repeat-x', filter: 'drop-shadow(0 0 2px #4E2683) drop-shadow(0 0 4px #C5C6C8)'}}></div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '40px', fontWeight: '400', lineHeight: 1, color: '#F3EEE4'}}>100,000+</div>
                <div style={{fontSize: '14px', color: '#C9CFD0'}}>hour LED rating</div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                <div aria-hidden="true" style={{height: '8px', marginBottom: '8px', backgroundImage: 'radial-gradient(circle at 4px 4px, #FF3B3B 0 2px, transparent 3px), radial-gradient(circle at 13px 4px, #4F8BFF 0 2px, transparent 3px)', backgroundSize: '18px 8px', backgroundRepeat: 'repeat-x', filter: 'drop-shadow(0 0 2px #FF3B3B) drop-shadow(0 0 4px #4F8BFF)'}}></div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '40px', fontWeight: '400', lineHeight: 1, color: '#F3EEE4'}}>&lt; 200 W</div>
                <div style={{fontSize: '14px', color: '#C9CFD0'}}>to light a whole home, less than one old bulb</div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                <div aria-hidden="true" style={{height: '8px', marginBottom: '8px', backgroundImage: 'radial-gradient(circle at 4px 4px, #FF8A1F 0 2px, transparent 3px), radial-gradient(circle at 13px 4px, #A855F7 0 2px, transparent 3px)', backgroundSize: '18px 8px', backgroundRepeat: 'repeat-x', filter: 'drop-shadow(0 0 2px #FF8A1F) drop-shadow(0 0 4px #A855F7)'}}></div>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '40px', fontWeight: '400', lineHeight: 1, color: '#F3EEE4'}}>1 day</div>
                <div style={{fontSize: '14px', color: '#C9CFD0'}}>typical install is one and done</div>
              </div>
            </div>
          </div>
        </section>
      
        <section id="how" style={{background: '#F6F3EC'}}>
          <div style={{maxWidth: '1120px', margin: '0 auto', padding: '88px 24px', display: 'flex', flexDirection: 'column', gap: '40px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              
              <h2 style={{margin: '0', fontFamily: "'Cormorant Garamond', serif", fontWeight: '300', fontSize: 'clamp(2rem, 3.6vw, 2.9rem)', lineHeight: 1.1}}>How It Works</h2>
            </div>
            <ol style={{margin: '0', padding: '0', listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px 28px'}}>
              <li style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                  <div style={{width: '52px', height: '52px', flexShrink: '0', borderRadius: '50%', border: '1px solid #C9A66B', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: '400', color: '#1C2326', boxShadow: '0 0 0 6px #F6F3EC, 0 0 22px rgba(201, 166, 107, 0.35)'}}>01</div>
                  <div aria-hidden="true" style={{flex: '1', height: '1px', background: 'linear-gradient(90deg, #C9A66B 0%, rgba(201, 166, 107, 0.15) 100%)'}}></div>
                </div>
                <h3 style={{margin: '4px 0 0', fontSize: '19px', fontWeight: '500'}}>See your price</h3>
                <p style={{margin: '0', fontSize: '15px', fontWeight: '300', lineHeight: 1.6, color: '#3A4549'}}>Enter your ZIP and address, choose what you'd like lit, and get a ballpark price in under 2 minutes.</p>
              </li>
              <li style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                  <div style={{width: '52px', height: '52px', flexShrink: '0', borderRadius: '50%', border: '1px solid #C9A66B', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: '400', color: '#1C2326', boxShadow: '0 0 0 6px #F6F3EC, 0 0 22px rgba(201, 166, 107, 0.35)'}}>02</div>
                  <div aria-hidden="true" style={{flex: '1', height: '1px', background: 'linear-gradient(90deg, #C9A66B 0%, rgba(201, 166, 107, 0.15) 100%)'}}></div>
                </div>
                <h3 style={{margin: '4px 0 0', fontSize: '19px', fontWeight: '500'}}>We give you a call</h3>
                <p style={{margin: '0', fontSize: '15px', fontWeight: '300', lineHeight: 1.6, color: '#3A4549'}}>A lighting specialist calls to answer your questions and set up a visit.</p>
              </li>
              <li style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                  <div style={{width: '52px', height: '52px', flexShrink: '0', borderRadius: '50%', border: '1px solid #C9A66B', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: '400', color: '#1C2326', boxShadow: '0 0 0 6px #F6F3EC, 0 0 22px rgba(201, 166, 107, 0.35)'}}>03</div>
                  <div aria-hidden="true" style={{flex: '1', height: '1px', background: 'linear-gradient(90deg, #C9A66B 0%, rgba(201, 166, 107, 0.15) 100%)'}}></div>
                </div>
                <h3 style={{margin: '4px 0 0', fontSize: '19px', fontWeight: '500'}}>Free in-person measurement</h3>
                <p style={{margin: '0', fontSize: '15px', fontWeight: '300', lineHeight: 1.6, color: '#3A4549'}}>We measure your roofline in person and give you your official price before any work begins.</p>
              </li>
              <li style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                  <div style={{width: '52px', height: '52px', flexShrink: '0', borderRadius: '50%', border: '1px solid #C9A66B', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: '400', color: '#1C2326', boxShadow: '0 0 0 6px #F6F3EC, 0 0 22px rgba(201, 166, 107, 0.35)'}}>04</div>
                </div>
                <h3 style={{margin: '4px 0 0', fontSize: '19px', fontWeight: '500'}}>Lit in a day</h3>
                <p style={{margin: '0', fontSize: '15px', fontWeight: '300', lineHeight: 1.6, color: '#3A4549'}}>Your track is custom-cut for your home, and then our crew installs it and walks you through the app.</p>
              </li>
            </ol>
          </div>
        </section>
      
        <section style={{maxWidth: '800px', margin: '0 auto', padding: '88px 24px', display: 'flex', flexDirection: 'column', gap: '28px'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <h2 style={{margin: '0', fontFamily: "'Cormorant Garamond', serif", fontWeight: '300', fontSize: 'clamp(2rem, 3.6vw, 2.9rem)', lineHeight: 1.1}}>Good questions, straight answers</h2>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', borderTop: '1px solid #D9D2C3'}}>
            <details style={{borderBottom: '1px solid #D9D2C3', padding: '18px 0'}}>
              <summary style={{cursor: 'pointer', fontSize: '17px', fontWeight: '500', minHeight: '28px'}}>Can you see the lights during the day?</summary>
              <p style={{margin: '12px 0 0', fontSize: '15px', fontWeight: '300', lineHeight: 1.65, color: '#3A4549'}}>Barely. The track is cut to fit your home and comes in hundreds of colors to match your soffit and fascia. In daylight, most people only notice small, evenly spaced lenses.</p>
            </details>
            <details style={{borderBottom: '1px solid #D9D2C3', padding: '18px 0'}}>
              <summary style={{cursor: 'pointer', fontSize: '17px', fontWeight: '500', minHeight: '28px'}}>Will it work on my house?</summary>
              <p style={{margin: '12px 0 0', fontSize: '15px', fontWeight: '300', lineHeight: 1.65, color: '#3A4549'}}>Almost certainly. Every track is custom-made for the home, including houses with gutters in front of the soffit, no soffit at all, stucco, or unusual rooflines. We confirm the details at your free in-person measurement.</p>
            </details>
            <details style={{borderBottom: '1px solid #D9D2C3', padding: '18px 0'}}>
              <summary style={{cursor: 'pointer', fontSize: '17px', fontWeight: '500', minHeight: '28px'}}>Will installation damage my roof?</summary>
              <p style={{margin: '12px 0 0', fontSize: '15px', fontWeight: '300', lineHeight: 1.65, color: '#3A4549'}}>[ANSWER TO CONFIRM WITH CLIENT: how the track is mounted]</p>
            </details>
            <details style={{borderBottom: '1px solid #D9D2C3', padding: '18px 0'}}>
              <summary style={{cursor: 'pointer', fontSize: '17px', fontWeight: '500', minHeight: '28px'}}>How long does installation take?</summary>
              <p style={{margin: '12px 0 0', fontSize: '15px', fontWeight: '300', lineHeight: 1.65, color: '#3A4549'}}>Your track is made to measure first. Once it's ready, most homes are installed in a single day, and we walk you through the app before we leave.</p>
            </details>
            <details style={{borderBottom: '1px solid #D9D2C3', padding: '18px 0'}}>
              <summary style={{cursor: 'pointer', fontSize: '17px', fontWeight: '500', minHeight: '28px'}}>How long will the lights last?</summary>
              <p style={{margin: '12px 0 0', fontSize: '15px', fontWeight: '300', lineHeight: 1.65, color: '#3A4549'}}>The LEDs are rated for more than 100,000 hours, built for years of nightly use outdoors.</p>
            </details>
            <details style={{borderBottom: '1px solid #D9D2C3', padding: '18px 0'}}>
              <summary style={{cursor: 'pointer', fontSize: '17px', fontWeight: '500', minHeight: '28px'}}>Is it expensive to run?</summary>
              <p style={{margin: '12px 0 0', fontSize: '15px', fontWeight: '300', lineHeight: 1.65, color: '#3A4549'}}>No. Lighting an entire home draws less power than a single 200-watt bulb.</p>
            </details>
            <details style={{borderBottom: '1px solid #D9D2C3', padding: '18px 0'}}>
              <summary style={{cursor: 'pointer', fontSize: '17px', fontWeight: '500', minHeight: '28px'}}>What's the warranty?</summary>
              <p style={{margin: '12px 0 0', fontSize: '15px', fontWeight: '300', lineHeight: 1.65, color: '#3A4549'}}>[WARRANTY DETAILS TO CONFIRM WITH CLIENT]</p>
            </details>
            <details style={{borderBottom: '1px solid #D9D2C3', padding: '18px 0'}}>
              <summary style={{cursor: 'pointer', fontSize: '17px', fontWeight: '500', minHeight: '28px'}}>What about my HOA?</summary>
              <p style={{margin: '12px 0 0', fontSize: '15px', fontWeight: '300', lineHeight: 1.65, color: '#3A4549'}}>Rules vary by neighborhood. Mention it on your call and we'll help you check what your HOA allows before anything is installed.</p>
            </details>
            <details style={{borderBottom: '1px solid #D9D2C3', padding: '18px 0'}}>
              <summary style={{cursor: 'pointer', fontSize: '17px', fontWeight: '500', minHeight: '28px'}}>When should I book to be lit for the holidays?</summary>
              <p style={{margin: '12px 0 0', fontSize: '15px', fontWeight: '300', lineHeight: 1.65, color: '#3A4549'}}>As early as you can. Install dates fill up as the holidays get closer, and each track is custom-made before installation.</p>
            </details>
          </div>
        </section>
      
        <section style={{background: '#141A1D', color: '#F3EEE4'}}>
          <div style={{maxWidth: '1120px', margin: '0 auto', padding: '88px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '22px'}}>
            <h2 style={{margin: '0', fontFamily: "'Cormorant Garamond', serif", fontWeight: '300', fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.1, maxWidth: '720px'}}>See what it would cost to<br />light <span style={{fontStyle: 'italic', color: '#E6D2A6'}}>your</span> home.</h2>
            <p style={{margin: '0', fontSize: '16px', fontWeight: '300', color: '#C9CFD0'}}>Install dates fill up fast before the holidays.</p>
            <a href="/estimate" style={{textDecoration: 'none', display: 'inline-flex', alignItems: 'center', minHeight: '52px', padding: '0 30px', borderRadius: '999px', border: '0', background: '#E6D2A6', color: '#141A1D', fontFamily: "'Jost', sans-serif", fontSize: '16px', fontWeight: '500', letterSpacing: '0.03em', cursor: 'pointer'}}>Get my free estimate</a>
            <div style={{fontSize: '13px', color: '#B5BEC0'}}>In &lt;2 minutes · No obligation</div>
          </div>
        </section>
      
        <footer style={{background: '#0E1315', color: '#B5BEC0'}}>
          <div style={{maxWidth: '1120px', margin: '0 auto', padding: '28px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px', fontSize: '13px'}}>
            <div>© {new Date().getFullYear()} {SITE.name}</div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '18px'}}>
              <span>{SITE.serviceAreaLabel} · <a href={`tel:${SITE.phoneTel}`} style={{color: '#B5BEC0'}}>{SITE.phoneDisplay}</a></span>
              <a href="/privacy" style={{color: '#B5BEC0'}}>Privacy policy</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
