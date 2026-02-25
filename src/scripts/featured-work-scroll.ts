import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger, Observer);

export const initFeaturedWorkScroll = () => {
  if (typeof window === 'undefined') return;

  const container = document.getElementById('featured-work-container');
  if (!container) return;

  const cards = gsap.utils.toArray('#featured-work-container .featured-card') as HTMLElement[];
  if (cards.length < 2) return;

  const masks = gsap.utils.toArray('.js-transition-mask .mask-slice') as HTMLElement[];
  
  // State
  let currentIndex = 0;
  let isAnimating = false;

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

  // Pin the section with ScrollTrigger
  const st = ScrollTrigger.create({
    trigger: container,
    start: 'top top',
    end: `+=${cards.length * 100}%`,
    pin: true,
    id: 'featured-work-pin',
    onEnter: () => observer.enable(),
    onEnterBack: () => {
      observer.enable();
      currentIndex = cards.length - 1;
      // Update visual state instantly
      cards.forEach((card, i) => {
        gsap.set(card, { 
          opacity: i === currentIndex ? 1 : 0, 
          pointerEvents: i === currentIndex ? 'auto' : 'none' 
        });
        const video = card.querySelector('video') as HTMLVideoElement;
        const content = card.querySelector('.card-content');
        if (video) i === currentIndex ? video.play() : video.pause();
        if (content) gsap.set(content, { opacity: i === currentIndex ? 1 : 0, y: 0 });
      });
    },
    onLeave: () => observer.disable(),
    onLeaveBack: () => observer.disable()
  });

  const gotoSlide = (index: number, direction: 'next' | 'prev') => {
    if (index < 0 || index >= cards.length || isAnimating) return;
    isAnimating = true;

    const currentCard = cards[currentIndex];
    const nextCard = cards[index];
    const currentContent = currentCard.querySelector('.card-content');
    const nextContent = nextCard.querySelector('.card-content');
    const currentVideo = currentCard.querySelector('video') as HTMLVideoElement;
    const nextVideo = nextCard.querySelector('video') as HTMLVideoElement;

    const tl = gsap.timeline({
      onComplete: () => {
        currentIndex = index;
        isAnimating = false;
        
        // BOUNDARY YIELDING:
        // If we reach the first or last slide, we disable the observer.
        // This allows the VERY NEXT scroll to be native, which immediately
        // triggers ScrollTrigger to unpin and move the page.
        if (currentIndex === 0 || currentIndex === cards.length - 1) {
          // We stay enabled here so the CURRENT gesture doesn't bleed,
          // but the handlers will check if they should yield.
        }
      }
    });

    tl.set(masks, { transformOrigin: direction === 'next' ? 'left' : 'right' });

    // Wipe IN (White)
    tl.to(masks, {
      scaleX: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.inOut'
    });

    // SWAP DATA
    tl.add(() => {
      gsap.set(currentCard, { opacity: 0, pointerEvents: 'none' });
      gsap.set(nextCard, { opacity: 1, pointerEvents: 'auto' });
      if (currentVideo) currentVideo.pause();
      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.play().catch(() => {});
      }
    });

    if (currentContent) {
      tl.to(currentContent, { 
        opacity: 0, 
        y: direction === 'next' ? -30 : 30, 
        duration: 0.3 
      }, 0);
    }

    tl.set(masks, { transformOrigin: direction === 'next' ? 'right' : 'left' });

    // Wipe OUT (Video appears)
    tl.to(masks, {
      scaleX: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.inOut'
    });

    if (nextContent) {
      tl.fromTo(nextContent, 
        { opacity: 0, y: direction === 'next' ? 30 : -30 }, 
        { opacity: 1, y: 0, duration: 0.3 }, 
        "-=0.4"
      );
    }
  };

  const observer = Observer.create({
    target: window,
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onUp: () => {
      if (isAnimating) return;
      if (currentIndex < cards.length - 1) {
        gotoSlide(currentIndex + 1, 'next');
      } else {
        // Yield to native scroll for unpinning
        observer.disable();
      }
    },
    onDown: () => {
      if (isAnimating) return;
      if (currentIndex > 0) {
        gotoSlide(currentIndex - 1, 'prev');
      } else {
        // Yield to native scroll for unpinning
        observer.disable();
      }
    },
    tolerance: 15,
    preventDefault: true
  });

  observer.disable();
};

