import { PRICING, COVERAGE, HOME_SIZES, SERVICE_ZIPS } from '@/config/site';

export function inServiceArea(zip: string): boolean {
  if (!/^\d{5}$/.test(zip)) return false;
  if (SERVICE_ZIPS.length) return SERVICE_ZIPS.includes(zip);
  return /^(7[5-9]|733|885)/.test(zip); // any Texas ZIP until the real list is added
}

/** Total roofline (eave + gable edges) in feet, from a building footprint. */
export function perimeterFromFootprint(areaSqFt: number, aspect = 1.4): number {
  const w = Math.sqrt(areaSqFt * aspect);
  const h = areaSqFt / w;
  // 1.15 covers jogs, L-shapes and sloped gable edges being longer than flat ones.
  return Math.round((2 * (w + h) * 1.15) / 5) * 5;
}

/** Footprint estimate when we only know living area and stories. */
export function perimeterFromHomeSize(sizeIndex: number, storiesIndex: number | null): number {
  const sqft = HOME_SIZES[sizeIndex].sqft;
  const floors = storiesIndex === null ? 1.5 : [1, 2, 3][storiesIndex];
  return perimeterFromFootprint(sqft / floors);
}

export function coverageFeet(totalFeet: number, coverageIndex: number): number {
  return Math.round((totalFeet * COVERAGE[coverageIndex].share) / 5) * 5;
}

export type Range = { low: number; high: number };

export function priceRange(feet: number, storiesIndex: number): Range | null {
  if (!feet || feet <= 0 || storiesIndex < 0 || storiesIndex > 2) return null;
  const P = PRICING;
  const base = feet * P.ratePerFoot * P.storyMultiplier[storiesIndex];
  const r = (n: number) => Math.round(n / P.roundTo) * P.roundTo;
  // low and high sit evenly around the price, with high = low + rangePct
  const low = Math.max(P.minimum, r(base / (1 + P.rangePct / 2)));
  const high = r(low * (1 + P.rangePct));
  return { low, high };
}

export const money = (n: number) => '$' + n.toLocaleString('en-US');
