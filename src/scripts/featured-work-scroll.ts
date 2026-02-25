import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { getScrollSmoother } from './smooth-scroll';

gsap.registerPlugin(ScrollTrigger);

const initFeaturedWorkAnimation = () => {
  if (typeof window === 'undefined') return;

  const container = document.getElementById('featured-work-container');
  if (!container) return;

  const cards = gsap.utils.toArray('#featured-work-container .featured-card') as HTMLElement[];
  if (cards.length < 2) return;

  // We want the total scroll distance to equal (number of hidden cards) * window.innerHeight
  // so each card gets exactly 1 viewport height of scroll distance to slide up.
  const totalScrollHeight = (cards.length - 1) * window.innerHeight;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: `+=${totalScrollHeight}`, // Scroll distance exactly equal to viewport * cards
      pin: true,
      scrub: 1, // Smooth scrubbing
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  // Loop through all cards except the first one (which is already visible at index 0)
  // and slide them up from yPercent: 100 (which is translate-y-full) to yPercent: 0
  cards.slice(1).forEach((card) => {
    // Ensure GSAP knows we use percent to override the Tailwind translate-y-full class cleanly
    gsap.set(card, { yPercent: 100, y: 0 }); 

    tl.to(card, {
      yPercent: 0,
      ease: 'none',
      force3D: true, // Hardware acceleration for the slide
    });
  });
};

export const initFeaturedWorkScroll = () => {
  if (typeof window === 'undefined') return;

  requestAnimationFrame(() => {
    const smoother = getScrollSmoother();
    if (smoother) {
      initFeaturedWorkAnimation();
    } else {
      initFeaturedWorkAnimation();
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 50);
    }
  });
};
