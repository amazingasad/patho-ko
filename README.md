# Pathor-Ko

**Discover where every stone lives.**

Pathor-Ko ("Pathor" is Bengali for *stone*) is a stone and mineral locality explorer. Search by stone to see every locality where it is found, on an interactive map and in a list. Search by country to see every stone found there. Everything is built in: a curated collection of well-known stones and localities ships with the app, so there is no API key, no account and nothing to configure.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Leaflet and lucide-react. It is installable as a PWA.

## Setup

1. Clone the repo.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new). Or run `vercel` with the CLI.
3. Click **Deploy**. Done. No environment variables or code edits are needed.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run check-data` | Validate the built-in stone and locality data |
| `npm run icons` | Regenerate `public/icon-192.png`, `icon-512.png` and `icon-maskable-512.png` from the crystal SVG using `sharp` |

## Data

- Stone properties live in `lib/data/stones.ts` and localities (name, country, coordinates, stones found) in `lib/data/localities.ts`. Add a row to either file and it appears everywhere in the app.
- The collection covers classic mines, districts and collecting areas, not every occurrence on Earth. Coordinates are approximate district centres.
- `npm run check-data` verifies that every stone name used in a locality exists, every country is recognised, and every coordinate is valid.
- `USA` and other common variants are mapped to `United States` when searching by country.

## Project notes

- The logo is a pure SVG component in `components/Logo.tsx`. The same crystal is used for the favicon, the PWA icons, the map pins, the splash screen and the loading states.
- Map tiles are © OpenStreetMap contributors.
