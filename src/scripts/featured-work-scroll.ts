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
  // We only need to prepare the incoming text content. The global mask starts hidden via CSS.
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
      snap: {
        snapTo: 1 / (cards.length - 1),
        duration: { min: 0.5, max: 1.0 },
        delay: 0,
        ease: 'power3.inOut'
      },
      anticipatePin: 1,
      invalidateOnRefresh: true,
      id: 'featured-work-pin',
    }
  });

  const masks = gsap.utils.toArray('.js-transition-mask .mask-slice') as HTMLElement[];
  const animDuration = 0.8;
  const ease = 'power3.inOut';

  // Build the sequence
  cards.slice(1).forEach((card, index) => {
    const prevCard = cards[index]; // The card currently visible before this transition
    const prevContent = prevCard.querySelector('.card-content');
    const currentContent = card.querySelector('.card-content');

    // 1. Wipe IN the white slices to cover the screen
    tl.set(masks, { transformOrigin: 'left' });

    // Fade out previous text while masks are wiping in
    if (prevContent) {
      tl.to(prevContent, {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: 'power2.inOut'
      });
    }

    // Mask wipe IN (Left to Right stagger)
    tl.to(masks, {
      scaleX: 1,
      stagger: 0.15,
      duration: animDuration,
      ease: ease,
      force3D: true
    }, "<0.2"); // Start shortly after text begins fading

    // 2. SWAP the visible card underneath the white mask
    // The mask is completely covering the screen at this point
    tl.set(prevCard, { opacity: 0, pointerEvents: 'none' });
    tl.set(card, { opacity: 1, pointerEvents: 'auto' });
    
    // 3. Wipe OUT the white slices to reveal the new screen
    // We want the white blocks to shrink away towards the right
    tl.set(masks, { transformOrigin: 'right' }); 
    
    // Mask wipe OUT
    tl.to(masks, {
      scaleX: 0,
      stagger: 0.15,
      duration: animDuration,
      ease: ease,
      force3D: true
    });

    // 4. Fade IN the new text
    if (currentContent) {
      tl.fromTo(currentContent, 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, 
        "<0.3" // Start fading text in before mask wipe out fully finishes
      );
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
