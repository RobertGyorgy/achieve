import { gsap } from 'gsap';

/**
 * Initialize animated underlines for navigation links
 * 
 * Usage: Add the class "animated-nav-link" to your links and include
 * a child element with class "underline-animation" for the underline effect.
 * 
 * Example HTML:
 * <a href="/work" class="animated-nav-link">
 *   Work
 *   <span class="underline-animation"></span>
 * </a>
 */
export function initLinkUnderlines() {
  const links = document.querySelectorAll('.animated-nav-link');
  
  links.forEach(link => {
    const underline = link.querySelector('.underline-animation');
    if (!underline) return;
    
    // Set initial state
    gsap.set(underline, { width: '0%', left: '0%' });
    
    link.addEventListener('mouseenter', () => {
      gsap.to(underline, {
        width: '100%',
        left: '0%', // Grow from left
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    link.addEventListener('mouseleave', () => {
      gsap.to(underline, {
        width: '0%',
        left: '100%', // Exit to right (the "swipe through" effect)
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(underline, { left: '0%' }); // Reset position for next time
        }
      });
    });
  });
}



