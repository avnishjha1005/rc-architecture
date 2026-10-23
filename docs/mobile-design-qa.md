# Mobile design drift QA

Reference viewport: 395 px. Baseline preservation: existing uncommitted work was retained; changes were layered onto the current tree.

## Red flags and resolution checklist

- [x] Shared mobile logo was undersized relative to every supplied header.
- [x] Homepage hero exceeded the reference composition height and pushed all following content down.
- [x] Homepage About headline lacked the reference scale.
- [x] Contact form placed email and phone on one row instead of separate full-width rows.
- [x] Contact page omitted the Awards & Recognitions section entirely.
- [x] Contact page could omit the Follow Us row when CMS social data was empty.
- [x] Contact information and satellite-office rows were too compressed.
- [x] Contact careers imagery used narrow portrait cards instead of the wider reference rail.
- [x] Project-detail hero and story images were substantially too short.
- [x] Project-detail headings and story spacing were compressed.
- [x] Project catalogue featured card and archive imagery used the wrong mobile aspect ratios.
- [x] Project catalogue headings were undersized.
- [x] Project list view rendered the full archive at once rather than the twelve-row reference state.
- [x] Project load-more affordance used a down arrow instead of the supplied up arrow.
- [x] Blog category tabs were horizontal instead of stacked.
- [x] Blog overview rendered every article with no View all affordance.
- [x] Blog mobile CSS accidentally displayed both desktop and mobile mosaic trees.
- [x] Services hero was too tall and the process heading used a desktop offset.
- [x] Services process steps lost their bordered card treatment on mobile.
- [x] Services process deliverables were collapsed into two unseparated lines and retained unnecessary letter markers.
- [x] Services mobile hero did not use the requested 95% small-viewport height.
- [x] Services item rail showed one oversized card rather than a two-up horizontal rail.
- [x] Projects featured section exceeded the requested 80px mobile bottom padding.
- [x] Page-level hero heights drifted between fixed pixels, `100vh`, and content height; all now use `95vh` with a `95svh` override.
- [x] Services process cards had collapsed into one continuous bordered panel; restored individual borders and mobile spacing.
- [x] Services process frame was missing desktop side and bottom borders, and deliverables were being padded to three rows instead of preserving source counts.
- [x] All page-level mobile heroes now use `100vh` with a `100svh` override; desktop heroes remain at 95% viewport height.
- [x] Homepage mobile hero headline and intro typography were undersized relative to the 395px reference.
- [x] Blog View all incorrectly appeared as a desktop control and constrained the desktop article set.
- [x] Shared Next Projects sections used a horizontal carousel rather than the three-card mobile stack.
- [x] Shared footer typography, navigation rhythm, and content width were too compressed.
- [x] Mobile carousel widths risked document overflow at narrow sizes.

## Verification

- `npm run check`: passed (ESLint, TypeScript, and 9 tests).
- `pnpm build`: compiled successfully with Next.js 16.3.1 in Webpack mode.
- Browser overflow audit: `/`, `/contact`, `/projects/ge-digital`, `/projects`, `/clients`, `/blog`, and `/services` all had `scrollWidth === clientWidth` at 320, 395, 768, and 1440 px.
- Full-page 395 px captures were inspected for all seven routes and the project archive's image/list states.
- Live CMS content can intentionally change names, copy, counts, dates, and images; this QA treats the supplied screenshots as the visual-structure reference.
