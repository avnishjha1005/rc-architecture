# RC Architecture

Next.js 16 site with an embedded Sanity Studio and starter content model for an architecture practice.

## Getting started

1. Create or choose a project at [sanity.io/manage](https://www.sanity.io/manage).
2. Copy the environment template and add your project ID. Configure the Resend variables before testing public forms:

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

- **Site settings** — the single source of truth for identity, navigation, header CTA, offices, social links, contact information, and footer content
- **Projects** — architecture projects, images, status, location, and rich text
- **Pages** — flexible standard pages with rich text and SEO fields

Sanity integration lives in `sanity/`. Queries are centralized in `sanity/lib/queries.ts`; image URLs use `sanity/lib/image.ts`.

## Commands

```bash
npm run dev       # app and embedded Studio
npm run lint      # ESLint
npm run typecheck # TypeScript without emitting files
npm test          # Node-based configuration tests
npm run check     # lint, types, and tests
npm run build     # production build
npx sanity deploy # optional standalone Studio deployment
```

Only variables prefixed with `NEXT_PUBLIC_` are used in the browser. Never expose a Sanity write token that way; keep server-side tokens unprefixed.

## Production checklist

1. Set every variable required for Sanity and form delivery from `.env.example` in the hosting environment.
2. Verify the `CONTACT_FROM_EMAIL` domain in Resend. Public forms fail safely with an explanatory message when delivery is not configured.
3. Create a Sanity webhook that sends `POST /api/revalidate` with `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`. Its JSON body may contain `{ "paths": ["/", "/projects"] }`.
4. Configure Sanity presentation links as `/api/draft?secret=<SANITY_PREVIEW_SECRET>&path=/projects/<slug>`. Draft reads require the server-only `SANITY_API_READ_TOKEN`. Visit `/api/draft/disable` to leave preview mode.
5. Connect analytics and monitoring endpoints if required, then enable their corresponding `NEXT_PUBLIC_` flags at build time.
6. Run `npm run check` and `npm run build`. CI runs the same quality gate on every pull request and push to `main`.
7. Smoke-test contact and newsletter delivery, mobile navigation, project filters/loading, gallery controls, 404 handling, preview mode, and the Sanity Studio in the production environment.

The form rate limiter is intentionally dependency-free and process-local. On multi-instance or serverless deployments, replace it with a durable shared store before high-volume campaigns.
