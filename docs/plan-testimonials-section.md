# Plan — Testimonials section (landing page)

Status: **on hold** — build once the user has explicit OK (name + photo + quote)
from each person. Do NOT publish fabricated testimonials.

## Idea
A LinkedIn-style social-proof section: round photo + name + role @ company + a
1–2 sentence quote, from data-engineer friends / professionals who helped on the
journey. Part credibility, part acknowledgment.

## Placement
Landing order today (`pages/LandingPage.tsx`):
`Hero → ProductShowcase → AIDemo → Features → APISection → NodeExplorer →
TechSpecs → Tutorials → FreeTier`.

**Recommended:** insert `<Testimonials />` **just before `<FreeTier />`** (social
proof right before the download CTA — classic conversion spot). Alt: after
`<Features />`.

## Implementation (matches existing patterns)
1. **Type** in `types.ts`:
   ```ts
   export interface Testimonial {
     name: string;
     role: string;
     company: string;
     quote: string;
     avatar: string;        // local path, e.g. /testimonials/marina.jpg
     linkedin?: string;     // optional profile URL → clickable [in] icon
   }
   ```
2. **Data**: `export const TESTIMONIALS: Testimonial[]` in `constants.tsx`.
3. **Component** `components/Testimonials.tsx`: responsive card grid (3 cols
   desktop / 1 mobile). Card = round avatar (LinkedIn-style) + name + role @
   company + optional LinkedIn icon-link + the quote with a subtle quotation-mark
   accent. Reuse the site's glass-panel card styling.
4. **Photos**: host locally in `public/testimonials/` — do NOT hotlink LinkedIn
   (it blocks hotlinking and rotates URLs). Square/round source images.
5. Wire into `LandingPage.tsx` before `<FreeTier />`.

## Card mockup
```
┌─────────────────────────────────────┐
│  (●)  Marina Costa            [in]   │
│       Senior Data Engineer @ Nubank  │
│                                      │
│  " Odara cut my pipeline setup from  │
│    a day to ten minutes. "           │
└─────────────────────────────────────┘
```

## Open decisions (ask the user when we build)
- **Title tone:** professional ("Trusted by data engineers" / "What data
  engineers are saying") vs personal/gratitude ("Built with the people who
  shaped it" / "Friends who shaped Odara").
- **Placement:** before download (recommended) vs after Features.
- Whether to start with placeholders or real content.

## Hard requirement
Real people, real quotes, **explicit consent** to use name + photo + quote
publicly. This is the blocker — the user will collect the OKs first.
