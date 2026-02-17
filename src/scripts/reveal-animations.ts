import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize reveal animations for elements with data-reveal attributes
 */
export function initializeRevealAnimations() {
  // Get all elements with data-reveal attribute
  const revealElements = document.querySelectorAll('[data-reveal]');

  revealElements.forEach((element) => {
    const revealType = element.getAttribute('data-reveal');
    const duration = parseFloat(element.getAttribute('data-reveal-duration') || '0.6');
    const delay = parseFloat(element.getAttribute('data-reveal-delay') || '0');
    const stagger = parseFloat(element.getAttribute('data-reveal-stagger') || '0.05');
    const direction = element.getAttribute('data-reveal-direction') || 'up';

    if (revealType === 'title') {
      animateTitle(element as HTMLElement, { duration, delay });
    } else if (revealType === 'lines') {
      animateLines(element as HTMLElement, { duration, delay, stagger });
    } else if (revealType === 'words') {
      animateWords(element as HTMLElement, { duration, delay, stagger });
    } else if (revealType === 'object') {
      animateObject(element as HTMLElement, { duration, delay, direction });
    }
  });
}

/**
 * Animate title with 3D rotation
 */
function animateTitle(
  element: HTMLElement,
  options: { duration: number; delay: number }
) {
  const { duration, delay } = options;

  gsap.from(element, {
    opacity: 0,
    y: 20,
    rotationX: -80,
    duration,
    delay,
    ease: 'power2.out',
    transformOrigin: 'center bottom',
  });
}

/**
 * Animate line by line
 */
function animateLines(
  element: HTMLElement,
  options: { duration: number; delay: number; stagger: number }
) {
  const { duration, delay, stagger } = options;
  const text = element.textContent || '';

  // Split into lines
  const lines = text.split('\n').filter((line) => line.trim());

  element.innerHTML = lines
    .map((line) => `<div class="overflow-hidden"><span class="inline-block">${line}</span></div>`)
    .join('');

  const lineElements = element.querySelectorAll('span');

  gsap.from(lineElements, {
    opacity: 0,
    y: 20,
    duration,
    stagger,
    delay,
    ease: 'power2.out',
  });
}

/**
 * Animate word by word
 */
function animateWords(
  element: HTMLElement,
  options: { duration: number; delay: number; stagger: number }
) {
  const { duration, delay, stagger } = options;
  const text = element.textContent || '';

  // Split into words
  const words = text.split(' ');

  element.innerHTML = words
    .map((word) => `<span class="inline-block mr-2">${word}</span>`)
    .join('');

  const wordElements = element.querySelectorAll('span');

  gsap.from(wordElements, {
    opacity: 0,
    y: 10,
    duration,
    stagger,
    delay,
    ease: 'power2.out',
  });
}

/**
 * Animate object fade-in with direction
 */
function animateObject(
  element: HTMLElement,
  options: { duration: number; delay: number; direction: string }
) {
  const { duration, delay, direction } = options;

  const tweenVars: Record<string, any> = {
    opacity: 1,
    duration,
    delay,
    ease: 'power2.out',
  };

  // Set initial state based on direction
  const initialVars: Record<string, any> = {
    opacity: 0,
  };

  switch (direction) {
    case 'up':
      initialVars.y = 40;
      tweenVars.y = 0;
      break;
    case 'down':
      initialVars.y = -40;
      tweenVars.y = 0;
      break;
    case 'left':
      initialVars.x = 40;
      tweenVars.x = 0;
      break;
    case 'right':
      initialVars.x = -40;
      tweenVars.x = 0;
      break;
    default:
      // Default: fade only
      break;
  }

  // Set initial state
  gsap.set(element, initialVars);

  // Animate to final state
  gsap.to(element, tweenVars);
}

/**
 * Setup scroll triggers for reveal animations
 */
export function setupScrollTriggers() {
  // Get all elements with data-scroll-reveal attribute
  const scrollElements = document.querySelectorAll('[data-scroll-reveal]');

  scrollElements.forEach((element) => {
    const duration = parseFloat(element.getAttribute('data-reveal-duration') || '0.6');
    const direction = element.getAttribute('data-reveal-direction') || 'up';

    let y = 0;
    switch (direction) {
      case 'up':
        y = 40;
        break;
      case 'down':
        y = -40;
        break;
    }

    gsap.from(element, {
      opacity: 0,
      y,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element as HTMLElement,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none none',
        scrub: false, // Keep instant for reveal animations
      },
    });
  });
}

/**
 * Cleanup animations (called on page transition)
 */
export function cleanupAnimations() {
  // Kill all GSAP animations
  gsap.killTweensOf('*');

  // Cleanup ScrollTrigger
  ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
}
