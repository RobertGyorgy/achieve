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
  // All cards are stacked at inset-0 and rendered.
  // The CSS clip-path polygons handle hiding the incoming cards.
  // We only need to hide the incoming text content.
  cards.slice(1).forEach((card) => {
    const content = card.querySelector('.card-content');
    if (content) gsap.set(content, { opacity: 0, y: 30 });
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
    const prevContent = prevCard.querySelector('.card-content');
    const currentContent = card.querySelector('.card-content');

    const whites = [
      card.querySelector('.slice-white-0'),
      card.querySelector('.slice-white-1'),
      card.querySelector('.slice-white-2')
    ];

    const videos = [
      card.querySelector('.slice-video-0'),
      card.querySelector('.slice-video-1'),
      card.querySelector('.slice-video-2')
    ];

    // 1. Fade out the previous card's text
    if (prevContent) {
      tl.to(prevContent, {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: 'power2.inOut'
      });
    }

    const animDuration = 0.8;
    const ease = 'power3.inOut';

    // 2 & 3. Iterate through columns 0, 1, 2 to create the Left-to-Right stagger wave.
    // Inside each column, the clip-path animates right-to-left.
    whites.forEach((w, i) => {
      if (!w || !videos[i]) return;
      const whiteEl = w as HTMLElement;
      const videoEl = videos[i] as HTMLElement;
      
      const whiteFull = whiteEl.dataset.full;
      const videoFull = videoEl.dataset.full;

      // Position: First slice waits a bit after text fade. Subsequent slices wait relative to previous video wipe.
      const posWhite = i === 0 ? "<0.2" : "<0.15";
      
      tl.to(whiteEl, { clipPath: whiteFull, duration: animDuration, ease }, posWhite);
      tl.to(videoEl, { clipPath: videoFull, duration: animDuration, ease }, "<0.2"); // Video tracks closely behind white
    });

    // 4. Fade in the new card's text
    if (currentContent) {
      tl.to(currentContent, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, "<0.4");
    }
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
