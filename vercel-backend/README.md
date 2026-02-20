# UsefulAuzaar Backend (Vercel)

This is a backend-only Next.js app intended to be deployed on Vercel (e.g. `go.usefulauzaar.in`).

## Endpoints

- `POST /api/url-shortener` → create short link
- `GET /api/url-shortener?slug=...` → stats
- `GET /r/<slug>` → 302 redirect + click counting

## Required env vars

- `MONGODB_URI`
- Optional: `MONGODB_DB` (default `usefulauzaar`)
- Optional: `MONGODB_COLLECTION` (default `short_links`)

## Local dev

- `npm i`
- `npm run dev`
