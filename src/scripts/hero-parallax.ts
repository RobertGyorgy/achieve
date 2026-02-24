import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

/**
 * Initializes the unified parallax effect for the Hero section.
 * This function should only be called once ScrollSmoother is fully initialized.
 */
export const initHeroParallax = () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Initialize for the main portfolio index page (HeroSection.astro)
  // The 'section' at the root of HeroSection.astro is the trigger
  const heroSectionMain = document.querySelector('#hero-section') || document.querySelector('section.bg-\\[\\#F2F2F2\\]');
  const heroContainerMain = document.querySelector('.hero-section-container') as HTMLElement;
  const introSectionMain = document.querySelector('.intro-text-section');

  if (heroSectionMain && heroContainerMain && introSectionMain && !document.querySelector('.hero-test-container')) {
    gsap.to(heroContainerMain, {
      scale: 0.9,
      filter: "blur(4px)", // Lighter blur for performance
      opacity: 0, // Fade out completely as intro overlaps
      ease: "none",
      force3D: true,
      scrollTrigger: {
        trigger: introSectionMain, // Driven by the Intro section climbing up
        start: "top bottom",       // Start when Intro enters viewport
        end: "top top",            // Finish when Intro reaches top of viewport
        scrub: 1,
        pin: false, // CSS Sticky handles pinning perfectly with zero lag
        invalidateOnRefresh: true,
      },
    });
  }

  // 2. Initialize for the standalone test page (hero-test.astro)
  const heroSectionTest = document.querySelector('main');
  const heroContainerTest = document.querySelector('.hero-test-container') as HTMLElement;
  const introSectionTest = document.querySelector('.intro-test-section');

  if (heroSectionTest && heroContainerTest && introSectionTest) {
    gsap.to(heroContainerTest, {
      scale: 0.9,
      filter: "blur(4px)",
      opacity: 0,
      ease: "none",
      force3D: true,
      scrollTrigger: {
        trigger: introSectionTest,
        start: "top bottom",
        end: "top top", 
        scrub: 1,         
        pin: false, 
        invalidateOnRefresh: true,
      },
    });
  }
};
