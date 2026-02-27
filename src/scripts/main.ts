import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { initializeGsap } from './gsap-utils';
import { initTextAnimations } from '../utils/RevealAnimationHandler';
import { initServicesSection } from './scroll-stack';
import { initFeaturedWorkScroll } from './featured-work-scroll';
import { initSmoothScroll, getScrollSmoother } from './smooth-scroll';
import { initFAQAccordion } from './faq-accordion';
import { initFAQAnimations } from './faq-animations';
import { initHeroParallax } from './hero-parallax';

if (typeof history !== 'undefined' && history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

gsap.registerPlugin(ScrollTrigger);

/**
 * Force scroll to absolute top — resets both native scroll
 * and GSAP ScrollSmoother internal position.
 */
function forceScrollToTop() {
  window.scrollTo(0, 0);
  const sm = getScrollSmoother();
  if (sm) {
    sm.scrollTo(0, false);
  }
}

/**
 * Initialize all animations and interactions on page load.
 * Called once — either via astro:page-load or DOMContentLoaded fallback.
 */
let hasInitialized = false;

async function initializeApp() {
  if (hasInitialized) return;
  hasInitialized = true;

  initializeGsap();
  await initSmoothScroll();

  requestAnimationFrame(() => {
    initTextAnimations();
    initFeaturedWorkScroll();
    initServicesSection();
    initFAQAccordion();
    initFAQAnimations();
    initHeroParallax();

    const refreshDelay = window.innerWidth < 1024 ? 400 : 200;

    setTimeout(() => {
      forceScrollToTop();
      ScrollTrigger.refresh();
      document.dispatchEvent(new Event('scroll-smoother-ready'));
    }, refreshDelay);
  });
}

// Primary init path: Astro fires this on every page load
document.addEventListener('astro:page-load', () => {
  forceScrollToTop();
  initializeApp();
});

// Fallback: if astro:page-load doesn't fire (non-Astro context)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    forceScrollToTop();
    initializeApp();
  });
} else {
  forceScrollToTop();
  initializeApp();
}

// Force scroll to top on manual reload before JS initializes
if (typeof window !== 'undefined') {
  window.onbeforeunload = function () {
    forceScrollToTop();
  };
}
