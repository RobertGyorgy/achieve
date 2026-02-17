# Code Snippets Reference

This folder contains organized documentation and code snippets for three key animations/interactions from the Achieve.ro website rebuild.

## Contents

### 1. [CTA Button](01-CTA-BUTTON.md)
**Color cycling button with animated text and arrow**

- Dynamic color changing on hover (16 vibrant colors)
- Matching glow effect with RGB extraction from hex colors
- Text and arrow GSAP animations
- Desktop-only responsive behavior
- File: `src/components/CTASection.astro`

**Key Features:**
- Elastic and smooth color transitions
- Glow effect dynamically generated from hex values
- Text slides right (112px) on hover
- Arrow fades in and slides
- Duration: 0.5s enter, 0.4s leave

---

### 2. [Draggable Text](02-DRAGGABLE-TEXT.md)
**Two implementations for draggable text elements**

#### Footer Letters Draggable
- Makes footer "ACHIEVE" letters individually draggable
- Implements inertia/momentum physics
- Velocity damping (0.95 factor) for smooth deceleration
- Desktop only (>= 1024px)
- File: `src/scripts/footer-draggable.ts`

#### General Draggable Utility
- Generic function to make any element draggable
- Used for hero text and logo elements
- GSAP powered movement
- Callback options (onDragStart, onDrag, onDragEnd)
- File: `src/scripts/draggable.ts`

**Key Features:**
- GPU acceleration with `translateZ(0)`
- Cursor state management (grab/grabbing)
- Transform3D for smooth animation
- Velocity tracking for realistic motion

---

### 3. [Menu Animation](03-MENU-ANIMATION.md)
**Complete menu toggle system with sophisticated animations**

- Hamburger button with elastic scaling
- Hamburger ↔ X transformation
- Staggered menu link animations
- Smooth overlay fade in/out
- Hover effects with text repositioning
- File: `src/scripts/menu-toggle.ts`

**Key Features:**
- **Button**: Elastic scaling with power4.out easing
- **Hamburger**: CSS rotation transforms (45deg and -45deg)
- **Overlay**: White background fade (power2.out)
- **Links**: Staggered slide-up (0.05s between each)
- **Hover**: Scale expansion and text shift
- Proper state management and cleanup

---

## Quick Reference

### Animation Libraries Used
- **GSAP 3**: For timeline-based animations and tweens
- **CSS Transforms**: For hamburger rotation and positioning
- **RequestAnimationFrame**: For inertia physics

### Key Concepts

#### GSAP Usage
```typescript
// Simple tween
gsap.to(element, { duration: 0.5, x: 100, ease: 'power2.out' });

// Timeline
const tl = gsap.timeline();
tl.to(element1, { ... })
  .to(element2, { ... }, 0) // Parallel with previous
  .to(element3, { ... }, '-=0.2'); // Overlap timing
```

#### CSS Transform3D
```css
transform: translate(x, y) translateZ(0); /* GPU acceleration */
transform-style: preserve-3d;
backface-visibility: hidden;
```

#### RequestAnimationFrame
```typescript
const applyInertia = () => {
  // Update position based on velocity
  if (shouldContinue) {
    requestAnimationFrame(applyInertia);
  }
};
```

---

## Responsive Considerations

### CTA Button
- Animations only on desktop (>= 1024px)
- Text/arrow remain static on mobile
- Color changes and glow work on all screens

### Draggable Elements
- Desktop only (>= 1024px)
- Disabled on mobile for touch compatibility
- Footer letters explicitly check viewport

### Menu Animation
- Button scales differently on mobile vs desktop
- Mobile: scale 1 (hovered state) when closed
- Desktop: scale 0.35 (small dot) when closed
- Hamburger bars only visible on desktop (>= 1024px)

---

## Performance Optimizations

1. **GPU Acceleration**
   - `transform: translateZ(0)` for hardware acceleration
   - `will-change` properties for advanced animations

2. **GSAP Best Practices**
   - Kill tweens before starting new ones
   - Use timelines for complex sequences
   - `force3D: true` for consistent performance

3. **Event Management**
   - Store handlers for cleanup on view transitions
   - Remove listeners when components unmount
   - Use event delegation where appropriate

4. **3D Transforms**
   - `perspective`, `transform-style: preserve-3d`
   - `backface-visibility: hidden`
   - Cursor states (grab/grabbing)

---

## Integration Notes

### View Transitions
All animations register with `GsapViewTransitionHandler` for proper re-initialization on page transitions in Astro.

### Event Listeners
- Added to `document` for global scope
- Cleaned up properly to prevent memory leaks
- Re-initialized on `astro:page-load`

### Mobile Compatibility
- Touch not implemented (desktop interactions only)
- Graceful degradation for smaller viewports
- No animations break functionality on mobile

---

## Files in Source Code

| Component | File | Type |
|-----------|------|------|
| CTA Button | `src/components/CTASection.astro` | Astro component |
| Footer Draggable | `src/scripts/footer-draggable.ts` | TypeScript |
| Draggable Utility | `src/scripts/draggable.ts` | TypeScript |
| Menu Animation | `src/scripts/menu-toggle.ts` | TypeScript |

---

## Further Reading

- [GSAP Documentation](https://greensock.com/docs/)
- [CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
- [RequestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/)
