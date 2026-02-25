import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize background transition from black to white after services section
 * Changes all white text to black as the background fades to white
 */
export function initBackgroundTransition() {
  const servicesSection = document.querySelector('#services');
  if (!servicesSection) return;

  // Wait for DOM to be fully ready
  requestAnimationFrame(() => {
    // Get all elements that come after services section
    const aboutSection = document.querySelector('#about');
    const footer = document.querySelector('footer');
    const main = document.querySelector('main');
    
    // Collect all elements that need color/text changes
    const textElementsToChange: HTMLElement[] = [];
    const backgroundElementsToChange: HTMLElement[] = [];
    
    // Get all text elements after services section
    if (main) {
      // Find all text elements in sections after services
      const allTextElements = main.querySelectorAll(
        '.footer-link, .footer-hero-title, .hero-letter'
      );
      
      // Filter elements that have white text
      allTextElements.forEach((el) => {
        const element = el as HTMLElement;
        const computedStyle = window.getComputedStyle(element);
        const color = computedStyle.color;
        const classes = element.classList.toString();
        
        // Extract RGB values from computed color
        const rgbMatch = color.match(/\d+/g);
        const isWhite = rgbMatch && 
          parseInt(rgbMatch[0]) > 200 && 
          parseInt(rgbMatch[1]) > 200 && 
          parseInt(rgbMatch[2]) > 200;
        
        // Check if element has white color or white text classes
        if (
          isWhite ||
          classes.includes('text-white') ||
          classes.match(/text-white\/\d+/)
        ) {
          textElementsToChange.push(element);
        }
      });
    }
    
    // Collect background elements (Removed About and Footer to keep them dark)

    // Create timeline for smooth transition
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: servicesSection,
        start: 'bottom top', // Start when services section bottom reaches viewport top
        end: 'bottom center', // End when services section bottom reaches viewport center (creates transition range)
        scrub: 1.5, // Smooth scrubbing
        markers: false, // Set to true for debugging
      },
    });

    // Animate body background from black to white (Removed to prevent global wash out)

    // Animate section backgrounds
    backgroundElementsToChange.forEach((element) => {
      tl.to(
        element,
        {
          backgroundColor: '#ffffff',
          duration: 1,
          ease: 'power2.inOut',
        },
        0
      );
    });

    // Animate text colors from white to black
    textElementsToChange.forEach((element) => {
      tl.to(
        element,
        {
          color: '#000000',
          duration: 1,
          ease: 'power2.inOut',
        },
        0
      );
    });
  });
}

