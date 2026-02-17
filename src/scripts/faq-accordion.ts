import { gsap } from 'gsap';
import { initTextAnimations } from '../utils/RevealAnimationHandler';

/**
 * Initialize smooth FAQ accordion animations using GSAP
 * Only one question can be open at a time
 */
export function initFAQAccordion() {
  if (typeof window === 'undefined') return;

  const faqItems = document.querySelectorAll<HTMLDetailsElement>('.faq-item');
  let currentlyOpen: HTMLDetailsElement | null = null;
  let isHandlingClick = false;
  
  faqItems.forEach((details) => {
    const content = details.querySelector<HTMLElement>('.faq-content');
    const svg = details.querySelector<SVGElement>('.faq-icon');
    const summary = details.querySelector('summary');
    let isManuallyControlled = false;
    
    if (!content || !summary) return;
    
    // Prevent toggle event from interfering when we're controlling it
    details.addEventListener('toggle', (e) => {
      if (isManuallyControlled) {
        // If we're manually controlling, prevent the default toggle
        // by immediately setting it back if it was changed
        if (isHandlingClick) {
          return;
        }
      }
    });

    // Measure content height
    const getContentHeight = (): number => {
      const wasOpen = details.open;
      details.open = true;
      const height = content.scrollHeight;
      details.open = wasOpen;
      return height;
    };

    // Set initial state
    if (details.open) {
      gsap.set(content, { height: 'auto', opacity: 1 });
      if (svg) gsap.set(svg, { rotation: 45 });
      currentlyOpen = details;
    } else {
      gsap.set(content, { height: 0, opacity: 0, overflow: 'hidden' });
      if (svg) gsap.set(svg, { rotation: 0 });
    }

    // Handle click - prevent default toggle behavior
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (isHandlingClick) return;
      isHandlingClick = true;
      
      const willOpen = !details.open;
      
      // Close other open item first if exists
      if (willOpen && currentlyOpen && currentlyOpen !== details) {
        const otherContent = currentlyOpen.querySelector<HTMLElement>('.faq-content');
        const otherSvg = currentlyOpen.querySelector<SVGElement>('.faq-icon');
        const otherHeight = otherContent?.scrollHeight || 0;
        
        if (otherContent) {
          gsap.set(otherContent, { height: otherHeight });
          gsap.to(otherContent, {
            height: 0,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: () => {
              if (currentlyOpen && currentlyOpen !== details) {
                currentlyOpen.open = false;
              }
            }
          });
        }
        
        if (otherSvg) {
          gsap.to(otherSvg, { rotation: 0, duration: 0.3 });
        }
        
        currentlyOpen = null;
      }
      
      // Small delay if closing another item first
      const delay = willOpen && currentlyOpen ? 50 : 0;
      
      setTimeout(() => {
        // Toggle this item
        if (willOpen) {
          // Set flag to prevent toggle event interference
          isManuallyControlled = true;
          
          // Set open state and track it
          details.open = true;
          currentlyOpen = details;
          
          // Small delay to ensure state is set
          requestAnimationFrame(() => {
            const height = getContentHeight();
            
            gsap.set(content, { height: 0, opacity: 0, overflow: 'hidden' });
            gsap.to(content, {
              height: height,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
              onComplete: () => {
                gsap.set(content, { height: 'auto' });
                isManuallyControlled = false;
                // Trigger reveal animation on answer when visible
                const answer = content.querySelector('.faq-answer') as HTMLElement;
                if (answer && answer.getAttribute('data-reveal') && !answer.hasAttribute('data-reveal-animated')) {
                  // Small delay to ensure content is rendered, then initialize animations
                  // The handler will mark it as animated after processing to prevent duplication
                  setTimeout(() => {
                    initTextAnimations();
                  }, 150);
                }
              }
            });
            
            if (svg) {
              gsap.to(svg, { rotation: 45, duration: 0.3 });
            }
          });
        } else {
          isManuallyControlled = true;
          
          const currentHeight = content.scrollHeight || content.offsetHeight;
          
          if (currentHeight > 0) {
            gsap.set(content, { height: currentHeight, overflow: 'hidden' });
            gsap.to(content, {
              height: 0,
              opacity: 0,
              duration: 0.4,
              ease: 'power2.inOut',
              onComplete: () => {
                details.open = false;
                isManuallyControlled = false;
              }
            });
          } else {
            details.open = false;
            isManuallyControlled = false;
          }
          
          if (svg) {
            gsap.to(svg, { rotation: 0, duration: 0.3 });
          }
          
          currentlyOpen = null;
        }
        
        setTimeout(() => {
          isHandlingClick = false;
        }, 200);
      }, delay);
    });
  });
  
  if (import.meta.env.DEV) {
    console.log(`✓ FAQ Accordion initialized with ${faqItems.length} items`);
  }
}
