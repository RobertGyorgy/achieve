/**
 * Safari iOS bar tinting — dual-layer approach:
 *
 * 1. A `position: fixed` fill element covers the safe-area-inset-top zone.
 *    Safari samples the pixels at y=0 behind the address bar — this element
 *    guarantees the correct colour is always there, regardless of what section
 *    or body background is underneath.
 *
 * 2. <meta name="theme-color"> is also kept in sync for Chrome iOS, which
 *    reads the meta tag instead of sampling pixels.
 *
 * 3. On mobile (native scroll, no ScrollSmoother) we use a passive scroll
 *    listener + getBoundingClientRect to find the topmost section.
 *    On desktop (ScrollSmoother transforms the DOM instead of scrolling)
 *    we wire into the smoother's `onUpdate` callback.
 *
 * Every section that should influence the bar colour must have a
 * `data-theme-color="#hex"` attribute.
 */

const HERO_COLOR = '#F2F2F2';

let fillEl: HTMLDivElement | null = null;
let scrollHandler: (() => void) | null = null;
let smootherCleanup: (() => void) | null = null;

// ─── helpers ────────────────────────────────────────────────────────────────

function applyColor(hex: string) {
  // <html> background — the single property Safari reads to tint the address bar
  // and status bar. Works on both mobile (native scroll) and desktop (ScrollSmoother).
  document.documentElement.style.backgroundColor = hex;

  // smooth-wrapper — visual background on desktop (position:fixed, full-screen).
  // Prevents gap colour showing through during ScrollTrigger pin animations.
  const smoothWrapper = document.getElementById('smooth-wrapper');
  if (smoothWrapper) smoothWrapper.style.backgroundColor = hex;
}

/** Return the data-theme-color of the section whose top edge is closest
 *  to (but still ≤) the top of the viewport. */
function colorFromSections(sections: HTMLElement[]): string {
  let best = HERO_COLOR;
  let bestTop = -Infinity;
  for (const section of sections) {
    const top = section.getBoundingClientRect().top;
    // Section is "at the top" when its top edge has reached or passed y=0.
    // Using <= 1px so we trigger exactly when the section reaches the top edge,
    // not 50% through — that was causing the bar to change color too early.
    if (top <= 1 && top > bestTop) {
      bestTop = top;
      best = section.dataset.themeColor ?? best;
    }
  }
  return best;
}

// ─── exported API ────────────────────────────────────────────────────────────

export function initThemeColor() {
  cleanupThemeColor();

  // ── 1. Create the fixed safe-area fill element ──────────────────────────
  if (!fillEl) {
    fillEl = document.createElement('div');
    fillEl.id = 'safari-bar-fill';
    Object.assign(fillEl.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      // Fill the safe-area-inset-top (notch) zone
      height: 'env(safe-area-inset-top, 0px)',
      zIndex: '9997',
      pointerEvents: 'none',
      // Transparent — black-translucent status bar meta makes content show through
      backgroundColor: 'transparent',
    });
    document.body.appendChild(fillEl);
  }

  const sections = Array.from(
    document.querySelectorAll<HTMLElement>('[data-theme-color]')
  );
  if (!sections.length) return;

  // Apply correct colour immediately (handles page refresh mid-scroll)
  const initialColor = colorFromSections(sections);
  applyColor(initialColor);
  
  if (import.meta.env.DEV) {
    console.log(`🎨 theme-color: initial color ${initialColor}, tracking ${sections.length} sections`);
  }

  // ── 2. Native scroll listener (mobile / no ScrollSmoother) ───────────────
  // On mobile, ScrollSmoother is disabled and the page scrolls natively.
  // window scroll events fire reliably here.
  scrollHandler = () => {
    const newColor = colorFromSections(sections);
    if (import.meta.env.DEV) {
      console.log(`📱 scroll event: applying color ${newColor}`);
    }
    applyColor(newColor);
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });

  // ── 3. ScrollSmoother hook (desktop) ─────────────────────────────────────
  // ScrollSmoother moves #smooth-content via CSS transform instead of
  // native scroll, so window.scroll events don't fire on desktop.
  // We poll via requestAnimationFrame when the smoother is active to keep
  // the bar colour in sync.
  let rafId = 0;
  let lastProgress = -1;

  const smootherPoll = () => {
    // Import dynamically to avoid circular deps; falls back if unavailable
    import('./smooth-scroll').then(({ getScrollSmoother }) => {
      const sm = getScrollSmoother();
      if (!sm) return; // Mobile / no smoother — native scroll listener handles it

      const tick = () => {
        rafId = requestAnimationFrame(tick);
        const p = sm.scrollTop();
        if (p !== lastProgress) {
          lastProgress = p;
          const newColor = colorFromSections(sections);
          if (import.meta.env.DEV) {
            console.log(`🖥️ smoother scrollTop ${p}px: applying color ${newColor}`);
          }
          applyColor(newColor);
        }
      };
      rafId = requestAnimationFrame(tick);

      smootherCleanup = () => {
        cancelAnimationFrame(rafId);
      };
    });
  };

  // Wait for smoother to be ready (it's async)
  document.addEventListener('scroll-smoother-ready', smootherPoll, { once: true });
  // Also kick off immediately in case event already fired
  smootherPoll();

  if (import.meta.env.DEV) {
    console.log(`✓ theme-color: tracking ${sections.length} sections`);
  }
}

export function resetThemeColor() {
  applyColor(HERO_COLOR);
}

export function cleanupThemeColor() {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
    scrollHandler = null;
  }
  if (smootherCleanup) {
    smootherCleanup();
    smootherCleanup = null;
  }
  // Remove the fill element so it gets re-created cleanly on next init
  if (fillEl) {
    fillEl.remove();
    fillEl = null;
  }
}
