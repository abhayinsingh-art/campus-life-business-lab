# Campus Life Business Lab

Campus Life Business Lab is an accessibility-first business learning platform for young adults aged 17-25 with intellectual disability in a disability support transition program.

It is not a business studies website and not an inventory system. Participants learn business by doing business: making products, counting stock, marketing products, selling products, recording outcomes, and improving decisions.

## Core Experience

- Participant modes: Make, Count, Sell, Poster, Decide
- Inclusion Assistant mode: add products, upload images, add materials, configure recipes, set low-stock thresholds, export reports
- Local-first storage with `localStorage`
- PWA manifest and service worker for installable/offline-friendly use
- iPad-friendly responsive UI with large touch targets, product photos, simple language, and immediate feedback
- Kylie the Business Koala gives teachable moments after important actions
- Badge-based gamification with no scores

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Local storage data persistence
- PWA support through `public/manifest.webmanifest` and `public/sw.js`

## Data Model

The local model is defined in `lib/types.ts`.

- `Product`: name, photo, description, current quantity, minimum stock level, raw materials, recipe
- `RawMaterial`: name, photo, quantity available
- `SaleRecord`: product, quantity, timestamp
- `ProductionRecord`: product, quantity, timestamp
- `Badge`: participant achievement state
- `Poster`: guided marketing-studio output
- `FutureModule`: module framework using Learn -> Do -> Understand -> Decide -> Reflect

Default products are Bracelets, Dog Biscuits, and Bath Bombs. These are sample products only; assistants can add unlimited custom products.

## Architecture

- `app/page.tsx`: complete application UI and workflows
- `app/layout.tsx`: metadata and PWA registration metadata
- `app/globals.css`: global accessible visual styling
- `lib/types.ts`: domain models
- `lib/sample-data.ts`: sample products, materials, badges, and future modules
- `lib/storage.ts`: local storage store and Kylie coach moments
- `public/assets`: generated product and mascot images
- `public/sw.js`: cache-first service worker

Future modules are intentionally data-driven. New learning areas can be added by extending `futureModules` with the required stages:

1. Learn
2. Do
3. Understand
4. Decide
5. Reflect

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Deployment

The app can be deployed to Vercel or any platform that supports Next.js 15.

For Vercel:

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Use the default Next.js build settings.
4. Deploy.

No database or environment variables are required for the current local-storage version.

## Report Export

In Assistant View, use Export to download a JSON report containing:

- Products
- Raw materials
- Sales records
- Production records
- Earned badges

## Accessibility Notes

- Large buttons and large typography
- High contrast color combinations
- Simple participant-facing labels
- Product photos on decision and action cards
- Limited poster choices to reduce cognitive load
- Immediate visual and coach feedback after important actions
