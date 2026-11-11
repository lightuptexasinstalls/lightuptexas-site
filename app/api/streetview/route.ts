import { NextRequest, NextResponse } from 'next/server';

// Street-level photo of the home (Google Street View Static API), proxied so the key stays private.
// Checks the free metadata endpoint first so homes without Street View coverage fall back cleanly.
export async function GET(req: NextRequest) {
  const k = process.env.GOOGLE_SERVER_KEY;
  const lat = Number(req.nextUrl.searchParams.get('lat'));
  const lng = Number(req.nextUrl.searchParams.get('lng'));
  if (!k || !Number.isFinite(lat) || !Number.isFinite(lng)) return new NextResponse(null, { status: 404 });
  const loc = `${lat},${lng}`;

  const meta = new URL('https://maps.googleapis.com/maps/api/streetview/metadata');
  meta.searchParams.set('location', loc);
  meta.searchParams.set('source', 'outdoor');
  meta.searchParams.set('radius', '60');
  meta.searchParams.set('key', k);
  try {
    const m = await (await fetch(meta)).json();
    if (m.status !== 'OK') return new NextResponse(null, { status: 404 });
  } catch {
    return new NextResponse(null, { status: 502 });
  }

  // Without a heading, Google points the camera from the nearest street photo toward the home.
  const u = new URL('https://maps.googleapis.com/maps/api/streetview');
  u.searchParams.set('location', loc);
  u.searchParams.set('size', '640x400');
  u.searchParams.set('scale', '2');
  u.searchParams.set('fov', '75');
  u.searchParams.set('pitch', '5');
  u.searchParams.set('source', 'outdoor');
  u.searchParams.set('radius', '60');
  u.searchParams.set('key', k);
  const r = await fetch(u);
  if (!r.ok) return new NextResponse(null, { status: 502 });
  return new NextResponse(r.body, {
    headers: { 'Content-Type': r.headers.get('content-type') || 'image/jpeg', 'Cache-Control': 'private, max-age=3600' },
  });
}
