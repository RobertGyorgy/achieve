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

  if (heroSectionMain && heroContainerMain && !document.querySelector('.hero-test-container')) {
    gsap.to(heroContainerMain, {
      scale: 0.9,
      filter: "blur(4px)", // Lighter blur for performance
      opacity: 0.3, // Smoother fade
      ease: "none",
      force3D: true,
      scrollTrigger: {
        trigger: heroSectionMain,
        start: "bottom bottom",
        end: "bottom top",
        scrub: 0.5,
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
      },
    });
  }

  // 2. Initialize for the standalone test page (hero-test.astro)
  const heroSectionTest = document.querySelector('main');
  const heroContainerTest = document.querySelector('.hero-test-container') as HTMLElement;

  if (heroSectionTest && heroContainerTest && document.querySelector('.hero-test-container')) {
    gsap.to(heroContainerTest, {
      scale: 0.9,
      filter: "blur(4px)",
      opacity: 0.3,
      ease: "none",
      force3D: true,
      scrollTrigger: {
        trigger: heroSectionTest,
        start: "bottom bottom",
        end: "bottom top",
        scrub: 0.5,
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
      },
    });
  }
};
