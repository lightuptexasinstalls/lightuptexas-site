'use client';
import { useEffect } from 'react';

const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];

/** Remembers which ad brought the visitor, so it's saved with their lead. */
export default function UtmCapture() {
  useEffect(() => {
    try {
      const p = new URLSearchParams(location.search);
      const found: Record<string, string> = {};
      KEYS.forEach((k) => { const v = p.get(k); if (v) found[k] = v; });
      if (Object.keys(found).length && !sessionStorage.getItem('lut_utm')) {
        found.landing = location.pathname;
        sessionStorage.setItem('lut_utm', JSON.stringify(found));
      }
    } catch {}
  }, []);
  return null;
}

export function readUtm(): Record<string, string> {
  try { return JSON.parse(sessionStorage.getItem('lut_utm') || '{}'); } catch { return {}; }
}

export function track(event: string, data?: Record<string, unknown>) {
  try {
    const w = window as unknown as { fbq?: (...a: unknown[]) => void };
    w.fbq?.('track', event, data);
  } catch {}
}
