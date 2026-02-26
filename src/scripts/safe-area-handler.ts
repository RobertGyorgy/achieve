/**
 * Safe Area Handler - Properly handles notches, bezels, and safe areas on all devices
 * Especially for iOS Safari where viewport-fit=cover extends into safe areas
 */

function updateSafeAreaVariables() {
  const root = document.documentElement;
  
  // Get safe area insets (available in browsers that support it)
  const top = window.getComputedStyle(root).getPropertyValue('safe-area-inset-top') || '0px';
  const bottom = window.getComputedStyle(root).getPropertyValue('safe-area-inset-bottom') || '0px';
  const left = window.getComputedStyle(root).getPropertyValue('safe-area-inset-left') || '0px';
  const right = window.getComputedStyle(root).getPropertyValue('safe-area-inset-right') || '0px';
  
  // Set CSS variables for use throughout the app
  root.style.setProperty('--safe-area-top', top);
  root.style.setProperty('--safe-area-bottom', bottom);
  root.style.setProperty('--safe-area-left', left);
  root.style.setProperty('--safe-area-right', right);
  
  if (import.meta.env.DEV) {
    console.log('Safe area insets:', { top, bottom, left, right });
  }
}

// Update on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateSafeAreaVariables);
} else {
  updateSafeAreaVariables();
}

// Update on orientation change
window.addEventListener('orientationchange', updateSafeAreaVariables);
window.addEventListener('resize', updateSafeAreaVariables);

// Re-initialize on view transitions
document.addEventListener('astro:page-load', updateSafeAreaVariables);
