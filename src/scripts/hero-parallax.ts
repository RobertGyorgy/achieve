import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

/**
 * Initializes the unified parallax effect for the Hero section.
 * This function should only be called once ScrollSmoother is fully initialized.
 */
export const initHeroParallax = () => {
  gsap.registerPlugin(ScrollTrigger);

  const isMobileDevice = window.innerWidth < 1024;

  // 1. Initialize for the main portfolio index page (HeroSection.astro)
  const heroSectionMain = document.querySelector('#hero-section');
  const heroContentMain = document.querySelector('#hero-content-wrapper') as HTMLElement;
  const isTestPage = document.querySelector('.hero-test-container') !== null;

  if (heroSectionMain && heroContentMain && !isTestPage) {
    if (isMobileDevice) {
      // Per reference logic: Disable GSAP pin and exit animation on mobile
      (heroSectionMain as HTMLElement).dataset.exitAnimInit = "true";
      // We skip setting up the trigger so it just scrolls natively.
    } else {
      gsap.to(heroContentMain, {
        scale: 0.9,
        filter: "blur(8px)",
        opacity: 0.5,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: heroSectionMain,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
          pin: true, 
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      });
      (heroSectionMain as HTMLElement).dataset.exitAnimInit = "true";
    }
  }

  // 2. Initialize for the standalone test page (hero-test.astro)
  const heroSectionTest = document.querySelector('main');
  const heroContentTest = document.querySelector('.hero-test-container') as HTMLElement;

  if (heroSectionTest && heroContentTest && isTestPage) {
    if (isMobileDevice) {
      (heroSectionTest as HTMLElement).dataset.exitAnimInit = "true";
    } else {
      gsap.to(heroContentTest, {
        scale: 0.9,
        filter: "blur(8px)",
        opacity: 0.5,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: heroSectionTest,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
          pin: true, 
          pinSpacing: false,
          invalidateOnRefresh: true,
        },
      });
      (heroSectionTest as HTMLElement).dataset.exitAnimInit = "true";
    }
  }
};
