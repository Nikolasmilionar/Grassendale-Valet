# Bar: ferrari.com/en-EN/auto/296-gtb

Measured 2026-09-13 at 966x910 viewport. Document 13 046 px tall, 9 chapters
(page shows "1 / 9"), 8 video elements, 1 canvas. Everything below is something
a critic can check by looking at rendered output, not by reading code.

1. **The hero is a video, not a photo.** Full viewport (966x910), autoplay,
   loop, muted, edge to edge with zero padding. The headline sits in the lower
   third, centred, one line, and nothing else shares the frame except a
   chevron and a "1 / 9" counter. Check: is there moving footage filling the
   first screen, and is the headline the only text on it?

2. **At least three further full-viewport media panels.** Four videos on the
   page render at exactly 910 px tall (one screen each). Media never sits in
   a card or column; it is the section. Check: count screens where an image
   or video reaches all four edges.

3. **Three type sizes carry the page.** Headline 36 px (h1, uppercase, weight
   400, tracking normal), body 12 px, caption 9 px. Ratio headline to body is
   3:1. Big stats ("830 cv") use the headline size with a 9 px uppercase label
   beneath. Nothing heavier than weight 500 anywhere. Check: measure the
   largest and smallest text on screen; is the largest roughly 3x the body,
   and is there a stat set like a headline?

4. **Accent on under 5% of text, never as a fill.** 453 white text nodes, 19
   red (3.6%). Red appears as thin eyebrow lines and tiny labels only. The
   only filled controls are white pills ("Discover more", "Discover the
   powertrain"). Check: count accent-coloured elements on a screen; are any
   of them a background?

5. **Two motion speeds, nothing in between.** Hover and nav transitions run
   200 to 500 ms. Section reveals run 1.5 s. No transition exists between
   0.5 s and 1.5 s, and nothing is faster than 150 ms. Check a filmstrip:
   do big elements arrive slowly and small ones snap?

6. **Every chapter follows one rhythm.** Media panel, then a centred text
   block (one uppercase headline plus one paragraph under 70 characters per
   line, at least 40% of the frame left empty around it), then optionally a
   row of exactly three image cards with the label sitting bottom-left ON
   the image, not beneath it. Chapters alternate dark (#181818) and light
   studio grey. Check: does any section break this order, and does any
   caption sit under its image?

7. **Graphics drawn over the photography, animated on scroll.** The
   aerodynamics chapter overlays illustrated airflow lines on the car and
   they move as you scroll. The car photo stays still; the graphic is what
   animates. Check: is there at least one panel where a drawn graphic, not
   the photo, is the moving element?

## What we deliberately keep different

- Gold (#d4af37) replaces Rosso Corsa. Same rules apply: under 5% of text,
  never a fill, with one exception below.
- One filled gold CTA ("Message to book") is allowed. It is a booking page
  for a local business; the reference sells nothing on the page.
- Source photos are Instagram screenshots 630 to 870 px wide. Full-bleed
  panels will be softer than the reference. The scrim hides some of it; the
  critic should still name it if it shows.
