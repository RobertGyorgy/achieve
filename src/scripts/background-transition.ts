/**
 * Body-background transition (Safari iOS address-bar fix).
 *
 * Safari samples `<body>` background-color for the address bar tint.
 * When body is transparent it defaults to white, which doesn't match
 * dark sections.  This module creates a ScrollTrigger per section that
 * has a `data-theme-color` attribute and smoothly transitions body's
 * background-color to keep Safari's bar in sync with the visible content.
 *
 * Inspired by the reference site's theme-transition.ts approach.
 */
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initBackgroundTransition() {
  if (typeof window === 'undefined') return;

  // Collect every section that declares a theme colour
  const sections = document.querySelectorAll<HTMLElement>('[data-theme-color]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const color = section.dataset.themeColor;
    if (!color) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',   // when top-half of section reaches viewport centre
      end: 'bottom 50%',  // until bottom-half leaves viewport centre
      onEnter: () => gsap.to('body', { backgroundColor: color, duration: 0.4, ease: 'power2.inOut', overwrite: true }),
      onEnterBack: () => gsap.to('body', { backgroundColor: color, duration: 0.4, ease: 'power2.inOut', overwrite: true }),
    });
  });
}

