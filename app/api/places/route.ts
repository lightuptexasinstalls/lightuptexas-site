import { NextRequest, NextResponse } from 'next/server';

// Address search using Google Places API (New). The API key never reaches the browser.
//   GET /api/places?q=123 Main&session=abc        → suggestions
//   GET /api/places?id=<placeId>&session=abc      → address + location

const key = () => process.env.GOOGLE_SERVER_KEY;

export async function GET(req: NextRequest) {
  const k = key();
  if (!k) return NextResponse.json({ error: 'not-configured' }, { status: 503 });
  const q = req.nextUrl.searchParams.get('q')?.slice(0, 120);
  const id = req.nextUrl.searchParams.get('id')?.slice(0, 300);
  const session = req.nextUrl.searchParams.get('session')?.slice(0, 64) || undefined;

  try {
    if (q) {
      const r = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': k },
        body: JSON.stringify({
          input: q,
          sessionToken: session,
          includedRegionCodes: ['us'],
          includedPrimaryTypes: ['street_address', 'premise', 'subpremise'],
          // bias toward Abilene, TX
          locationBias: { circle: { center: { latitude: 32.4487, longitude: -99.7331 }, radius: 50000 } },
        }),
      });
      const j = await r.json();
      const suggestions = (j.suggestions || [])
        .map((s: { placePrediction?: { placeId: string; text?: { text: string } } }) => s.placePrediction)
        .filter(Boolean)
        .slice(0, 5)
        .map((p: { placeId: string; text?: { text: string } }) => ({ id: p.placeId, text: p.text?.text || '' }));
      return NextResponse.json({ suggestions });
    }
    if (id) {
      const u = `https://places.googleapis.com/v1/places/${encodeURIComponent(id)}` + (session ? `?sessionToken=${encodeURIComponent(session)}` : '');
      const r = await fetch(u, { headers: { 'X-Goog-Api-Key': k, 'X-Goog-FieldMask': 'formattedAddress,location,addressComponents' } });
      const j = await r.json();
      if (!j.location) return NextResponse.json({ error: 'not-found' }, { status: 404 });
      const zip = (j.addressComponents || []).find((c: { types: string[] }) => c.types?.includes('postal_code'))?.shortText || '';
      return NextResponse.json({ address: j.formattedAddress, lat: j.location.latitude, lng: j.location.longitude, zip });
    }
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 502 });
  }
  return NextResponse.json({ error: 'bad-request' }, { status: 400 });
}
