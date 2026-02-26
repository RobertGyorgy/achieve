import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { initializeGsap, setupPageTransitions } from './gsap-utils';
import { initTextAnimations } from '../utils/RevealAnimationHandler';
import { initServicesSection } from './scroll-stack';
import { initFeaturedWorkScroll } from './featured-work-scroll';
import { initSmoothScroll, cleanupSmoothScroll, getScrollSmoother } from './smooth-scroll';
import { initBackgroundTransition } from './background-transition';
import { initFAQAccordion } from './faq-accordion';
import { initFAQAnimations } from './faq-animations';
import { initHeroParallax } from './hero-parallax';
// theme-color.ts removed — Safari address bar uses native glass when
// html/body are transparent and no <meta name="theme-color"> exists.

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
    sm.scrollTo(0, false); // instant, no animation
  }

}

/**
 * Initialize all animations and interactions on page load
 */
async function initializeApp() {
  // Initialize GSAP
  initializeGsap();

  // Initialize Smooth Scroll first
  await initSmoothScroll();

  // Defer heavy lifting to next frame to allow DOM to settle
  requestAnimationFrame(() => {
    setupPageTransitions();
    initTextAnimations();
    initFeaturedWorkScroll();
    initServicesSection();
    initBackgroundTransition();
    initFAQAccordion();
    initFAQAnimations();
    initHeroParallax();

    // Critical: refreshing ScrollTrigger too early on reload can cause jumps.
    // We wait longer on mobile for full paint.
    const refreshDelay = window.innerWidth < 1024 ? 400 : 200;
    
    setTimeout(() => {
      // Always pull to the top on reload
      forceScrollToTop();
      
      ScrollTrigger.refresh();



      document.dispatchEvent(new Event('scroll-smoother-ready'));
      
      if (import.meta.env.DEV) {
        console.log('✓ Achieve Studio - Animations initialized & Refreshed');
      }
    }, refreshDelay);
  });
}

// Initialize on page load
document.addEventListener('astro:page-load', () => {
  forceScrollToTop();
  initializeApp();
});

// Cleanup on page navigation
document.addEventListener('astro:before-swap', () => {
  // Kill all GSAP animations
  gsap.killTweensOf('*');
  // Cleanup ScrollTrigger
  ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
  cleanupSmoothScroll();
});

// Force scroll to top on manual reload before JS initializes
if (typeof window !== 'undefined') {
  window.onbeforeunload = function () {
    forceScrollToTop();
  };
}

// Initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    forceScrollToTop();
    initializeApp();
  });
} else {
  forceScrollToTop();
  initializeApp();
}
