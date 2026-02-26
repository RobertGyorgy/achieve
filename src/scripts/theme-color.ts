import ScrollTrigger from 'gsap/ScrollTrigger';

/**
 * Dynamically updates <meta name="theme-color"> based on the currently
 * visible section.  Works with GSAP ScrollSmoother because it relies on
 * ScrollTrigger (which hooks into ScrollSmoother's proxy scroll), NOT
 * the native `window.scroll` event.
 *
 * Every section that should influence the Safari bar colour must carry a
 * `data-theme-color="#hex"` attribute.
 */

let triggers: ScrollTrigger[] = [];

function getThemeMeta(): HTMLMetaElement | null {
  return document.querySelector('meta[name="theme-color"]');
}

function setThemeColor(hex: string) {
  const meta = getThemeMeta();
  if (meta && meta.content !== hex) {
    meta.content = hex;
  }
}

/**
 * Call AFTER ScrollSmoother + ScrollTrigger are ready.
 */
export function initThemeColor() {
  // Clean up any previous instances (SPA navigation)
  cleanupThemeColor();

  const sections = document.querySelectorAll<HTMLElement>('[data-theme-color]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const color = section.dataset.themeColor;
    if (!color) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',   // when section's top crosses the middle of the viewport
      end: 'bottom 50%',  // when section's bottom crosses the middle
      onEnter: () => setThemeColor(color),
      onEnterBack: () => setThemeColor(color),
    });

    triggers.push(trigger);
  });

  if (import.meta.env.DEV) {
    console.log(`✓ theme-color: tracking ${triggers.length} sections`);
  }
}

/**
 * Kill all ScrollTriggers created by this module.
 */
export function cleanupThemeColor() {
  triggers.forEach((t) => t.kill());
  triggers = [];
}
