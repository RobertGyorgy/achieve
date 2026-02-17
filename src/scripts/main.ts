import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { initializeGsap, setupPageTransitions } from './gsap-utils';
import { initTextAnimations } from '../utils/RevealAnimationHandler';
import { initWorkSection, initServicesSection } from './scroll-stack';
import { initSmoothScroll, cleanupSmoothScroll } from './smooth-scroll';
import { initBackgroundTransition } from './background-transition';
import { initFAQAccordion } from './faq-accordion';
import { initFAQAnimations } from './faq-animations';
import { initPreloader } from './preloader';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize all animations and interactions on page load
 */
async function initializeApp() {
  // Initialize GSAP
  initializeGsap();

  // Run Preloader (Unlocks scroll when done)
  initPreloader();

  // Initialize Smooth Scroll first
  await initSmoothScroll();

  // Defer heavy lifting to next frame to allow DOM to settle
  requestAnimationFrame(() => {
    setupPageTransitions();
    initTextAnimations();
    initWorkSection();
    initServicesSection();
    initBackgroundTransition();
    initFAQAccordion();
    initFAQAnimations();

    // Critical: refreshing ScrollTrigger too early on reload can cause freezes.
    // We wait 100ms to ensure layout is stable.
    setTimeout(() => {
      ScrollTrigger.refresh();
      if (import.meta.env.DEV) {
        console.log('✓ Achieve Studio - Animations initialized & Refreshed');
      }
    }, 100);
  });
}

// Initialize on page load
document.addEventListener('astro:page-load', () => {
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

// Initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
