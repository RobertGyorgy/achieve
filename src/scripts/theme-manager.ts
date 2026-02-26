import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Dynamically updates the browser's theme-color meta tag based on the current scroll position.
 * This ensures the mobile address bar always matches the section background for a "transparent" look.
 */
export function initThemeManager() {
  if (typeof window === 'undefined') return;

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeMeta) {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#F2F2F2';
    document.head.appendChild(meta);
  }

  const updateThemeColor = (color: string) => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', color);
  };

  // Define sections and their corresponding theme colors
  const themeSections = [
    { id: '#hero-section', color: '#F2F2F2' },
    { id: '#featured-work-container', color: '#0d141a' },
    { id: '#services', color: '#F2F2F2' }, // Adjust if services has a different background
    { id: '#about', color: '#0d0d0d' },
    { id: 'footer', color: '#0d0d0d' }
  ];

  themeSections.forEach((section) => {
    const el = document.querySelector(section.id);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => updateThemeColor(section.color),
      onEnterBack: () => updateThemeColor(section.color),
    });
  });
}
