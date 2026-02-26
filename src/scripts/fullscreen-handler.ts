/**
 * Fullscreen Handler - Hides Safari browser bezels on user interaction
 * Requests fullscreen API when user interacts with the page
 */

let fullscreenRequested = false;

function requestFullscreen() {
  if (fullscreenRequested || document.fullscreenElement) return;
  
  const docElement = document.documentElement;
  
  // Try various fullscreen APIs (works across browsers)
  const requestFullscreenMethods = [
    docElement.requestFullscreen,
    (docElement as any).webkitRequestFullscreen,
    (docElement as any).mozRequestFullScreen,
    (docElement as any).msRequestFullscreen,
  ].filter(method => method);

  if (requestFullscreenMethods.length > 0) {
    requestFullscreenMethods[0].call(docElement).catch(err => {
      if (import.meta.env.DEV) {
        console.log('Fullscreen request denied:', err);
      }
    });
    fullscreenRequested = true;
  }
}

// Request fullscreen on first user interaction
function initFullscreenHandler() {
  ['click', 'touchstart', 'scroll'].forEach(event => {
    document.addEventListener(event, requestFullscreen, { once: true, passive: true });
  });
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFullscreenHandler);
} else {
  initFullscreenHandler();
}

// Re-initialize on view transitions
document.addEventListener('astro:page-load', initFullscreenHandler);
