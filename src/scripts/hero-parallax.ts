import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { isMobile } from './smooth-scroll';

/**
 * Initializes the unified parallax effect for the Hero section.
 * This function should only be called once ScrollSmoother is fully initialized.
 */
export const initHeroParallax = () => {
  gsap.registerPlugin(ScrollTrigger);

  // Determine correct pin type based on environment context
  const hasSmoothWrapper = document.querySelector('#smooth-wrapper') !== null;
  const smoothWrapperIsStatic = hasSmoothWrapper ? (document.querySelector('#smooth-wrapper') as HTMLElement).style.position === 'static' : true;
  // If ScrollSmoother is disabled (like on mobile), we MUST use 'fixed'
  // HARDCODED: testing fixed on all platforms for parity
  const calculatedPinType = isMobile() ? "fixed" : "transform";

  // 1. Initialize for the main portfolio index page (HeroSection.astro)
  // The 'section' at the root of HeroSection.astro is the trigger
  const heroSectionMain = document.querySelector('#hero-section') || document.querySelector('section.bg-\\[\\#F2F2F2\\]');
  const heroContainerMain = document.querySelector('.hero-section-container') as HTMLElement;


  if (heroSectionMain && heroContainerMain && !document.querySelector('.hero-test-container')) {
    gsap.to(heroContainerMain, {
      scale: 0.9,
      filter: "blur(4px)",
      opacity: 0,
      ease: "none",
      force3D: true,
      scrollTrigger: {
        trigger: heroSectionMain, // Pin the section itself
        start: "top top",         // Start when it hits top of viewport
        end: "+=100%",            // Pin for full height of viewport
        scrub: 1,
        pin: true,                // Reactivate GSAP pin
        pinSpacing: false,        // Let next section slide over!
        pinType: calculatedPinType, // Use 'fixed' on mobile natively
        invalidateOnRefresh: true,
      },
    });
  }

  // 2. Initialize for the standalone test page (hero-test.astro)
  const heroSectionTest = document.querySelector('main');
  const heroContainerTest = document.querySelector('.hero-test-container') as HTMLElement;


  if (heroSectionTest && heroContainerTest) {
    gsap.to(heroContainerTest, {
      scale: 0.9,
      filter: "blur(4px)",
      opacity: 0,
      ease: "none",
      force3D: true,
      scrollTrigger: {
        trigger: heroSectionTest,
        start: "top top",
        end: "+=100%", 
        scrub: 1,         
        pin: true,
        pinSpacing: false,
        pinType: calculatedPinType,
        invalidateOnRefresh: true,
      },
    });
  }
};
