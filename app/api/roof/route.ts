import { NextRequest, NextResponse } from 'next/server';
import { perimeterFromFootprint } from '@/lib/estimate';

// Looks up the building at a lat/lng with Google's Solar API and returns
// an approximate roofline length. Returns { found: false } when Google has
// no roof data for that spot, so the form falls back to size questions.

const M2_TO_FT2 = 10.7639;

function metersBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000, toR = Math.PI / 180;
  const dLat = (b.lat - a.lat) * toR, dLng = (b.lng - a.lng) * toR;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export async function GET(req: NextRequest) {
  const lat = Number(req.nextUrl.searchParams.get('lat'));
  const lng = Number(req.nextUrl.searchParams.get('lng'));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return NextResponse.json({ found: false, reason: 'bad-input' }, { status: 400 });

  const key = process.env.GOOGLE_SERVER_KEY;
  if (!key) return NextResponse.json({ found: false, reason: 'no-key' });

  const u = new URL('https://solar.googleapis.com/v1/buildingInsights:findClosest');
  u.searchParams.set('location.latitude', String(lat));
  u.searchParams.set('location.longitude', String(lng));
  u.searchParams.set('requiredQuality', 'LOW');
  u.searchParams.set('key', key);

  try {
    const r = await fetch(u, { cache: 'no-store' });
    if (!r.ok) return NextResponse.json({ found: false, reason: 'solar-' + r.status });
    const b = await r.json();
    const area = b?.solarPotential?.wholeRoofStats?.groundAreaMeters2;
    const sw = b?.boundingBox?.sw, ne = b?.boundingBox?.ne, c = b?.center;
    if (!area || !sw || !ne || !c) return NextResponse.json({ found: false, reason: 'no-roof' });

    // findClosest can return a neighbor's house; reject anything too far from the address pin.
    if (metersBetween({ lat, lng }, { lat: c.latitude, lng: c.longitude }) > 35) {
      return NextResponse.json({ found: false, reason: 'too-far' });
    }

    const wM = metersBetween({ lat: sw.latitude, lng: sw.longitude }, { lat: sw.latitude, lng: ne.longitude });
    const hM = metersBetween({ lat: sw.latitude, lng: sw.longitude }, { lat: ne.latitude, lng: sw.longitude });
    const aspect = Math.min(2.5, Math.max(1, Math.max(wM, hM) / Math.max(1, Math.min(wM, hM))));
    const footprintSqFt = Math.round(area * M2_TO_FT2);
    if (footprintSqFt < 400 || footprintSqFt > 15000) return NextResponse.json({ found: false, reason: 'implausible' });

    return NextResponse.json({
      found: true,
      footprintSqFt,
      totalFeet: perimeterFromFootprint(footprintSqFt, aspect),
      center: { lat: c.latitude, lng: c.longitude },
      bbox: { sw: { lat: sw.latitude, lng: sw.longitude }, ne: { lat: ne.latitude, lng: ne.longitude } },
    });
  } catch {
    return NextResponse.json({ found: false, reason: 'error' });
  }
}
