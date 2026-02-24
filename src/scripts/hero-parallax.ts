import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

/**
 * Initializes the unified parallax effect for the Hero section.
 * This function should only be called once ScrollSmoother is fully initialized.
 */
export const initHeroParallax = () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Initialize for the main portfolio index page (HeroSection.astro)
  const heroSectionMain = document.querySelector('.hero-section-container[data-scroll-section]') as HTMLElement;
  const heroContentMain = document.querySelector('.hero-section-container > .hero-middle, .hero-section-container > .hero-top, .hero-section-container > .hero-bottom') as HTMLElement; // Fallback wrapper selection

  if (heroSectionMain) {
    // Determine the exact wrapper that should fade/blur
    const wrappersToAnimate = heroSectionMain.querySelectorAll('.hero-top, .hero-middle, .hero-bottom');
    
    wrappersToAnimate.forEach((wrapper) => {
      gsap.to(wrapper, {
        scale: 0.9,
        filter: "blur(8px)",
        opacity: 0.5,
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
    });
  }

  // 2. Initialize for the standalone test page (hero-test.astro)
  const heroSectionTest = document.querySelector('main');
  const heroContainerTest = document.querySelector('.hero-test-container') as HTMLElement;

  if (heroSectionTest && heroContainerTest && document.querySelector('.hero-test-container')) {
    const wrappersToAnimateTest = document.querySelectorAll('.hero-test-container .hero-top, .hero-test-container .hero-middle, .hero-test-container .hero-bottom');
    
    wrappersToAnimateTest.forEach((wrapper) => {
      gsap.to(wrapper, {
        scale: 0.9,
        filter: "blur(8px)",
        opacity: 0.5,
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
    });
  }
};
