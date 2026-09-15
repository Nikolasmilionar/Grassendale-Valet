(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav: sticky background state, and the floating DM chip ----------
     Both read the same boundary: once #heroEnd has scrolled past, the nav
     gains its solid background and the DM chip fades in. Before that the
     hero keeps its single gold fill, the "Message to book" button. */
  (function () {
    var nav = document.getElementById('siteNav');
    var heroBoundary = document.getElementById('heroEnd');
    var fab = document.getElementById('contactFab');
    if (!nav || !heroBoundary) return;

    if (!('IntersectionObserver' in window)) {
      nav.classList.add('nav--scrolled');
      if (fab) fab.classList.add('is-visible');
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          nav.classList.remove('nav--scrolled');
          if (fab) fab.classList.remove('is-visible');
        } else {
          nav.classList.add('nav--scrolled');
          if (fab) fab.classList.add('is-visible');
        }
      });
    }, { threshold: 0 });

    observer.observe(heroBoundary);
  })();

  /* ---------- Nav: active link on scroll ---------- */
  (function () {
    var navLinks = document.querySelectorAll('.nav-links a');
    if (!navLinks.length || !('IntersectionObserver' in window)) return;

    var sectionIds = ['home', 'services', 'gallery', 'reviews', 'area'];
    var sections = sectionIds
      .map(function (id) { return document.getElementById(id === 'home' ? 'heroEnd' : id); })
      .filter(Boolean);

    var linkFor = {};
    navLinks.forEach(function (link) {
      var id = link.getAttribute('href').replace('#', '');
      linkFor[id] = link;
    });

    function setActive(id) {
      navLinks.forEach(function (link) { link.classList.remove('is-active'); });
      var active = linkFor[id];
      if (active) active.classList.add('is-active');
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.dataset.navId || entry.target.id);
        }
      });
    }, { threshold: 0, rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(function (section) { observer.observe(section); });
  })();

  /* ---------- Missing image placeholders ---------- */
  document.querySelectorAll('.media-slot img').forEach(function (img) {
    var slot = img.closest('.media-slot');
    if (!slot) return;
    function markMissing() { slot.classList.add('is-missing'); }
    if (img.complete && img.naturalWidth === 0) {
      markMissing();
    } else {
      img.addEventListener('error', markMissing);
    }
  });

  /* ---------- Before / after slider ---------- */
  (function () {
    var slider = document.getElementById('baSlider');
    if (!slider) return;

    var dragging = false;

    function setPos(percent) {
      percent = Math.max(0, Math.min(100, percent));
      slider.style.setProperty('--pos', percent + '%');
      slider.setAttribute('aria-valuenow', Math.round(percent));
    }

    function posFromClientX(clientX) {
      var rect = slider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    slider.addEventListener('pointerdown', function (e) {
      dragging = true;
      slider.setPointerCapture(e.pointerId);
      setPos(posFromClientX(e.clientX));
    });
    slider.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      setPos(posFromClientX(e.clientX));
    });
    slider.addEventListener('pointerup', function () { dragging = false; });
    slider.addEventListener('pointercancel', function () { dragging = false; });

    slider.addEventListener('keydown', function (e) {
      var current = parseFloat(slider.getAttribute('aria-valuenow')) || 50;
      var step = e.shiftKey ? 20 : 5;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        setPos(current - step);
        e.preventDefault();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        setPos(current + step);
        e.preventDefault();
      } else if (e.key === 'Home') {
        setPos(0);
        e.preventDefault();
      } else if (e.key === 'End') {
        setPos(100);
        e.preventDefault();
      }
    });

    setPos(50);
  })();

  /* ---------- Enquiry form ----------
     Grassendale Valet has no phone or email, only Instagram DM, so there
     is no sms:/tel: link to hand off to. Submitting just reveals the
     copy-and-open-Instagram fallback directly, that IS the flow here,
     not a fallback for a failed deep link. */
  (function () {
    var form = document.getElementById('enquiryForm');
    if (!form) return;

    var summaryEl = document.getElementById('enquirySummary');
    var errorEl = document.getElementById('enquiryError');
    var fallbackEl = document.getElementById('enquiryFallback');
    var copyBtn = document.getElementById('copyMessageBtn');
    var copyStatus = document.getElementById('copyStatus');

    function fieldValue(name) {
      var checked = form.querySelector('input[name="' + name + '"]:checked');
      return checked ? checked.value : '';
    }

    function buildLines() {
      return {
        vehicle: form.vehicle.value.trim(),
        service: fieldValue('service'),
        postcode: form.postcode.value.trim(),
        notes: form.notes.value.trim()
      };
    }

    function renderSummary() {
      var v = buildLines();
      summaryEl.textContent =
        'Vehicle: ' + (v.vehicle || '-') + '\n' +
        'Service: ' + (v.service || '-') + '\n' +
        'Postcode: ' + (v.postcode || '-') + '\n' +
        'Notes: ' + (v.notes || '-');
    }

    function buildMessage(v) {
      var lines = [
        'Hi Grassendale Valet, I\'d like to enquire about a valet.',
        'Vehicle: ' + v.vehicle,
        'Service: ' + v.service,
        'Postcode: ' + v.postcode
      ];
      if (v.notes) lines.push('Notes: ' + v.notes);
      return lines.join('\n');
    }

    form.addEventListener('input', renderSummary);
    form.addEventListener('change', renderSummary);
    renderSummary();

    function copyViaExecCommand(text) {
      var temp = document.createElement('textarea');
      temp.value = text;
      temp.setAttribute('readonly', '');
      temp.style.position = 'absolute';
      temp.style.left = '-9999px';
      document.body.appendChild(temp);
      temp.select();
      var ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (err) {
        ok = false;
      }
      document.body.removeChild(temp);
      return ok ? Promise.resolve() : Promise.reject(new Error('execCommand copy failed'));
    }

    function copyText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).catch(function () {
          return copyViaExecCommand(text);
        });
      }
      return copyViaExecCommand(text);
    }

    var lastMessage = '';

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        copyText(lastMessage).then(function () {
          copyStatus.textContent = 'Copied.';
          setTimeout(function () { copyStatus.textContent = ''; }, 2500);
        }, function () {
          copyStatus.textContent = 'Could not copy, select the text above manually.';
          setTimeout(function () { copyStatus.textContent = ''; }, 4000);
        });
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var v = buildLines();
      var missing = [];
      if (!v.vehicle) missing.push(form.vehicle);
      if (!v.service) missing.push(form.querySelector('input[name="service"]'));
      if (!v.postcode) missing.push(form.postcode);

      if (missing.length) {
        errorEl.textContent = 'Fill in vehicle, service and postcode before sending.';
        missing[0].focus();
        return;
      }

      errorEl.textContent = '';
      lastMessage = buildMessage(v);
      fallbackEl.hidden = false;
      fallbackEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
    });
  })();

  /* ---------- Hero video: fallback photo, and getting it to actually play ----------
     hero-loop.mp4 is a boomerang cut (push in, pull back out, frame 8.0
     equals frame 0) so the native loop attribute is all the looping needs,
     no crossfade trick. The remaining problem is mobile: autoplay is often
     refused until the browser is sure the video is muted and has decoded
     a first frame, so play() is retried on several signals. The photograph
     behind stays visible until the video actually reports playing, which
     doubles as the fallback for a browser that refuses autoplay outright. */
  (function () {
    var videos = [].slice.call(document.querySelectorAll('.hero-video, .panel-video'));
    if (!videos.length) return;

    videos.forEach(function (video) {
      var still = video.parentElement.querySelector('img');
      video.addEventListener('playing', function () {
        if (still) still.classList.add('is-fallback-hidden');
      }, { once: true });
      video.muted = true;
    });

    function attemptPlay(video) {
      var playAttempt = video.play();
      if (playAttempt && playAttempt.catch) {
        playAttempt.catch(function () { /* still refused: try again on the next signal. */ });
      }
    }
    function playAllPaused() {
      videos.forEach(function (video) { if (video.paused) attemptPlay(video); });
    }

    videos.forEach(function (video) {
      attemptPlay(video);
      video.addEventListener('loadeddata', function () { attemptPlay(video); });
    });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) playAllPaused();
    });

    /* Last resort: some mobile browsers only allow playback after a user
       gesture, anywhere on the page, even before the hero is interacted
       with directly. */
    function playOnFirstGesture() {
      playAllPaused();
      document.removeEventListener('pointerdown', playOnFirstGesture);
      document.removeEventListener('touchstart', playOnFirstGesture);
    }
    document.addEventListener('pointerdown', playOnFirstGesture, { once: true, passive: true });
    document.addEventListener('touchstart', playOnFirstGesture, { once: true, passive: true });
  })();

  /* ---------- Panel video: pause while off screen ----------
     The block above starts every video playing as soon as the page loads,
     hero included, so a service panel three screens down is already
     decoding before anyone has scrolled near it. Fine on a desktop GPU,
     not fine on a phone: two videos decoding at once for the length of the
     visit is real, measurable jank on top of the scroll-driven parallax
     and flow-line work below. The hero video stays exempt, it is meant to
     be running the moment the page paints. */
  (function () {
    var panelVideos = [].slice.call(document.querySelectorAll('.panel-video'));
    if (!panelVideos.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting) {
          if (video.paused) {
            var playAttempt = video.play();
            if (playAttempt && playAttempt.catch) playAttempt.catch(function () {});
          }
        } else if (!video.paused) {
          video.pause();
        }
      });
    }, { rootMargin: '200px 0px' });

    panelVideos.forEach(function (video) { observer.observe(video); });
  })();

  /* ---------- Panel photography: parallax and opening push-in ----------
     Each panel image is taller than its frame, so it can be moved inside
     it as the panel crosses the viewport without ever exposing an edge.
     Everything is one transform written on a rAF tick, no layout reads
     during the scroll event itself. */
  (function () {
    var frames = [].slice.call(document.querySelectorAll('[data-parallax]'));
    if (!frames.length) return;

    /* A frame may hold a video with a photograph behind it as the autoplay
       fallback; every piece of media in it gets the same enlarged box and
       the same transform, so nothing slips against anything else. */
    function enlarge(el) {
      el.style.height = '118%';
      el.style.top = '-9%';
      el.style.position = 'absolute';
      el.style.left = '0';
    }

    var images = frames.map(function (frame) {
      var media = [].slice.call(frame.querySelectorAll('video, img'));
      media.forEach(enlarge);
      return { frame: frame, media: media, img: media[0], shift: 0, scale: 1 };
    }).filter(function (entry) { return entry.media.length; });

    function applyTransform(entry, value) {
      entry.media.forEach(function (el) { el.style.transform = value; });
    }

    if (prefersReducedMotion) return;

    var ticking = false;

    function update() {
      ticking = false;
      var vh = window.innerHeight;
      images.forEach(function (entry) {
        var rect = entry.frame.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        /* -1 when the panel is entering from below, +1 once it has left. */
        var progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
        var shift = Math.max(-1, Math.min(1, progress)) * -5.5;
        applyTransform(entry, 'translate3d(0,' + shift.toFixed(2) + '%,0) scale(' + entry.scale + ')');
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    /* The hero media opens with a slow push-in, the rest sit at rest. */
    images.forEach(function (entry, i) {
      entry.scale = 1;
      if (i === 0) {
        var pushIn = 'transform 2600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms cubic-bezier(0.22, 1, 0.36, 1)';
        entry.media.forEach(function (el) { el.style.transition = pushIn; });
        entry.scale = 1.09;
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            entry.scale = 1;
            update();
            setTimeout(function () {
              entry.media.forEach(function (el) { el.style.transition = ''; });
            }, 2700);
          });
        });
      }
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  })();

  /* ---------- Flow chapter: lines drawn over the still photograph ----------
     Each run is a .flow-run group of two or three joined .flow-seg paths
     (shared endpoints, tapering stroke-width). Every segment hides behind
     its own length (dasharray and dashoffset both equal to the length),
     then draws in via a plain CSS transition, staggered per run, the
     moment the panel is far enough into view. This used to be driven by a
     hand-rolled scroll-position fraction (how far the panel's own rect
     had travelled between window.innerHeight readings taken on every
     scroll event). On a phone, showing/hiding the address bar changes
     window.innerHeight out from under that math on every reversal, which
     read as a jump, and could leave a run's whole start/end window never
     reached, so only the first line ever drew. IntersectionObserver has
     the browser do that geometry itself, natively, off real layout boxes,
     with no vh anywhere in it: draw in past a visibility threshold, undo
     it below that threshold, nothing else. */
  (function () {
    var panel = document.querySelector('.panel--flow');
    if (!panel) return;
    var svg = panel.querySelector('.flow-lines');
    var img = panel.querySelector('.panel-media img');
    if (!svg || !img) return;

    /* Share the photograph's enlarged box, set by the parallax block. */
    if (img.style.height) {
      svg.style.top = img.style.top;
      svg.style.height = img.style.height;
    }

    /* .flow-run--side (the door-mirror runs) is display:none below 700px,
       see styles.css: cover-fit crops them off the visible slice on a
       phone. Skip them there instead of animating six paths nobody can
       see. */
    var hideSideRuns = window.matchMedia('(max-width: 700px)').matches;
    var runEls = [].slice.call(svg.querySelectorAll('.flow-run')).filter(function (g) {
      return !(hideSideRuns && g.classList.contains('flow-run--side'));
    });
    if (!runEls.length) return;

    var SVG_NS = 'http://www.w3.org/2000/svg';
    /* Slow and triggered early: a fast mobile flick can cross this whole
       100svh panel in well under a second, so a short draw or one that
       waits until the panel is mostly centred plays out mostly off
       screen, behind or ahead of the visible window. Starting at 15%
       visible instead of 35%, and drawing over 2.2s instead of 1.2s,
       gives it a much better chance of still being mid-draw for however
       long that scroll actually takes. */
    var DRAW_MS = 2200;
    var STEP_MS = 90; /* stagger between one run starting and the next */
    var EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'; /* matches --ease in styles.css */

    /* Wide faint body under each gold run, drawn from one continuous path
       stitched together from the run's own segments, so it shares its
       full geometry and draws in step with it. */
    var under = document.createElementNS(SVG_NS, 'g');
    var runs = runEls.map(function (g, i) {
      var segs = [].slice.call(g.querySelectorAll('.flow-seg'));
      var delay = i * STEP_MS;
      var fullD = segs.map(function (path) { return path.getAttribute('d'); })
        .reduce(function (acc, d, idx) {
          return idx === 0 ? d : acc + ' ' + d.replace(/^M\s*[-\d.]+[,\s]+[-\d.]+\s*/, '');
        }, '');
      var fullPath = document.createElementNS(SVG_NS, 'path');
      fullPath.setAttribute('d', fullD);
      var body = null;
      if (g.classList.contains('is-gold')) {
        body = fullPath.cloneNode(false);
        body.setAttribute('class', 'flow-under');
        body.style.transition = 'stroke-dashoffset ' + DRAW_MS + 'ms ' + EASE + ' ' + delay + 'ms';
        under.appendChild(body);
      }
      var lengths = segs.map(function (path) { return path.getTotalLength(); });
      segs.forEach(function (path, idx) {
        path.style.transition = 'stroke-dashoffset ' + DRAW_MS + 'ms ' + EASE + ' ' + (delay + idx * 40) + 'ms';
      });
      return {
        segs: segs, lengths: lengths, body: body, bodyLen: body ? fullPath.getTotalLength() : 0,
        drip: g.querySelector('.flow-drip'), delay: delay
      };
    });
    svg.insertBefore(under, svg.firstChild);

    function armHidden() {
      runs.forEach(function (run) {
        run.segs.forEach(function (path, idx) {
          var len = run.lengths[idx];
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = len;
        });
        if (run.body) {
          run.body.style.strokeDasharray = run.bodyLen;
          run.body.style.strokeDashoffset = run.bodyLen;
        }
        if (run.drip) {
          run.drip.style.transition = 'opacity 400ms ease ' + (run.delay + DRAW_MS) + 'ms';
          run.drip.style.opacity = 0;
        }
      });
    }

    function draw() {
      runs.forEach(function (run) {
        run.segs.forEach(function (path) { path.style.strokeDashoffset = 0; });
        if (run.body) run.body.style.strokeDashoffset = 0;
        if (run.drip) run.drip.style.opacity = 1;
      });
    }

    armHidden();

    /* Keep the svg locked to the photograph as the parallax block shifts
       it; this is a plain copy, no scroll-position math of its own. */
    function syncTransform() {
      svg.style.transform = img.style.transform;
    }
    window.addEventListener('scroll', syncTransform, { passive: true });
    window.addEventListener('resize', syncTransform);
    syncTransform();

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          draw();
        } else {
          armHidden();
        }
      });
    }, { threshold: 0.15 });
    observer.observe(panel);
  })();

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal-heading, .reveal-block, .reveal-lines');

  if (!prefersReducedMotion) {
    (function applyStaggers() {
      var seen = new Map();
      revealEls.forEach(function (el) {
        var parent = el.parentElement;
        var index = seen.get(parent) || 0;
        el.style.animationDelay = Math.min(index * 60, 420) + 'ms';
        seen.set(parent, index + 1);
      });
    })();
  }

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('js-hidden'); });

    /* The hero sits in a 100vh panel with its body pinned to the bottom
       (panel-body--hero, 7rem of bottom padding). On a phone the address
       bar makes the true visible height smaller than 100vh at first
       paint, and the observer's own -6% rootMargin can leave the hero
       headline and button just outside that shrunk root, so they never
       fire and the first screen shows no headline at all. That is too
       important to leave to the observer: reveal the hero's own children
       directly on load instead, and only trust the observer for the rest
       of the page, which has room to wait for a real scroll. */
    var heroEls = [].filter.call(revealEls, function (el) { return el.closest('#home'); });
    var restEls = [].filter.call(revealEls, function (el) { return !el.closest('#home'); });

    /* Synchronous, not on a rAF: a hidden or throttled tab never fires
       animation frames, and the first screen must not depend on one. The
       class swap happens after the hidden class was applied above, so the
       transition still runs from hidden to visible on a normal load. */
    heroEls.forEach(function (el) {
      el.classList.remove('js-hidden');
      el.classList.add('is-visible');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('js-hidden');
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });

    restEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Gallery: gold frame on touch, not just :hover ----------
     :active alone was unreliable for this on a real phone even with a
     touch listener bound elsewhere on the page, so this drives the same
     look with a class instead: added on touchstart, removed on
     touchend/touchcancel, backed by a plain JS state instead of the
     browser's own activation heuristics. */
  (function () {
    var items = document.querySelectorAll('.gallery-item');
    if (!items.length) return;
    items.forEach(function (item) {
      item.addEventListener('touchstart', function () {
        item.classList.add('is-touched');
      }, { passive: true });
      ['touchend', 'touchcancel'].forEach(function (evt) {
        item.addEventListener(evt, function () {
          item.classList.remove('is-touched');
        }, { passive: true });
      });
    });
  })();
})();
