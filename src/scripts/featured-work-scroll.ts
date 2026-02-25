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
    if (i !== 0) {
      gsap.set(card, { opacity: 0, pointerEvents: 'none' });
      if (content) gsap.set(content, { opacity: 0, y: 30 });
    } else {
      gsap.set(card, { opacity: 1, pointerEvents: 'auto' });
      if (content) gsap.set(content, { opacity: 1, y: 0 });
    }
  });

  const vh = window.innerHeight || 800;

  // ScrollTrigger to manage the pin boundary - MASSIVE BUFFER for captive pinning
  const st = ScrollTrigger.create({
    trigger: container,
    start: 'top top',
    end: `+=${cards.length * 400}%`, // Huge buffer to win against "momentum"
    pin: true,
    anticipatePin: 1,
    id: 'featured-work-pin',
    onEnter: () => {
      observer.enable();
      anchorScroll();
    },
    onEnterBack: () => {
      observer.enable();
      anchorScroll();
      if (currentIndex !== cards.length - 1) {
        currentIndex = cards.length - 1;
        updateSlidesInstant();
      }
    },
    onLeave: () => observer.disable(),
    onLeaveBack: () => observer.disable()
  });

  // Keep the user "locked" in the middle of the pin space, but move to "Exit Gates" at ends
  function anchorScroll() {
    let targetScroll = st.start + (st.end - st.start) / 2; // Default to middle
    
    if (currentIndex === 0) {
      targetScroll = st.start + 5; // Near top gate
    } else if (currentIndex === cards.length - 1) {
      targetScroll = st.end - 5; // Near bottom gate
    }

    gsap.to(window, {
      scrollTo: targetScroll,
      duration: 0.3,
      overwrite: true,
      ease: 'power2.out'
    });
  }

  function updateSlidesInstant() {
    cards.forEach((c, i) => {
      gsap.set(c, { 
        opacity: i === currentIndex ? 1 : 0, 
        pointerEvents: i === currentIndex ? 'auto' : 'none' 
      });
      const content = c.querySelector('.card-content');
      if (content) gsap.set(content, { opacity: i === currentIndex ? 1 : 0, y: 0 });
    });
  }

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
        anchorScroll(); // Move the car to the correct "gate"
      }
    });

    const animDuration = 0.7;
    const ease = 'power3.inOut';

    tl.set(masks, { transformOrigin: direction === 'next' ? 'left' : 'right' });
    
    if (currentContent) {
      tl.to(currentContent, {
        opacity: 0,
        y: direction === 'next' ? -30 : 30,
        duration: 0.4,
        ease: 'power2.inOut'
      }, 0);
    }

    tl.to(masks, {
      scaleX: 1,
      duration: animDuration,
      stagger: 0.1,
      ease: ease,
      force3D: true
    }, "<0.1");

    tl.set(currentCard, { opacity: 0, pointerEvents: 'none' });
    tl.set(nextCard, { opacity: 1, pointerEvents: 'auto' });

    tl.set(masks, { transformOrigin: direction === 'next' ? 'right' : 'left' });

    tl.to(masks, {
      scaleX: 0,
      duration: animDuration,
      stagger: 0.1,
      ease: ease,
      force3D: true
    });

    if (nextContent) {
      tl.fromTo(nextContent,
        { opacity: 0, y: direction === 'next' ? 30 : -30 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        "<0.2"
      );
    }

    return true;
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
        // BREAK OUT DOWN: We are already at st.end - 5, so one more swipe unpins us
        observer.disable();
        gsap.to(window, { 
          scrollTo: st.end + 200, 
          duration: 0.8,
          ease: 'power2.inOut'
        });
      }
    },
    onDown: () => {
      if (isAnimating) return;
      if (currentIndex > 0) {
        gotoSlide(currentIndex - 1, 'prev');
      } else {
        // BREAK OUT UP: We are already at st.start + 5
        observer.disable();
        gsap.to(window, { 
          scrollTo: st.start - 200, 
          duration: 0.8,
          ease: 'power2.inOut'
        });
      }
    },
    tolerance: 40,
    preventDefault: true 
  });
  
  observer.disable();
};
