import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Mobile device detection
 */
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

let smoother: any = null;
let ScrollSmootherPlugin: any = null;

/**
 * Load ScrollSmoother plugin (premium plugin - requires Club GreenSock membership)
 */
const loadScrollSmoother = async () => {
  if (ScrollSmootherPlugin) return ScrollSmootherPlugin;
  
  try {
    const module = await import('gsap/ScrollSmoother');
    ScrollSmootherPlugin = module.ScrollSmoother;
    if (ScrollSmootherPlugin) {
      gsap.registerPlugin(ScrollSmootherPlugin);
    }
    return ScrollSmootherPlugin;
  } catch (e) {
    console.warn('ScrollSmoother plugin not available. Using CSS smooth scroll fallback.');
    return null;
  }
};

/**
 * Initialize ScrollSmoother for the entire website
 * Provides smooth scrolling with GSAP ScrollSmoother plugin
 */
export const initSmoothScroll = async () => {
  if (typeof window === 'undefined') return null;

  const smoothWrapper = document.getElementById('smooth-wrapper');
  const smoothContent = document.getElementById('smooth-content');

  if (!smoothWrapper || !smoothContent) {
    console.warn('ScrollSmoother: smooth-wrapper or smooth-content not found');
    return null;
  }

  const isMobileDevice = isMobile();

  // Configure ScrollTrigger first (must be before ScrollSmoother)
  ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
    ignoreMobileResize: true, // Always ignore mobile resize to prevent layout thrashing
  });

  // Try to load ScrollSmoother plugin
  const ScrollSmoother = await loadScrollSmoother();

  // If ScrollSmoother is not available OR if on mobile, skip — let CSS media query handle it
  if (!ScrollSmoother || isMobileDevice) {
    // Just refresh ScrollTrigger so pins/triggers work with native scroll
    ScrollTrigger.refresh();
    return null;
  }

  // Create ScrollSmoother instance
  // On mobile, disable smooth scrolling for better performance
  try {
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: isMobileDevice ? 0 : 1.5, // Smooth scroll amount (0 = disabled, higher = smoother)
      effects: true, // Enable effects for parallax and other scroll effects
      smoothTouch: false, // Disable on touch devices for better performance
      normalizeScroll: !isMobileDevice, // DON'T normalize scroll on mobile
      ignoreMobileResize: true, // Always ignore mobile address bar resize
      onUpdate: (self: any) => {
        // Optional: handle scroll updates
      },
    });

    // Refresh ScrollTrigger after ScrollSmoother is created
    ScrollTrigger.refresh();

    if (import.meta.env.DEV) {
      console.log('✓ ScrollSmoother initialized', { isMobile: isMobileDevice });
    }

    return smoother;
  } catch (error) {
    console.error('Failed to initialize ScrollSmoother:', error);
    // Fallback: CSS media query in global.css handles mobile layout
    ScrollTrigger.refresh();
    return null;
  }
};

/**
 * Get ScrollSmoother instance
 */
export const getScrollSmoother = (): any => {
  return smoother;
};

/**
 * Scroll to a specific element or position
 */
export const scrollTo = (target: string | number, duration = 1) => {
  if (!smoother) {
    // Fallback to native scroll if ScrollSmoother not available
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
    return;
  }

  if (typeof target === 'string') {
    smoother.scrollTo(target, true, `top top`);
  } else {
    smoother.scrollTo(target, true);
  }
};

/**
 * Pause ScrollSmoother
 */
export const pauseScrollSmoother = () => {
  if (smoother) {
    smoother.paused(true);
  }
};

/**
 * Resume ScrollSmoother
 */
export const resumeScrollSmoother = () => {
  if (smoother) {
    smoother.paused(false);
  }
};

/**
 * Cleanup smooth scroll
 */
export const cleanupSmoothScroll = () => {
  if (smoother) {
    smoother.kill();
    smoother = null;
  }
  ScrollTrigger.refresh();
};
