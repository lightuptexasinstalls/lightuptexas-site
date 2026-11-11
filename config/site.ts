// ─────────────────────────────────────────────────────────────
//  Business settings. Edit these, commit, and Vercel redeploys.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: 'Light Up Texas Installs LLC',
  phoneDisplay: '(325) 332-7997',
  phoneTel: '3253327997',
  serviceAreaLabel: 'Abilene, Texas',
  facebook: 'https://www.facebook.com/lightuptexasinstalls',
  instagram: 'https://www.instagram.com/lightuptexasinstalls/',
  specialistName: 'Aaron or Billy', // shown on the results screen: "[name] will call you…"
  // The live address. Vercel fills VERCEL_PROJECT_PRODUCTION_URL in automatically.
  url: process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'http://localhost:3000'),
};

// ZIP codes you install in. Leave EMPTY to accept every Texas ZIP while testing.
// Example: ['79601', '79602', '79603', '79605', '79606']
export const SERVICE_ZIPS: string[] = [];

export const PRICING = {
  ratePerFoot: 35, // $ per linear foot of roofline
  minimum: 1500, // smallest job you'll quote
  storyMultiplier: [1, 1.15, 1.3], // 1 story, 2 stories, 3+ stories
  // The ballpark range: the high number is this much above the low number (0.25 = 25%),
  // centered on the calculated price.
  rangePct: 0.25,
  roundTo: 50,
};

// Share of the total roofline each coverage choice usually covers.
export const COVERAGE = [
  { key: 'front', label: 'Front of the home', share: 0.4 },
  { key: 'front_sides', label: 'Front and sides', share: 0.7 },
  { key: 'whole', label: 'Whole house', share: 1.0 },
] as const;

export const HOME_SIZES = [
  { label: 'Under 2,000 sq ft', sqft: 1600 },
  { label: '2,000–3,000 sq ft', sqft: 2500 },
  { label: '3,000–4,500 sq ft', sqft: 3750 },
  { label: 'Over 4,500 sq ft', sqft: 5200 },
];

export const STORIES = ['1 story', '2 stories', '3+ stories'];
export const OWNER = ['Yes', 'No'];
export const TIMING = ['Before the holidays', 'In the next 1–3 months', 'Just exploring for now'];
export const HOA = ['Yes', 'No', 'Not sure'];
export const CALLBACK_SLOTS = ['Later today', 'Tomorrow morning', 'Tomorrow evening'];

export const LEAD_STATUSES = ['new', 'texted', "didn't answer", 'talking', 'visit booked', 'bought', 'not interested'];
/** Older status names, shown under their new names so existing leads keep their place. */
export const LEGACY_STATUS: Record<string, string> = { called: 'texted', 'no answer': "didn't answer", answered: 'talking', lost: 'not interested' };
