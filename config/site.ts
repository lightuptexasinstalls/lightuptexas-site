// ─────────────────────────────────────────────────────────────
//  Business settings. Edit these, commit, and Vercel redeploys.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: 'Light Up Texas Installs LLC',
  phoneDisplay: '(325) 660-9191',
  phoneTel: '3256609191',
  serviceAreaLabel: 'Abilene, Texas',
  specialistName: '[SPECIALIST NAME]', // shown on the results screen: "[name] will call you…"
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
};

// ZIP codes you install in. Leave EMPTY to accept every Texas ZIP while testing.
// Example: ['79601', '79602', '79603', '79605', '79606']
export const SERVICE_ZIPS: string[] = [];

export const PRICING = {
  ratePerFoot: 35, // $ per linear foot of roofline
  minimum: 1500, // smallest job you'll quote
  storyMultiplier: [1, 1.15, 1.3], // 1 story, 2 stories, 3+ stories
  // How wide the ballpark range is. "measured" = home found on the satellite view.
  spread: {
    measured: { low: 0.9, high: 1.15 },
    estimated: { low: 0.8, high: 1.3 },
  },
  minRangeWidth: 400, // high is always at least this much above low
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

export const LEAD_STATUSES = ['new', 'called', 'no answer', 'answered', 'visit booked', 'bought', 'lost'];
