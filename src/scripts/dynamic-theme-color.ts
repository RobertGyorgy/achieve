/**
 * Dynamically updates the theme-color meta tag to match whatever section
 * is currently at the top of the viewport. This makes the mobile address
 * bar "invisible" by camouflaging it with the page content.
 */
export function initDynamicThemeColor() {
  if (typeof window === 'undefined') return;

  const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (!meta) return;

  const update = () => {
    // Sample the element sitting right below the top of the viewport
    // Use multiple sample points across the width for reliability
    const x = window.innerWidth / 2;
    const y = 2; // Just below the very top edge

    const el = document.elementFromPoint(x, y);
    if (!el) return;

    // Walk up the DOM tree to find the nearest element with a background
    let target: Element | null = el;
    while (target && target !== document.documentElement) {
      const style = window.getComputedStyle(target);
      const bg = style.backgroundColor;

      // Skip transparent backgrounds
      if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
        meta.content = bg;
        return;
      }
      target = target.parentElement;
    }
  };

  // Run on scroll (throttled) and on load
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial update after a short delay to let the page render
  setTimeout(update, 100);
  // And again after preloader finishes (~2.5s)
  setTimeout(update, 3000);
}
