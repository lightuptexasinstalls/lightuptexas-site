# Light Up Texas Installs: website and estimator

Next.js site hosted on Vercel.

- `/`: landing page
- `/estimate`: the 4-step estimator
- `/admin`: leads dashboard, password protected, with a CSV download

## Settings to edit
`config/site.ts` holds the phone number, specialist name, service ZIP codes, and pricing ($/ft, minimum and range width).

## Environment variables
See `.env.example`. The site runs without any of them, but in demo mode with local lead storage.

## Run locally
    npm install
    npm run dev
