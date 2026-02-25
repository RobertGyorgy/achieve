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

  // Immediately hide all cards except the first one
  gsap.set(cards.slice(1), { yPercent: 100, y: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: `+=${totalScrollHeight}`, // Scroll distance exactly equal to viewport * cards
      pin: true,
      scrub: 1, // Smooth scrubbing
      anticipatePin: 1,
      invalidateOnRefresh: true,
      id: 'featured-work-pin',
    }
  });

  // Loop through all hidden cards and slide them up from yPercent: 100 to yPercent: 0
  cards.slice(1).forEach((card) => {
    tl.to(card, {
      yPercent: 0,
      ease: 'none',
      force3D: true, // Hardware acceleration for the slide
    });
  });
};

export const initFeaturedWorkScroll = () => {
  if (typeof window === 'undefined') return;

  // Kill existing triggers to prevent duplicates
  ScrollTrigger.getAll().forEach(trigger => {
    if ((trigger.vars as any).id === 'featured-work-pin') {
      trigger.kill();
    }
  });

  // Always initialize the animation to ensure DOM is bound
  initFeaturedWorkAnimation();

  // Force a refresh after layout to lock strictly to DOM dims
  requestAnimationFrame(() => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  });
};
