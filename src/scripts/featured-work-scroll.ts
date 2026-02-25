import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initFeaturedWorkScroll = () => {
  if (typeof window === 'undefined') return;

  const container = document.getElementById('featured-work-container');
  if (!container) return;

  const cards = gsap.utils.toArray('#featured-work-container .featured-card') as HTMLElement[];
  if (cards.length < 2) return;

  const masks = gsap.utils.toArray('.js-transition-mask .mask-slice') as HTMLElement[];
  
  // State
  let currentIndex = 0;

  // Initial Setup
  cards.forEach((card, i) => {
    const content = card.querySelector('.card-content');
    const video = card.querySelector('video');
    
    if (i !== 0) {
      gsap.set(card, { opacity: 0, pointerEvents: 'none' });
      if (content) gsap.set(content, { opacity: 0, y: 30 });
      if (video) video.pause();
    } else {
      gsap.set(card, { opacity: 1, pointerEvents: 'auto' });
      if (content) gsap.set(content, { opacity: 1, y: 0 });
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    }
  });

  // Create Master Sliced Reveal Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: `+=${cards.length * 150}%`,
      pin: true,
      scrub: 1,
      id: 'featured-work-scroll',
      onUpdate: (self) => {
        // Calculate current index based on progress
        const segment = 1 / (cards.length - 1);
        const newIndex = Math.round(self.progress / segment);
        
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < cards.length) {
          // Play active video, pause others
          cards.forEach((card, i) => {
            const video = card.querySelector('video');
            if (video) {
              if (i === newIndex) {
                video.play().catch(() => {});
              } else {
                video.pause();
              }
            }
          });
          currentIndex = newIndex;
        }
      },
      snap: {
        snapTo: 1 / (cards.length - 1),
        duration: { min: 0.2, max: 0.5 },
        delay: 0.1,
        ease: 'power2.inOut'
      }
    }
  });

  // Build the transitions in the timeline
  cards.forEach((_, i) => {
    if (i === cards.length - 1) return; // Last card doesn't transition to a next one

    const currentCard = cards[i];
    const nextCard = cards[i + 1];
    const currentContent = currentCard.querySelector('.card-content');
    const nextContent = nextCard.querySelector('.card-content');

    // MASK TRANSITION (WHITE WIPE)
    tl.set(masks, { transformOrigin: 'left' }, i);
    tl.to(masks, {
      scaleX: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: 'none'
    }, i);

    // SWAP CONTENT
    tl.set(currentCard, { opacity: 0, pointerEvents: 'none' }, i + 0.5);
    tl.set(nextCard, { opacity: 1, pointerEvents: 'auto' }, i + 0.5);
    
    if (currentContent) {
      tl.to(currentContent, { opacity: 0, y: -30, duration: 0.3 }, i);
    }
    if (nextContent) {
      tl.fromTo(nextContent, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.3 }, 
        i + 0.6
      );
    }

    // REVEAL NEXT PROJECT (WHITE DISAPPEARS)
    tl.set(masks, { transformOrigin: 'right' }, i + 0.5);
    tl.to(masks, {
      scaleX: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'none'
    }, i + 0.5);
  });
};
