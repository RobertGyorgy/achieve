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
        anticipatePin: isMobileDevice ? 0.5 : 1,
        id: `services-card-${index}`,
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

