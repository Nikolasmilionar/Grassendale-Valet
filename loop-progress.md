# Design loop progress

Bar: ferrari.com/en-EN/auto/296-gtb (see bar.md)
System: design-system.md
Budget: 10 credits. Spent: 9.6 (2x Seedance 1.5 Pro, 720p, 4 s).

| Piece | Status | Round | Brief | System | Craft | Biggest gap named |
|---|---|---|---|---|---|---|
| 1 Hero video | round 3 judged; remaining gaps are source limits (see note) | 3 | FAIL on environment only (autoplay while document.hidden; nav, intro and mobile checks aborted because parallel critics closed tabs) | FAIL (reveal transition clobbered .btn hover, fixed inline; intro-facts tracking 0.09em should be 0.06em, fixed inline). Everything else PASS: 2.67x, ghost nav Book, no chevron animation, fab hidden, 1.7rem at 375 | LOSE (r3: loop confirmed seamless, ratio confirmed; remaining: chapter after the hero is text with no media, and 720p footage upscaled 1.49x is soft) |

Note on piece 1: both remaining craft gaps need higher resolution source material. Every photo we have is 630 to 870 px wide, every video 1280x720. A second full-bleed media chapter would upscale a 650 px photo about 2x and lose on softness instead. This is a client-asset limit, not something another round can fix. Ask the client for original photos or shoot new ones. r3 brief confirmed fixed: one line, centred, lower third, is-visible without rAF, fab hidden. Open: none real. Lesson: run at most 3 browser critics at once. | FAIL (document.hidden true during test) | FAIL | LOSE (media throttled, reference also would not autoplay) | r2 brief: video paused at t=0 and h1/CTA still js-hidden at 375, but the critic recorded document.hidden true throughout (Browser pane hidden), which stalls rAF and media; the builder's hero reveal runs on a double rAF, so it never fires while hidden. Real lesson for r3: reveal hero children synchronously on load, never via rAF; keep play retries on visibilitychange. Nav solid, hairline below row, no gold chip on hero, no dashes: all confirmed fixed. | r2 system: only h1 ratio left, 32 px on 15 px body = 2.13x at 981 wide (clamp floor). Everything else from r1 fixed. Fix queued: floor 2.5rem, headline shortened to "Valeting, at your doorstep." so it still sets on one line. | Round 1 gap: clip plays 4 s, freezes 3 s, hard cuts back (3.95 to 0.25), five text elements besides the headline on the frame, two gold fills shout, 720p upscaled looks soft on grille edges. Round 2 fix, verified in-browser: single video now uses hero-loop.mp4 (8.04 s boomerang, native loop, no crossfade code left); currentTime tracks smoothly through the 8 to 0 wrap with no freeze (3.13 s at t=3, 7.41 s at t=7); at 375 the video plays (paused false, currentTime advancing) because muted is set before play() and play() is retried on loadeddata, visibilitychange and first pointerdown/touchstart; hero h1 and .btn-primary now get is-visible directly on load (hero elements bypass the scroll observer, which was leaving them js-hidden on a 100vh mobile viewport) so the first screen is never a blank still; nav background reads rgb(0,0,0) after scrollBy one viewport; nav "Book" is now a ghost text link, contact-fab starts hidden and fades in 300 ms after #heroEnd; chevron centred under the button, chevronDrift removed; intro-facts hairline moved below the row; hero headline forces two lines ("Premium valeting," / "at your doorstep.") below 480 px via a hidden-until-480 <br>. |
| 2 Service chapters | round 1 judged; r2 fix queued (spec strip) | 1 | PASS (loop never stalls over three wraps, fallback hidden, plays at 375, copy exact) | FAIL (video fade 500 ms vs 1500 ms reveal band; fixed inline to var(--motion), design-system clarified that panel photos have no entrance transition). Tokens, 2.67x, bullets, mobile all PASS | LOSE (five stacked text blocks in the lower-left of the Exterior Valet panel, seven gold bullets on one frame; media panels, void chapter and one-fill rule all hold; photo grading inconsistency is a source limit) | Fix queued: turn .service-includes into a single tracked line separated by middots, no bullets, so the frame carries label, headline, one strip, one link. |
| 3 Graphics panel (flow lines) | round 4, builder working (r3 findings forwarded) | 4 | FAIL (r3: four or five runs cross the grille, taper invisible at 1.45 px per unit, draw still front-loaded) | FAIL (r3: reveal transition made control hovers 1.5 s, fixed inline by switching reveals to a one-shot animation) | LOSE (r3: shape now reads as water, thick to thin with drips, but lines are straight verticals; reference streamlines are dense and curve around arches, mirrors and creases; environment also crashed tabs under 9 concurrent agents) | r2 brief PASS: scroll-driven confirmed in DOM (0% at entry, full at centre, retracts on the way up, no change while idle), no silhouette tracing, mobile clean; note the ease is front-loaded (26 to 47% drawn at 20% of travel). r2 craft LOSE stands on the read (uniform squiggles, no drips), the "never moves" part was the hidden pane. | round 2 system: 0 animations in panel, strokes #d4af37 and white at opacity 1, transitions 1500 and 250 ms only, radius 0, no dashes. Round 1: | Biggest gap (all three agree): the graphic never moves on screen, fully drawn on entry and identical across frames, and reads as a wireframe cage, not water. Root cause: timed loops instead of scroll-driven progress. Also: accent-hover used as static stroke; mobile roof arc floats in trees; gold line cuts through headlights. Global items for piece 4: circle-dot border untokened, floating DM button clutters the corner. |

