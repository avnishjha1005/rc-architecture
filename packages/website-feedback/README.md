# @rc/website-feedback

Private, source-based Next.js workspace package for the RC Architecture client review experience.

- `@rc/website-feedback/client` exports the review workspace and preview bridge.
- `@rc/website-feedback/server` exports the authenticated route-handler factory and shared server types.
- `@rc/website-feedback/providers/github` exports the GitHub Issues adapter.
- `@rc/website-feedback/providers/notion` exports the Notion storage adapter.

The consuming application owns its App Router pages and routes, UI configuration, provider selection, and all environment secrets. See the repository's `docs/feedback-setup.md` for provider setup.
