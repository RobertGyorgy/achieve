import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize FAQ section animations:
 * 1. Sticky title using ScrollTrigger pin (works with ScrollSmoother)
 * 2. Line fill animations as user scrolls through questions
 */
export function initFAQAnimations() {
  const faqSection = document.querySelector('#faq');
  if (!faqSection) return;

  // Wait for DOM to be ready
  requestAnimationFrame(() => {
    const titleContainer = document.querySelector<HTMLElement>('.faq-title-container');
    const dividerFills = document.querySelectorAll<HTMLElement>('.faq-divider-fill');
    const faqItems = document.querySelectorAll('.faq-item-wrapper');
    const faqItemsContainer = document.querySelector<HTMLElement>('.faq-items-container');

    // Only apply sticky on desktop (lg breakpoint)
    if (window.innerWidth >= 1024 && titleContainer && faqItemsContainer) {
      // Wait for ScrollSmoother and layout to be ready
      const initSticky = () => {
        // Kill any existing ScrollTrigger for this element to avoid conflicts
        ScrollTrigger.getAll().forEach((trigger: any) => {
          if (trigger.vars?.pin === titleContainer) {
            trigger.kill();
          }
        });
        
        // Find the second to last FAQ item (stop pinning when it reaches the top)
        const secondToLastItem = faqItems.length >= 2 ? faqItems[faqItems.length - 2] as HTMLElement : null;
        
        // The title should stick while scrolling through the FAQ items
        // Pin starts when FAQ section reaches top
        // Stop pinning when the second to last question reaches the top of the viewport
        ScrollTrigger.create({
          trigger: faqSection,
          start: 'top top',
          endTrigger: secondToLastItem || faqItemsContainer,
          end: secondToLastItem ? 'top top' : 'bottom top-=100', // Use second to last item's top if available
          pin: titleContainer,
          pinSpacing: false,
          anticipatePin: 1,
          markers: false,
          invalidateOnRefresh: true,
        });
        
        // Refresh after a brief delay to ensure calculations are correct
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 50);
      };
      
      // Wait for ScrollSmoother to initialize first (it's async)
      // Check if smooth-content exists (ScrollSmoother is active)
      const checkScrollSmoother = () => {
        const smoothContent = document.getElementById('smooth-content');
        if (smoothContent) {
          initSticky();
        } else {
          // Retry after a bit if ScrollSmoother isn't ready yet
          setTimeout(checkScrollSmoother, 100);
        }
      };
      
      setTimeout(checkScrollSmoother, 200);
    }

    // Line fill animations - each line fills as it comes into view
    dividerFills.forEach((fill, index) => {
      const faqItem = faqItems[index];
      if (!faqItem) return;

      gsap.to(fill, {
        width: '100%',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: faqItem,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
          markers: false,
        },
      });
    });
  });
}

