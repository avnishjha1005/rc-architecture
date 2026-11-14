# RC Architecture mobile design system

## Reference context

- Source of truth: the eight user-supplied 395 px-wide PNG designs dated 2026-10-22.
- Pages: Home, Contact, Project Detail, All Projects list state, Project Catalogue image state, Clients, Blog Overview, and Services.
- The captures define the 395 px composition. Values between 320 px and 900 px are responsive implementation choices rather than pixel-extracted source values.
- Live Sanity copy and imagery may differ from the reference content. Layout, hierarchy, component behavior, and image treatment should remain consistent with the references.

## Tokens

Observed values already represented by the application:

- Ink: `#1d1d1d` / `#202020`
- Paper: `#fafafa`
- Accent red: `#ff2e17`
- Mobile page gutter: `20px`
- Body face: Hanken Grotesk
- Metadata/eyebrow face: Chivo Mono
- Pill radius: fully rounded (`999px`)
- Hairlines: neutral gray, normally `1px`

## Mobile layout rules

- Use a 20 px content gutter and full-bleed media only where shown in the references.
- Keep headings fluid and wrap naturally; do not force desktop line lengths onto mobile.
- Use flex or grid for field rows, navigation rows, cards, and metadata. Avoid positioning content with page-specific pixel offsets.
- Horizontal carousels must remain clipped by their section and must not increase document width.
- Related-project sections become a vertical three-card stack on mobile.
- Project archive image view starts with six cards; list view starts with twelve rows. Both reveal more content through the same load-more control.
- Blog category controls stack vertically on mobile. Mobile initially shows four posts, then reveals the remainder with View all; desktop shows the complete active category without that control.
- Contact form order is: first/last name in two columns, then email, phone, message, and submit as full-width rows.
- Contact information includes satellite offices, social destinations, awards and recognition, then careers.
- Page-level heroes use `95vh`/`95svh` on desktop and `100vh`/`100svh` on mobile. Content-heavy heroes use those values as minimums so their content can grow without overlap. Services process steps use a complete outer border on desktop; on mobile, each step is an individually bordered card separated by a `12px` gap. Deliverables render as provided in vertically stacked, bordered rows—the Deploy card intentionally has two—and there is no decorative letter marker. Service deliverables use a two-up horizontal rail.
- The mobile homepage hero uses an approximately `62px` first headline line, `58px` wordmark line, and `15px` intro copy at the 395px reference width, with the second line visually spanning the 20px gutters and fluid clamps for narrower screens.
- The mobile Projects featured section uses no more than `80px` of bottom padding.

## Shared components

- Header: large left-aligned wordmark with a red circular menu trigger.
- Eyebrows: red uppercase Chivo Mono labels with loose tracking.
- Contact CTA: full-bleed photographic panel with white headline and red pill action.
- Newsletter: light bordered card, stacked copy/form, architectural line drawing anchored low.
- Footer: dark surface, oversized contact headline, email row, numbered navigation, address/hours, and subdued brand/legal lockup.

## Responsive behavior

- Mobile-specific compositions apply through the existing 760 px and 900 px breakpoints.
- At 320 px, typography and controls remain inside the viewport without horizontal document overflow.
- At 768 px, layouts use the tablet branch without leaking carousel width.
- Desktop declarations remain outside the mobile overrides.

## Image treatment

- Project and editorial images use `object-fit: cover` within explicit aspect-ratio containers.
- The project-detail hero is full bleed, `95vh`/`95svh`, and taller than ordinary story images.
- Carousel crops remain deterministic through sized parent containers and responsive `sizes` hints.

## Reference motion and editorial imagery

- Kononenko Architectural Bureau is the interaction reference for full-bleed hero media and the About-page image composition.
- Desktop About imagery uses a deliberately uneven editorial mosaic: a dominant landscape frame, a higher portrait frame, and a lower offset secondary frame. Mobile retains the existing swipeable carousel.
- Full-bleed home, About, Services, and project-detail heroes use a restrained scrubbed vertical drift with image overscan. Parallax never changes layout, pins content, or delays navigation.
- Image entrance and parallax share one transform sequence so decoded media settles continuously rather than popping between animation states.
- Reduced-motion mode disables the drift and renders images in their final state immediately.

