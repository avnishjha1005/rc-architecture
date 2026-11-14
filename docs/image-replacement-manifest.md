# Image replacement handoff

Use original, high-quality JPEG or TIFF files in sRGB. Do not upscale screenshots, social-media downloads, or already compressed WebP files. Preserve clean architectural verticals and leave enough crop room for Sanity hotspots.

## Folder and naming convention

```text
Projects/
  <project-slug>/
    01-cover-landscape.jpg
    02-story-landscape.jpg
    03-gallery-portrait.jpg
```

## Required masters

| Placement | Minimum master | Guidance |
| --- | ---: | --- |
| Project cover / hero | 3200 px wide | Landscape, preferably 16:9 or 3:2 |
| Wide story image | 2800 px wide | Preserve verticals and crop flexibility |
| Standard story / gallery | 2400 px long edge | Supply landscape and portrait originals where available |
| Project / article card | 1600 px wide | Clear focal area and clean crop |
| Portrait | 1800 × 2700 px | No screenshots or social exports |

## Immediate replacements

| Current source | Current size | Usage | Required replacement |
| --- | ---: | --- | --- |
| Sanity asset `1e4b0f4c…-285x359.png` | 285×359 | Soho Lakehouse cover/hero and shared gallery image in 19 projects | New Soho cover at 3200 px plus project-specific gallery images at 2400 px long edge |
| `project-ge-digital.jpg` | 475×350 | GE Digital hero/story and homepage | New cover master at 3200 px plus story master at 2400 px |
| `service-interiors.jpg` | 572×340 | GE Digital story and service cards | New story master at 2400 px; separate 1600 px card source if needed |
| `project-hilton.jpg` | 474×350 | GE Digital story and homepage | New story master at 2400 px |
| `project-avalahalli.jpg` | 452×350 | GE Digital gallery and homepage | New gallery master at 2400 px |
| `project-bale-county.jpg` | 474×350 | Homepage/project fallback cards | New card master at 1600 px |
| `lab-sustainable.jpg`, `lab-minimalism.jpg` | 335×220 | Homepage article cards | New card masters at 1600 px |
| `lab-social.jpg`, `lab-design-build.jpg` | 335×360 | Homepage article/gallery cards | New card masters at 1600 px |

## Review status

- All current 1600 px Sanity project images are acceptable for card placement only.
- Replace any 1600 px asset selected as a full-width hero with a 3200 px original.
- Upload replacements to Sanity, set alt text and hotspot, then confirm the Studio no longer shows a dimension warning.
