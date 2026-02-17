# Draggable Text Animation

## Overview
Two implementations for draggable text elements: one for the footer "ACHIEVE" letters and a general-purpose draggable utility used for hero text and logos.

---

## 1. Footer Draggable Letters

### Features
- Individual letter dragging with mouse movement
- Inertia/momentum physics (velocity damping at 0.95)
- Desktop only (requires >= 1024px)
- Transform3D for smooth animation
- Auto-cleanup on mouse release

### HTML Structure
```astro
<h2 id="footer-achieve-title" class="text-white font-osfont text-[10vw] leading-none tracking-wide text-center">
  <div class="flex justify-center gap-[1vw] lg:gap-[2vw]">
    <span class="footer-achieve-letter preserve-3d relative transform-gpu" data-tooltip="Drag">A</span>
    <span class="footer-achieve-letter preserve-3d relative transform-gpu" data-tooltip="Drag">C</span>
    <span class="footer-achieve-letter preserve-3d relative transform-gpu" data-tooltip="Drag">H</span>
    <span class="footer-achieve-letter preserve-3d relative transform-gpu" data-tooltip="Drag">I</span>
    <!-- ... more letters ... -->
  </div>
</h2>
```

### TypeScript Implementation
```typescript
import { GsapViewTransitionHandler } from './view-transition-handler';

export const initFooterDraggable = () => {
  if (typeof window === 'undefined') return;
  // Desktop only
  if (window.innerWidth < 1024) return;

  // Make footer letters draggable
  const footerLetters = document.querySelectorAll('.footer-achieve-letter');
  
  footerLetters.forEach((letter) => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let velocityX = 0;
    let velocityY = 0;

    const handleMouseDown = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      isDragging = true;
      startX = mouseEvent.clientX - currentX;
      startY = mouseEvent.clientY - currentY;
      velocityX = 0;
      velocityY = 0;
      (letter as HTMLElement).classList.add('dragging');
      (letter as HTMLElement).style.transition = 'none';
    };

    const handleMouseMove = (e: Event) => {
      if (!isDragging) return;
      
      const mouseEvent = e as MouseEvent;
      const newX = mouseEvent.clientX - startX;
      const newY = mouseEvent.clientY - startY;
      
      // Calculate velocity for inertia
      velocityX = newX - currentX;
      velocityY = newY - currentY;
      
      currentX = newX;
      currentY = newY;

      // Apply transform with GPU acceleration
      (letter as HTMLElement).style.transform = `translate(${newX}px, ${newY}px) translateZ(0)`;
    };

    const handleMouseUp = (e: Event) => {
      if (!isDragging) return;
      isDragging = false;
      (letter as HTMLElement).classList.remove('dragging');

      // Apply inertia/momentum physics
      const applyInertia = () => {
        velocityX *= 0.95;  // Damping factor
        velocityY *= 0.95;

        // Continue if velocity is above threshold
        if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
          currentX += velocityX;
          currentY += velocityY;
          (letter as HTMLElement).style.transform = `translate(${currentX}px, ${currentY}px) translateZ(0)`;
          requestAnimationFrame(applyInertia);
        }
      };

      applyInertia();
    };

    (letter as HTMLElement).addEventListener('mousedown', handleMouseDown as EventListener);
    document.addEventListener('mousemove', handleMouseMove as EventListener);
    document.addEventListener('mouseup', handleMouseUp as EventListener);
  });
};

// Initialize on load and view transitions
if (typeof window !== 'undefined') {
  const initializeOnce = () => {
    setTimeout(() => {
      initFooterDraggable();
    }, 50);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOnce);
  } else {
    initializeOnce();
  }

  document.addEventListener('astro:page-load', () => {
    initializeOnce();
  });

  GsapViewTransitionHandler.register('.footer-achieve-letter', (transition) => {
    transition.add(initFooterDraggable);
  });
}
```

