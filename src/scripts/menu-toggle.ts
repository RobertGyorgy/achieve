import { gsap } from 'gsap';

let isMenuOpen = false;
let isInitialized = false;

/**
 * Toggle menu open/close state and animate
 */
function toggleMenu(open: boolean) {
  const menuOverlay = document.getElementById('menu-overlay');
  if (!menuOverlay) return;

  isMenuOpen = open;

  if (open) {
    // Open menu - slide from top
    menuOverlay.classList.add('is-open');
    gsap.to(menuOverlay, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
    });

    // Animate hamburger to X
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    if (hamburgerLines.length >= 2) {
      gsap.to(hamburgerLines[0], {
        rotation: 45,
        y: 6,
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(hamburgerLines[1], {
        rotation: -45,
        y: -6,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  } else {
    // Close menu - slide to top
    gsap.to(menuOverlay, {
      y: '-100%',
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
      onComplete: () => {
        menuOverlay.classList.remove('is-open');
      },
    });

    // Animate X back to hamburger
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    if (hamburgerLines.length >= 2) {
      gsap.to(hamburgerLines, {
        rotation: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    // Restore body scroll
    document.body.style.overflow = '';
  }
}

/**
 * Handle Escape key to close menu
 */
function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && isMenuOpen) {
    toggleMenu(false);
  }
}

/**
 * Handle clicking outside menu to close
 */
function handleOutsideClick(e: MouseEvent) {
  const menuOverlay = document.getElementById('menu-overlay');
  if (isMenuOpen && menuOverlay && e.target === menuOverlay) {
    toggleMenu(false);
  }
}

/**
 * Initialize menu toggle functionality
 * 
 * Note: If your project uses view-transition-handler.ts, you can integrate it here.
 * For projects without it, this works standalone.
 * 
 * Safe to call multiple times - will prevent duplicate event listeners.
 */
export function initMenuToggle() {
  const menuToggle = document.getElementById('menu-toggle');
  const menuOverlay = document.getElementById('menu-overlay');

  if (menuToggle) {
    // Remove existing listener by cloning to avoid duplicates
    const newToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode?.replaceChild(newToggle, menuToggle);

    (newToggle as HTMLElement).addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu(!isMenuOpen);
    });
  }

  // Set up event listeners only once to prevent duplicates
  if (!isInitialized) {
    document.addEventListener('keydown', handleEscape);
    isInitialized = true;
  }
  
  if (menuOverlay) {
    // Remove old listener if it exists, then add new one
    menuOverlay.removeEventListener('click', handleOutsideClick);
    menuOverlay.addEventListener('click', handleOutsideClick);
  }
}

// Export toggle function for external use if needed
export { toggleMenu };

