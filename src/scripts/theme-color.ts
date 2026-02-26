import ScrollTrigger from 'gsap/ScrollTrigger';

/**
 * Dynamically updates <meta name="theme-color"> AND document.body
 * background-color based on the currently visible section.
 *
 * Chrome iOS uses the <meta> tag for bar tinting.
 * Safari iOS ignores theme-color when viewport-fit=cover is set and
 * instead samples the actual pixels behind the status bar.  Because
 * sections use env(safe-area-inset-top) padding, the body background
 * is what Safari sees in that gap — so we keep it in sync too.
 *
 * Every section that should influence the bar colour must carry a
 * `data-theme-color="#hex"` attribute.
 */

let triggers: ScrollTrigger[] = [];

function getThemeMeta(): HTMLMetaElement | null {
  return document.querySelector('meta[name="theme-color"]');
}

function setThemeColor(hex: string) {
  // Chrome iOS: reads the meta tag
  const meta = getThemeMeta();
  if (meta && meta.content !== hex) {
    meta.content = hex;
  }

  // Safari iOS: reads actual pixel content behind the status bar,
  // which is the body background visible through safe-area padding.
  document.body.style.backgroundColor = hex;
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
      start: 'top 80%',   // fire early so the bar changes before section is fully in view
      end: 'bottom 20%',
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
