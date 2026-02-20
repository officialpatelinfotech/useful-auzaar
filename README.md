This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### URL shortener backend in development

The URL shortener API (`/api/url-shortener`) and redirect (`/r/<slug>`) are served by the Cloudflare Worker (so the site can be hosted statically on cPanel).

If you run only `npm run dev`, the shortener UI will return `404` for `/api/url-shortener`.

To run the shortener locally:

1) Start the Worker:

- `cd workers/usefulauzaar-worker`
- `npm i`
- `npx wrangler dev`

2) In the Next app, set `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8787` in `.env.local` and restart `npm run dev`.

## Production (Vercel + usefulauzaar.in)

Note: the current URL shortener backend is implemented as a Cloudflare Worker (see cPanel section). If you deploy the Next app to Vercel without the Worker routes, `/api/url-shortener` will not exist.

1) Create a Vercel project from this repo/folder.

2) Add Environment Variables (Project → Settings → Environment Variables):

- `MONGODB_URI` (required for URL shortener)
- `MONGODB_DB` (optional, defaults to `usefulauzaar`)
- `NEXT_PUBLIC_SITE_URL` = `https://usefulauzaar.in`

3) Add Domain

- Add `usefulauzaar.in` (and optionally `www.usefulauzaar.in`) in Vercel Domains.
- Configure DNS in your domain registrar as Vercel instructs.

4) MongoDB Atlas Network Access

- For Vercel, allow access from the internet (`0.0.0.0/0`) unless you’re using a stricter networking setup.

5) SEO tooling

- Verify domain in Google Search Console.
- Submit sitemap: `https://usefulauzaar.in/sitemap.xml`

## Production (cPanel)

If your cPanel server does NOT have Node.js, deploy as a static site and run the URL shortener backend on Cloudflare Workers.

### 1) Static build for cPanel

Build locally:

- `npm ci`
- `npm run build:static`

This generates a static site in `out/`.

Upload the contents of `out/` to your cPanel `public_html/` (or the document root for `usefulauzaar.in`).

Set `NEXT_PUBLIC_SITE_URL=https://usefulauzaar.in` in `.env.local` before building (so sitemap/robots are correct).

### 2) Backend on Cloudflare Workers (for /api/* and /r/*)

Because cPanel can’t run Node, the URL shortener backend is implemented as a Cloudflare Worker in:

- `workers/usefulauzaar-worker/`

What it serves:

- `POST /api/url-shortener` create short link
- `GET /api/url-shortener?slug=...` stats
- `GET /r/<slug>` redirect + click counting

You must:

1) Put the domain on Cloudflare (so Cloudflare can run Workers on your domain).

2) Enable MongoDB Atlas **Data API** (App Services) and get:

- Data API base URL (looks like `https://data.mongodb-api.com/app/<app-id>/endpoint/data/v1`)
- Data API key

3) Configure Worker secrets (recommended):

- `MONGO_DATA_API_BASE`
- `MONGO_DATA_API_KEY`
- `MONGO_DATA_SOURCE` (e.g. `Cluster0`)
- `MONGO_DB` (e.g. `usefulauzaar`)
- `MONGO_COLLECTION` (e.g. `short_links`)

4) Deploy the worker with routes:

- `usefulauzaar.in/api/*`
- `usefulauzaar.in/r/*`

Local-only note: if the Worker Data API vars are not set, it will run in an in-memory mode for development (links reset when the Worker restarts).

Static pages continue to be served from cPanel; only these backend paths are handled by the worker.
You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# useful-auzaar
