# RC Architecture

Next.js 16 site with an embedded Sanity Studio and starter content model for an architecture practice.

## Getting started

1. Create or choose a project at [sanity.io/manage](https://www.sanity.io/manage).
2. Copy the environment template and add your project ID:

```bash
cp .env.example .env.local
```

3. Add `http://localhost:3000` to the project's CORS origins (with credentials) in Sanity Manage.
4. Start the app:

```bash
npm run dev
```

The website runs at [http://localhost:3000](http://localhost:3000) and the CMS at [http://localhost:3000/studio](http://localhost:3000/studio).

## Content model

- **Site settings** — a singleton for identity and contact information
- **Projects** — architecture projects, images, status, location, and rich text
- **Pages** — flexible standard pages with rich text and SEO fields

Sanity integration lives in `sanity/`. Queries are centralized in `sanity/lib/queries.ts`; image URLs use `sanity/lib/image.ts`.

## Commands

```bash
npm run dev       # app and embedded Studio
npm run lint      # ESLint
npm run build     # production build
npx sanity deploy # optional standalone Studio deployment
```

Only variables prefixed with `NEXT_PUBLIC_` are used in the browser. Never expose a Sanity write token that way; keep server-side tokens unprefixed.

