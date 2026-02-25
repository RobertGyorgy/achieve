import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Observer from 'gsap/Observer';

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
    if (i !== 0) {
      gsap.set(card, { opacity: 0, pointerEvents: 'none' });
      if (content) gsap.set(content, { opacity: 0, y: 30 });
    } else {
      gsap.set(card, { opacity: 1, pointerEvents: 'auto' });
      if (content) gsap.set(content, { opacity: 1, y: 0 });
    }
  });

  const gotoSlide = (index: number, direction: 'next' | 'prev') => {
    if (index < 0 || index >= cards.length || isAnimating) return false;
    isAnimating = true;

    const currentCard = cards[currentIndex];
    const nextCard = cards[index];
    const currentContent = currentCard.querySelector('.card-content');
    const nextContent = nextCard.querySelector('.card-content');

    const tl = gsap.timeline({
      onComplete: () => {
        currentIndex = index;
        isAnimating = false;
      }
    });

    const animDuration = 0.8;
    const ease = 'power4.inOut';

    // 1. Wipe IN masks (stagger from left to right if next, right to left if prev)
    tl.set(masks, { transformOrigin: direction === 'next' ? 'left' : 'right' });
    
    if (currentContent) {
      tl.to(currentContent, {
        opacity: 0,
        y: direction === 'next' ? -30 : 30,
        duration: 0.5,
        ease: 'power2.inOut'
      }, 0);
    }

    tl.to(masks, {
      scaleX: 1,
      stagger: direction === 'next' ? 0.15 : -0.15,
      duration: animDuration,
      ease: ease,
      force3D: true
    }, "<0.2");

    // 2. Swap physical cards midway
    tl.set(currentCard, { opacity: 0, pointerEvents: 'none' });
    tl.set(nextCard, { opacity: 1, pointerEvents: 'auto' });

    // 3. Wipe OUT masks (opposite direction)
    tl.set(masks, { transformOrigin: direction === 'next' ? 'right' : 'left' });

    tl.to(masks, {
      scaleX: 0,
      stagger: direction === 'next' ? 0.15 : -0.15,
      duration: animDuration,
      ease: ease,
      force3D: true
    });

    // 4. Fade in new text
    if (nextContent) {
      tl.fromTo(nextContent,
        { opacity: 0, y: direction === 'next' ? 30 : -30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        "<0.3"
      );
    }

    return true; // We handled the scroll
  };

  // Create an Observer to hijack scroll events while inside the section
  // It only captures if we are actually sliding between elements.
  const observer = Observer.create({
    target: window,
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onUp: () => {
      // User scrolling DOWN the page (next slide)
      if (currentIndex < cards.length - 1) {
        if (!isAnimating) gotoSlide(currentIndex + 1, 'next');
      } else {
        // At the end, let normal scrolling resume
        observer.disable();
      }
    },
    onDown: () => {
      // User scrolling UP the page (previous slide)
      if (currentIndex > 0) {
        if (!isAnimating) gotoSlide(currentIndex - 1, 'prev');
      } else {
        // At the top, let normal scrolling resume
        observer.disable();
      }
    },
    tolerance: 10,
    preventDefault: true
  });
  observer.disable(); // Only enable when pinned

  // ScrollTrigger to manage the pin boundary
  ScrollTrigger.create({
    trigger: container,
    start: 'top top',
    end: `+=${cards.length * window.innerHeight}`,
    pin: true,
    anticipatePin: 1,
    id: 'featured-work-pin',
    onEnter: () => observer.enable(),
    onEnterBack: () => {
      observer.enable();
      // Ensure we are logically back at the last slide
      if (currentIndex !== cards.length - 1) {
        currentIndex = cards.length - 1;
        cards.forEach((c, i) => gsap.set(c, { opacity: i === currentIndex ? 1 : 0 }));
      }
    },
    onLeave: () => observer.disable(),
    onLeaveBack: () => observer.disable()
  });
};
