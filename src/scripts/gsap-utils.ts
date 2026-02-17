import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Utility functions for GSAP animations
 */

export function initializeGsap() {
  // Set default ease for all tweens
  gsap.defaults({ ease: 'power2.out' });
}

/**
 * Text reveal animation - character by character
 */
export function revealText(
  element: HTMLElement,
  options: {
    duration?: number;
    stagger?: number;
    ease?: string;
    delay?: number;
  } = {}
) {
  const { duration = 0.5, stagger = 0.02, ease = 'power2.out', delay = 0 } =
    options;

  const text = element.textContent || '';
  element.innerHTML = text
    .split('')
    .map((char) => `<span class="text-reveal-char">${char}</span>`)
    .join('');

  const chars = element.querySelectorAll('.text-reveal-char');

  return gsap.to(chars, {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    ease,
    delay,
  });
}

/**
 * Fade in animation with optional direction
 */
export function fadeIn(
  element: HTMLElement,
  options: {
    duration?: number;
    ease?: string;
    delay?: number;
    y?: number;
    x?: number;
  } = {}
) {
  const { duration = 0.5, ease = 'power2.out', delay = 0, y = 20, x = 0 } =
    options;

  return gsap.from(element, {
    opacity: 0,
    y,
    x,
    duration,
    ease,
    delay,
  });
}

/**
 * Create a timeline with common defaults
 */
export function createTimeline(paused = false) {
  return gsap.timeline({ paused });
}

/**
 * Stagger animation for multiple elements
 */
export function staggerElements(
  elements: HTMLElement[],
  options: {
    duration?: number;
    stagger?: number;
    ease?: string;
    delay?: number;
    y?: number;
    x?: number;
  } = {}
) {
  const { duration = 0.5, stagger = 0.1, ease = 'power2.out', delay = 0, y = 20, x = 0 } =
    options;

  return gsap.from(elements, {
    opacity: 0,
    y,
    x,
    duration,
    stagger,
    ease,
    delay,
  });
}

/**
 * Scroll trigger animation
 */
export function onScrollReveal(
  element: HTMLElement,
  options: {
    duration?: number;
    ease?: string;
    y?: number;
    x?: number;
    trigger?: HTMLElement;
  } = {}
) {
  const { duration = 0.6, ease = 'power2.out', y = 40, x = 0, trigger = element } = options;

  return gsap.from(element, {
    opacity: 0,
    y,
    x,
    duration,
    ease,
    scrollTrigger: {
      trigger,
      start: 'top 80%',
      end: 'top 20%',
      toggleActions: 'play none none none',
      scrub: false, // Keep instant for reveal animations
    },
  });
}

/**
 * Hex to RGB converter for glow effects
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Create a glow effect from a hex color
 */
export function createGlowEffect(hexColor: string, intensity = 0.5): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return `0px 0px 20px ${hexColor}`;

  return `0px 0px 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${intensity})`;
}

/**
 * Handle page transitions
 */
export function setupPageTransitions() {
  // Re-initialize animations when page changes
  document.addEventListener('astro:before-swap', () => {
    gsap.killTweensOf('*');
  });

  document.addEventListener('astro:page-load', () => {
    initializeGsap();
    window.dispatchEvent(new Event('animations-ready'));
  });
}
