import { NextRequest, NextResponse } from 'next/server';

// Satellite photo of the home (Google Maps Static API), proxied so the key stays private.
export async function GET(req: NextRequest) {
  const k = process.env.GOOGLE_SERVER_KEY;
  const lat = Number(req.nextUrl.searchParams.get('lat'));
  const lng = Number(req.nextUrl.searchParams.get('lng'));
  const zoom = Math.min(21, Math.max(17, Number(req.nextUrl.searchParams.get('z')) || 20));
  if (!k || !Number.isFinite(lat) || !Number.isFinite(lng)) return new NextResponse(null, { status: 404 });
  const u = new URL('https://maps.googleapis.com/maps/api/staticmap');
  u.searchParams.set('center', `${lat},${lng}`);
  u.searchParams.set('zoom', String(zoom));
  u.searchParams.set('size', '640x400');
  u.searchParams.set('scale', '2');
  u.searchParams.set('maptype', 'satellite');
  u.searchParams.set('key', k);
  const r = await fetch(u);
  if (!r.ok) return new NextResponse(null, { status: 502 });
  return new NextResponse(r.body, {
    headers: { 'Content-Type': r.headers.get('content-type') || 'image/png', 'Cache-Control': 'private, max-age=3600' },
  });
}
