'use client';
import { useEffect } from 'react';

/** Weighted, eased mouse-wheel scrolling. Touch and keyboard scrolling are untouched. */
export default function HeavyScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let target = window.scrollY, cur = window.scrollY, running = false, raf = 0;
    const step = () => {
      cur += (target - cur) * 0.075;
      if (Math.abs(target - cur) < 0.5) { cur = target; running = false; }
      window.scrollTo(0, cur);
      if (running) raf = requestAnimationFrame(step);
    };
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.defaultPrevented) return;
      // let scrollable inner elements (e.g. the address dropdown) scroll normally
      if ((e.target as Element)?.closest?.('.pac-container')) return;
      e.preventDefault();
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const d = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1);
      if (!running) { target = window.scrollY; cur = window.scrollY; }
      target = Math.min(max, Math.max(0, target + d));
      if (!running) { running = true; raf = requestAnimationFrame(step); }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => { window.removeEventListener('wheel', onWheel); cancelAnimationFrame(raf); };
  }, []);
  return null;
}
