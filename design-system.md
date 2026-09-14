# Grassendale Valet design system

Extracted from styles.css. The system critic judges against this file only.

## Tokens

| Token | Value | Use |
|---|---|---|
| --bg | #000000 | Page and panel void |
| --surface | #181818 | Second dark layer: footer, enquiry, before/after |
| --line | #303030 | The only divider. 1 px, always. |
| --text | #ffffff | Primary text |
| --text-muted | #8f8f8f | Secondary text, nav links at rest |
| --text-dim | #666666 | Labels, disclaimers, placeholders |
| --accent | #d4af37 | Gold. Signal only: labels, active nav, hover, one CTA. Placeholder hex until the client confirms. |
| --accent-hover | #e8c766 | Hover state of anything gold |

## Type

- One family: Inter. Fallback Helvetica Neue, Arial.
- Weights 400 to 600 only. Headlines 500. Nothing bolder.
- All headlines, labels, prices, nav and buttons are uppercase.
- Tracking widens as size shrinks: headlines 0.005 to 0.01em, labels 0.09em
  (--track-wide), list items 0.06em (--track-mid).
- Body 15 px / 1.7. Labels 10 to 11 px. Headline clamp(2.5rem, 3.4vw, 2.75rem),
  which is 2.65x to 2.95x body at 960 px and above; the measurable rule is
  "at least 2.6x body on desktop", matching the reference's 3:1 as closely
  as a 15 px body allows. Section headings
  clamp(1.75rem, 2.6vw, 2.5rem). The photograph carries scale, not the type.
  One exception: below 480 px the hero headline may drop to 1.7rem so it sets
  as two clean lines instead of three ragged ones.

## Geometry

- Border radius 0 on everything except two circles: the before/after slider
  grip and the circle-arrow link dot.
- No shadows, no glows, no blur, no gradients as backgrounds. The only
  gradients are scrims over photography for legibility.
- Full-bleed media panels: min-height 100vh, media absolute inset 0,
  object-fit cover, no padding, no frame.
- Max content width 1440 px. Panel body padding 4rem on desktop, 1.75rem
  on mobile.

## Components

- `.panel` full-viewport media panel; `.panel--void` centred type on black.
- `.panel-label` gold 11 px uppercase eyebrow; `.panel-title` uppercase
  headline; `.panel-copy` muted paragraph max 42ch.
- `.link-circle` label plus 40 px hairline circle with arrow; fills gold on
  hover and shifts 5 px right.
- `.btn-primary` the single filled gold surface on the page: the hero
  "Message to book". The nav "Book" is a ghost text link, not a fill. The
  floating DM chip stays hidden while the hero is in view.
- `.btn-outline` hairline ghost.
- `.service-includes` uppercase 11 px list with 12 px gold dash bullets.
- Inputs: transparent, bottom hairline only, gold on focus.
- Option tiles: hairline grid, selected tile fills gold with black text.

## Motion

- Hidden state is applied by script.js, never by CSS, so the page is fully
  visible if the script fails.
- Two speeds only, matching the reference. Big reveals (sections, headline
  line wipes, the video fading in over its poster still) run 1500 ms,
  cubic-bezier(0.22, 1, 0.36, 1), 110 ms stagger per headline line. Hover,
  nav and control feedback run 200 to 500 ms. Nothing between 500 ms and
  1500 ms, nothing under 150 ms. Panel photographs have no entrance
  transition at all: they are static under the scrim and only parallax.
- Panel photography parallaxes 5.5% inside its frame on scroll. Hero photo
  opens with a 2.6 s push-in from scale 1.09.
- Stagger between siblings 60 ms, capped at 420 ms.
- prefers-reduced-motion disables all of the above.

## Content rules

- British English, conversational. Banned: unlock, elevate, transform your
  vehicle, take it to the next level.
- Never use an em dash or en dash. Comma, full stop, colon.
- Never invent reviews, names, client counts, years trading, certifications
  or prices. Missing data is written as [PLACEHOLDER] and flagged.
- Only services the client actually offers: Exterior Valet (£20 to £25),
  Interior + Exterior (£30 to £35), Driveway Restoration (price on request).
- Booking is Instagram DM only. No phone, no email exists yet.
- Every photo not yet supplied by the client shows a labelled placeholder
  naming the file that belongs there.