## Incidents
- Round 2 launch (hero rework + three flow critics) died with HTTP 429,
  monthly spend limit on the account. Relaunched all four on Sonnet. The
  hero builder was mid-edit when it died; its replacement was told to check
  for half-applied changes first.
- Flow chapter round 2 craft LOSE was partly a measurement artefact: the
  Browser pane was hidden, so background tabs did not paint and
  requestAnimationFrame never ran after programmatic scrollIntoView. With a
  real wheel scroll the dashoffsets go 310 (hidden) to 55/55/0 (drawn), so
  the scroll-driven draw works. Still a real robustness hole: the draw must
  not depend on rAF firing; add a timeout fallback. The other craft finding
  stands: lines read as uniform squiggles, no drips, no weight change.

## Inline fixes by the orchestrator (verified in browser)
- Reveals switched from transition to a one-shot animation, so controls
  carrying reveal classes keep their own 200 ms hover: .btn transition is
  background/color/border at 0.2 s again, .link-circle color 0.2 s.
- .intro-facts tracking 0.06em. Hero h1 40 px (2.67x). Hero reveal
  synchronous. Play retries shared by hero and panel videos.

## Gap history
- Piece 3, round 1: graphic static and reads as wireframe. Fix: draw-in and drift as pure functions of scroll position, fewer thicker strokes running down and off the car, drips below the bumper, no timed loops, accent only.
- Piece 3, round 2: draw works on real scroll but not when rAF is throttled; lines still read as decoration. Fix: rAF plus timeout fallback, heavier leading strokes that thin as they fall, visible drip tails, fewer lines over the grille.
- Piece 1, round 1: video not a loop, mobile dead. Fix: boomerang hero-loop.mp4, muted-before-play with retries, hero reveals on load, one gold fill on the frame.

Piece 4 "Rest of page rhythm", round 1, built inline by the orchestrator:
gallery captions bottom-left on the image (mechanism 6), circle-arrow ring
on the --text-muted token, DM chip turned into a ghost so the page keeps
one gold fill, service lists collapsed to a single middot strip (piece 2
round 2). Flow chapter round 4 built by the builder: 10 contour-following
paths, taper 3.4 to 0.9, two grille crossings, draw starts at 20 percent
of travel with ease-in-out. All pending one final three-critic round.

## Orchestrator desktop check, 981 px, after all inline fixes
- Hero: video playing (currentTime advancing past 7 s, loop), h1 one line,
  one gold fill, fab opacity 0, nav transparent over hero, 0 console errors.
- Exterior Valet: foam video playing, middot strip in place of bullets,
  frame carries label, headline, strip, one circle link.
- Flow chapter: dashoffsets 475/475/258/278/214/225 on entry, 21/21/0/19/0/0
  after 8 wheel ticks, so the draw is scroll-driven on a real scroll.
- Gallery: captions bottom-left on every tile.
- Not run: final three-critic round. Stopped here at the user's question.

## Video jobs
- hero: done, video/hero.mp4 (1280x720, 4 s, 5.9 MB) + hero-poster.webp. Cost 4.8.
- foam: done, video/foam.mp4 (1280x720, 4 s, 6.4 MB). QUALITY PROBLEM: car
  drifts from dark to silver, and a second grille/headlight ghost appears on
  the right from about 2.5 s. Usable only as a short loop of the first
  1 to 1.5 s, or needs a retry. Decision pending with the user.
- Transactions show each job cost 2.4, not 4.8. Spent 4.8, 5.2 left.
- foam v1 kept as video/foam-v1.mp4 (ghost grille, colour drift).
- foam v2 done, video/foam.mp4 (1280x720, 4 s, 5.7 MB). Coherent car, no
  ghosting, foam runs. Car reads silver because the source frame is foam
  covered; accepted. Spent 7.2 total, 2.8 left.
- Loops rendered locally with ffmpeg-static (no credits): video/hero-loop.mp4
  (boomerang, 8.04 s, 3.4 MB) and video/foam-loop.mp4 (tail crossfaded into
  head, 3.42 s, 1.9 MB). Both 1280x720 h264 yuv420p, faststart. Checked by
  filmstrip: hero turn at 4 s is soft, frame at 8 s equals frame 0; foam
  end frame equals start frame. Both safe for native loop.

