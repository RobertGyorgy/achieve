import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { isMobile, getScrollSmoother } from './smooth-scroll';

gsap.registerPlugin(ScrollTrigger);

// Configure ScrollTrigger - will be configured by ScrollSmoother
// Keep this for fallback if ScrollSmoother is not available
if (typeof window !== 'undefined') {
  const isMobileDevice = isMobile();
  
  if (isMobileDevice) {
    // Optimize ScrollTrigger for mobile
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
      ignoreMobileResize: true, // Prevents glitches from address bar showing/hiding
    });
  } else {
    // Optimize for desktop smooth scrolling
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
    });
  }
}

const initWorkSectionAnimation = () => {
  if (typeof window === 'undefined') return;

  const mm = gsap.matchMedia();

  // Mobile/Tablet Logic (< 1024px) - Full-Screen Stack
  mm.add("(max-width: 1023px)", () => {
    const container = document.querySelector('#mobile-work-stack-container') as HTMLElement;
    const cards = gsap.utils.toArray('.mobile-work-card') as HTMLElement[];
    
    if (!container || cards.length < 2) return;

    // Set initial states: Card 0 is natively visible. Card 1+ start below viewport.
    gsap.set(cards.slice(1), { yPercent: 100 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: `+=${cards.length * 100}%`, // Scroll down 100vh per card to reveal
        pin: true,
        scrub: 0.5,
        id: 'mobile-work-stack',
        invalidateOnRefresh: true,
      }
    });

    // Animate each subsequent card sliding up over the previous one
    cards.slice(1).forEach((card, i) => {
        tl.to(card, {
            yPercent: 0,
            ease: "none"
        });
    });
  });

  // Desktop Logic (>= 1024px) - Perspective Stack
  mm.add("(min-width: 1024px)", () => {
    const cardWrappers = gsap.utils.toArray('#desktop-work-stack-container .card-wrapper') as HTMLElement[];
    const cards = gsap.utils.toArray('#desktop-work-stack-container .card') as HTMLElement[];
    
    if (!cardWrappers.length || !cards.length) return;
    
    // Set 3D properties
    gsap.set(cards, { force3D: true, backfaceVisibility: 'hidden' });
    
    cardWrappers.forEach((wrapper, index) => {
      if (!cards[index] || !wrapper) return;
      
      const y = -125 + 60 * index;
      const scale = 0.94 + 0.03 * index;
      
      gsap.to(cards[index], {
        y: y,
        scale: scale,
        rotationX: 0,
        transformOrigin: 'center center',
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 180',
          end: 'top 180',
          endTrigger: '#desktop-work-stack-container .card-last',
          scrub: 1.2, 
          pin: true,
          pinSpacing: false,
          id: `work-card-${index}`,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });
    });
  });
};

export const initWorkSection = () => {
  if (typeof window === 'undefined') return;

  // Kill existing work card ScrollTriggers to avoid duplicates/glitches
  ScrollTrigger.getAll().forEach(trigger => {
    const id = (trigger.vars as any).id;
    if (typeof id === 'string' && id.startsWith('work-card-')) {
      trigger.kill();
    }
  });

  // Wait a bit for DOM to be ready and ensure ScrollSmoother is initialized
  requestAnimationFrame(() => {
    // Wait for ScrollSmoother if it exists
    const smoother = getScrollSmoother();
    if (smoother) {
      // ScrollSmoother handles ScrollTrigger refresh
      initWorkSectionAnimation();
    } else {
      // Fallback: initialize without ScrollSmoother
      initWorkSectionAnimation();
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 50);
    }
  });
};

const initServicesSectionAnimation = () => {
  if (typeof window === 'undefined') return;
  
  const cardWrappers = gsap.utils.toArray('#services-component-vt .card-wrapper') as HTMLElement[];
  const cards = gsap.utils.toArray('#services-component-vt .card') as HTMLElement[];
  
  if (!cardWrappers.length || !cards.length) return;
  
  // Set 3D properties
  gsap.set(cards, { force3D: true, backfaceVisibility: 'hidden' });
  
  // Check if mobile to adjust animation parameters
  const isMobileDevice = isMobile();
  
  cardWrappers.forEach((wrapper, index) => {
    if (!cards[index] || !wrapper) return;
    
    const y = -125 + 60 * index;
    const scale = 0.94 + 0.03 * index;
    
    gsap.to(cards[index], {
      y: y,
      scale: scale,
      rotationX: 0,
      transformOrigin: 'center center',
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: isMobileDevice ? 'top 120' : 'top 180',
        end: isMobileDevice ? 'top 120' : 'top 180',
        endTrigger: '#services-component-vt .card-last',
        scrub: isMobileDevice ? 0.5 : 1.2,
        pin: true,
        pinSpacing: false,
        id: `services-card-${index}`,
        anticipatePin: isMobileDevice ? 0.5 : 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
      },
    });
  });
};

export const initServicesSection = () => {
  if (typeof window === 'undefined') return;

  // Kill existing services card ScrollTriggers to avoid duplicates/glitches
  ScrollTrigger.getAll().forEach(trigger => {
    const id = (trigger.vars as any).id;
    if (typeof id === 'string' && id.startsWith('services-card-')) {
      trigger.kill();
    }
  });

  // Wait a bit for DOM to be ready and ensure ScrollSmoother is initialized
  requestAnimationFrame(() => {
    // Wait for ScrollSmoother if it exists
    const smoother = getScrollSmoother();
    if (smoother) {
      // ScrollSmoother handles ScrollTrigger refresh
      initServicesSectionAnimation();
    } else {
      // Fallback: initialize without ScrollSmoother
      initServicesSectionAnimation();
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 50);
    }
  });
};

