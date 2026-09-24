# iRecord

iRecord is a mobile-first web application for recording marine mammal sightings during boat-based surveys.

## Features

- Observer and species dropdown lists backed by a database
- Phone GPS waypoint capture
- Automatic observation date and time
- Distance type, angle, group-size estimates, response, platform, and comments
- Photo uploads
- Searchable sighting records
- CSV exports for sightings, observers, and species
- CSV import for observer names
- Responsive interface designed for field use on phones

## Technology

- React 19 and Vinext
- Cloudflare Workers
- Cloudflare D1 with Drizzle ORM
- Cloudflare R2 for photographs
- Tailwind CSS

## Requirements

- Node.js 22.13 or newer
- pnpm 11

## Local setup

```bash
pnpm install
pnpm run build
```

Apply the database migration before using a local D1-backed preview:

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_typical_arachne.sql
```

Start the development server:

```bash
pnpm run dev
```

The local URL is normally `http://localhost:5173`.

## Data storage

The application expects these Cloudflare bindings:

- `DB`: D1 database containing `sightings`, `observers`, and `species`
- `BUCKET`: R2 bucket containing uploaded photographs

The bindings are declared in `.openai/hosting.json`. The supplied species list is inserted when the database is first read.

## Repository structure

- `app/`: interface and API routes
- `db/`: Drizzle schema and database access
- `drizzle/`: database migrations
- `public/`: static assets
- `components/`: reusable interface components

## Publishing

The project is configured for OpenAI Sites hosting. It can also be adapted to another Cloudflare Workers deployment workflow, provided the `DB` and `BUCKET` bindings are configured.

## Privacy

Sightings may contain precise locations and photographs. Keep deployments private unless survey data is intended for public release. Do not commit exported records, environment files, credentials, or database files.
