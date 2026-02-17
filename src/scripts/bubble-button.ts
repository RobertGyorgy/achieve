/**
 * Initialize the morphing bubble button effect for "Let's Work" button
 * 
 * This creates an expanding blob effect on hover that morphs to fill the button.
 * 
 * Usage: Add id="lets-work-btn" to your button element and include the
 * CSS classes defined in the Navbar component (.work-btn, .work-blob, .work-expand)
 */
export function initBubbleButtons(selector: string = '.blob-btn') {
  const btns = document.querySelectorAll(selector);
  
  btns.forEach((btn) => {
    const element = btn as HTMLElement;
    
    element.addEventListener('mouseenter', function(this: HTMLElement, e: MouseEvent) {
      // Remove any existing blob first
      const existing = this.querySelector('.work-blob');
      if (existing) existing.remove();
  
      const rect = this.getBoundingClientRect();

      // Inside SVG foreignObject, the CSS coordinate space differs from viewport.
      // offsetWidth gives the CSS-space width, rect.width gives the viewport-space width.
      // The ratio converts viewport-pixel offsets to CSS-pixel offsets.
      const scaleX = this.offsetWidth / rect.width;
      const scaleY = this.offsetHeight / rect.height;

      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      const blob = document.createElement('div');
      blob.className = 'work-blob';
      blob.style.left = x + 'px';
      blob.style.top = y + 'px';
      this.appendChild(blob);

      // Force reflow
      void blob.offsetWidth;
      
      setTimeout(function() {
        blob.classList.add('work-expand');
      }, 10);
    });
  
    element.addEventListener('mouseleave', function(this: HTMLElement, e: MouseEvent) {
      const rect = this.getBoundingClientRect();

      const scaleX = this.offsetWidth / rect.width;
      const scaleY = this.offsetHeight / rect.height;

      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      const blobs = this.querySelectorAll('.work-blob');
      blobs.forEach(function(blob) {
        (blob as HTMLElement).style.left = x + 'px';
        (blob as HTMLElement).style.top = y + 'px';
        blob.classList.remove('work-expand');
        setTimeout(function() {
          blob.remove();
        }, 500);
      });
    });
  });
}