### CSS for Footer Letters
```css
.footer-achieve-letter {
  perspective: 1000px;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  cursor: grab;
  touch-action: none;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  transition: filter 0.3s ease;
  will-change: transform, filter;
}

.footer-achieve-letter:active {
  cursor: grabbing;
}

.footer-achieve-letter:hover {
  filter: brightness(1.1);
}

.footer-achieve-letter.dragging {
  filter: brightness(1.05);
  transition: none;
}
```

---

## 2. General Draggable Utility

### Features
- Generic draggable implementation for any element
- Options for custom event callbacks
- Used for hero text and logo elements
- Basic drag without GSAP Draggable plugin

### Type Definition
```typescript
interface DraggableOptions {
  type?: string;
  edgeResistance?: number;
  inertia?: boolean;
  bounds?: string | HTMLElement;
  onDragStart?: () => void;
  onDrag?: () => void;
  onDragEnd?: () => void;
}
```

### Implementation
```typescript
import { gsap } from 'gsap';

export const makeDraggable = (
  element: HTMLElement | NodeListOf<Element> | string,
  options: DraggableOptions = {}
) => {
  // Convert input to array of elements
  let elements: HTMLElement[] = [];
  
  if (typeof element === 'string') {
    const nodeList = document.querySelectorAll(element);
    elements = Array.from(nodeList).filter((el): el is HTMLElement => el instanceof HTMLElement);
  } else if (element instanceof NodeList) {
    elements = Array.from(element).filter((el): el is HTMLElement => el instanceof HTMLElement);
  } else if (Array.isArray(element)) {
    elements = element.filter((el): el is HTMLElement => el instanceof HTMLElement);
  } else if (element instanceof HTMLElement) {
    elements = [element];
  }
  
  elements.forEach((el) => {
    if (!el) return;
    
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      el.classList.add('dragging');
      startX = e.clientX - currentX;
      startY = e.clientY - currentY;
      options.onDragStart?.();
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      currentX = e.clientX - startX;
      currentY = e.clientY - startY;
      gsap.set(el, { x: currentX, y: currentY });
      options.onDrag?.();
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        el.classList.remove('dragging');
        options.onDragEnd?.();
      }
    };
    
    el.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  });
};

export const initHeroDraggable = () => {
  if (typeof window === 'undefined') return;
  // Desktop only
  if (window.innerWidth < 1024) return;

  // Make hero logo letters draggable
  const logoElements = document.querySelectorAll('#achieve-hero-title .preserve-3d');
  const textElements = document.querySelectorAll('.hero-text-word');

  if (logoElements.length > 0) {
    makeDraggable(logoElements, {
      type: 'x,y',
      edgeResistance: 0.65,
      inertia: true,
    });
  }

  if (textElements.length > 0) {
    makeDraggable(textElements, {
      type: 'x,y',
      edgeResistance: 0.65,
      inertia: true,
    });
  }
};
```

### CSS for Draggable Elements
```css
.preserve-3d {
  perspective: 1000px;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  cursor: grab;
  touch-action: none;
}

.preserve-3d:active {
  cursor: grabbing;
}

.preserve-3d:hover {
  filter: brightness(1.1);
}

.preserve-3d.dragging {
  filter: brightness(1.05);
  transition: none;
}

.hero-text-word {
  perspective: 1000px;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  cursor: grab;
  touch-action: none;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  transition: filter 0.3s ease;
  will-change: transform, filter;
}

.hero-text-word:active {
  cursor: grabbing;
}
```

---

## Key Concepts

### Inertia/Momentum
The footer draggable uses velocity damping (0.95 factor) to create a momentum effect:
```typescript
velocityX *= 0.95;
velocityY *= 0.95;

// Continues until velocity drops below 0.1
if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
  // Apply animation
  requestAnimationFrame(applyInertia);
}
```

### GPU Acceleration
Both implementations use `translateZ(0)` for GPU acceleration:
```typescript
element.style.transform = `translate(${x}px, ${y}px) translateZ(0)`;
```

### Cursor States
- `grab`: Default state when hovering
- `grabbing`: Active state during drag
- `dragging`: Class applied during drag for styling

---

## File Locations
- **Footer Draggable**: `src/scripts/footer-draggable.ts`
- **General Draggable**: `src/scripts/draggable.ts`
