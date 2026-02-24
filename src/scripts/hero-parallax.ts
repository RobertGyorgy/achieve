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
  const isMobileDevice = isMobile();
  const calculatedPinType = isMobileDevice ? "fixed" : "transform";

  // 1. Initialize for the main portfolio index page (HeroSection.astro)
  // The 'section' at the root of HeroSection.astro is the trigger
  const heroSectionMain = document.querySelector('#hero-section') || document.querySelector('section.bg-\\[\\#F2F2F2\\]');
  const heroContainerMain = document.querySelector('.hero-section-container') as HTMLElement;
  const hybridWrapperMain = document.querySelector('#hero-hybrid-wrapper') as HTMLElement;


  if (heroSectionMain && heroContainerMain && !document.querySelector('.hero-test-container')) {
    // If mobile, trigger off the 200vh wrapper instead of the sticky content so it stays active
    const triggerTarget = isMobileDevice && hybridWrapperMain ? hybridWrapperMain : heroSectionMain;
    
    gsap.to(heroContainerMain, {
      scale: 0.9,
      filter: "blur(4px)",
      opacity: 0,
      ease: "none",
      force3D: true,
      scrollTrigger: {
        trigger: triggerTarget,   // Pin the section itself (or wrapper on mobile)
        start: "top top",         // Start when it hits top of viewport
        end: "+=100%",            // Pin for full height of viewport
        scrub: 1,
        pin: !isMobileDevice,     // NEVER pin on mobile via GSAP, use native CSS instead
        pinSpacing: false,        
        invalidateOnRefresh: true,
      },
    });
  }

  // 2. Initialize for the standalone test page (hero-test.astro)
  // On the standalone test page, trigger off the main wrapper
  const heroSectionTest = document.querySelector('main') || document.querySelector('.hero-test-container')?.closest('section');
  const heroContainerTest = document.querySelector('.hero-test-container') as HTMLElement;
  const hybridWrapperTest = document.querySelector('#hero-hybrid-wrapper') as HTMLElement;


  if (heroSectionTest && heroContainerTest) {
    const triggerTargetTest = isMobileDevice && hybridWrapperTest ? hybridWrapperTest : heroSectionTest;
    
    gsap.to(heroContainerTest, {
      scale: 0.9,
      filter: "blur(4px)",
      opacity: 0,
      ease: "none",
      force3D: true,
      scrollTrigger: {
        trigger: triggerTargetTest,
        start: "top top",
        end: "+=100%", 
        scrub: 1,         
        pin: !isMobileDevice,
        pinSpacing: false,
        invalidateOnRefresh: true,
      },
    });
  }
};
