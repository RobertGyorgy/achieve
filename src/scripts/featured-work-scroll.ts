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

  const totalScrollHeight = (cards.length - 1) * window.innerHeight * 1.5; // Slightly longer for the multi-step wiping

  // Initial Setup: 
  // All cards are stacked at inset-0.
  // We need to hide the slices of all cards EXCEPT the first one.
  cards.slice(1).forEach((card) => {
    const whites = card.querySelectorAll('.slice-white');
    const videos = card.querySelectorAll('.slice-video');
    const content = card.querySelector('.relative.z-50'); // The text content
    
    // Push slices offscreen to the right
    gsap.set(whites, { xPercent: 100 });
    gsap.set(videos, { xPercent: 100 });
    // Hide incoming text
    gsap.set(content, { opacity: 0, y: 30 });
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: `+=${totalScrollHeight}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      id: 'featured-work-pin',
    }
  });

  // Build the sequence
  cards.slice(1).forEach((card, index) => {
    const prevCard = cards[index]; // The card currently visible before this transition
    const prevContent = prevCard.querySelector('.relative.z-50');
    
    const whites = card.querySelectorAll('.slice-white');
    const videos = card.querySelectorAll('.slice-video');
    const currentContent = card.querySelector('.relative.z-50');

    // 1. Fade out the previous card's text
    tl.to(prevContent, {
      opacity: 0,
      y: -30,
      duration: 0.5,
      ease: 'power2.inOut'
    });

    // 2. White wipe from right to left, all 3 columns simultaneously
    tl.to(whites, {
      xPercent: 0,
      duration: 0.8,
      ease: 'power3.inOut',
      force3D: true
    }, "<0.2"); // Start slightly after text begins fading

    // 3. Video wipe closely following the white wipe
    tl.to(videos, {
      xPercent: 0,
      duration: 0.8,
      ease: 'power3.inOut',
      force3D: true
    }, "<0.3"); // Overlap with the white wipe

    // 4. Fade in the new card's text
    tl.to(currentContent, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, "<0.4");
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
