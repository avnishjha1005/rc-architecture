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

## Cloudflare Workers

Push site changes to `staging`. GitHub Actions checks the commit and deploys [the staging site](https://rc-architecture-staging.twa-cms.workers.dev). To promote it, open a pull request **from `staging` into `main`** and merge using a merge commit. The push to `main` deploys [the production site](https://rc-architecture.twa-cms.workers.dev). Keep the staging branch after merging. Pull requests run checks without deploying to Cloudflare.

Both Worker builds apply the same version-controlled design content in `scripts/design-content/` to a read-only snapshot of published CMS data. Neither build writes to Sanity. Staging remains excluded from search and its Studio is disabled; production retains its own bindings and Studio. Check each deployment's Worker version in the Actions log.

Both Workers serve their prerendered pages from the deployed assets, so neither needs a KV cache for a publish to succeed; the free plan's daily KV write limit no longer blocks a deployment. Because that cache is read-only at runtime, a published CMS edit appears after the next deployment of its branch rather than on the following request. To retry a deployment, rerun the workflow for the same branch.

Configure a `CLOUDFLARE_API_TOKEN` secret in each corresponding GitHub environment, **Staging** and **Production**, for publishing to the existing account.

## Production checklist

1. Set every variable required for Sanity and form delivery from `.env.example` in the hosting environment.
2. Verify the `CONTACT_FROM_EMAIL` domain in Resend. Public forms fail safely with an explanatory message when delivery is not configured.
3. The `POST /api/revalidate` webhook is optional with the read-only asset cache: published edits reach visitors on the next deployment, not on the following request. If a KV-backed cache is restored, create the Sanity webhook with `Authorization: Bearer <SANITY_REVALIDATE_SECRET>` and an optional `{ "paths": ["/", "/projects"] }` body.
4. Configure Sanity presentation links as `/api/draft?secret=<SANITY_PREVIEW_SECRET>&path=/projects/<slug>`. Draft reads require the server-only `SANITY_API_READ_TOKEN`. Visit `/api/draft/disable` to leave preview mode.
5. Run `npm run check` and `npm run build`. CI runs the same quality gate on every pull request and push to `main`.
6. Smoke-test contact and newsletter delivery, mobile navigation, project filters/loading, gallery controls, 404 handling, preview mode, and the Sanity Studio in the production environment.

The form rate limiter is intentionally dependency-free and process-local. On multi-instance or serverless deployments, replace it with a durable shared store before high-volume campaigns.

## Client website feedback

Hosted Chisel reviews are at [`/chisel`](https://rc-architecture.twa-cms.workers.dev/chisel). Sign in as a project owner and use **Share review link** to invite reviewers. Set `CHISEL_ENABLED=1` at build time and on the Worker to enable the review workspace, nested page links, and preview integration. To disable them, unset the flag in both places and rebuild and redeploy.

The reusable `@rc/website-feedback` workspace package powers a private review shell at `/feedback`. Configure the shared passcode and choose either the Notion or GitHub Issues provider using the variables in `.env.example`, then follow [the feedback setup guide](docs/feedback-setup.md).

The package is intentionally private and source-based for now. The application transpiles it through `next.config.mjs`; `html2canvas` is loaded only when a reviewer submits a screenshot.
