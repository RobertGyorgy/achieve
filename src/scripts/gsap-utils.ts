import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize GSAP with default settings
 */
export function initializeGsap() {
  gsap.defaults({ ease: 'power2.out' });
}
