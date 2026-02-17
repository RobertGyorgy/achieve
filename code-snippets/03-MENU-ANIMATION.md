# Menu Open Animation

## Overview
Complete menu toggle system with smooth opening/closing animations, hamburger-to-X transformation, hover effects, and synchronized menu link staggered animations.

## Key Features
- **Button Animation**: Elastic scaling with hamburger ↔ X transformation
- **Menu Overlay**: Smooth fade in/out (white background)
- **Link Animation**: Staggered slide-up animation for menu items
- **Hover Effects**: Scale expansion and text repositioning
- **Responsive**: Different behavior for mobile vs desktop
- **State Management**: Proper cleanup and re-initialization on view transitions

---

## HTML Structure

### Menu Toggle Button
```astro
<div class="menu-toggle-group">
  <button class="menu-toggle closed" aria-expanded="false">
    <div class="menu-toggle-icon">
      <span class="menu-bar" data-position="top"></span>
      <span class="menu-bar" data-position="bottom"></span>
    </div>
    <span class="menu-text">Menu</span>
  </button>
</div>
```

### Menu Overlay
```astro
<div id="menu-white-overlay" class="menu-overlay"></div>
```

### Menu Content
```astro
<nav class="menu">
  <div class="menu-content">
    <!-- Navigation links -->
    <a href="/" class="link">Home</a>
    <a href="/about" class="link">About</a>
    
    <!-- Social links -->
    <div class="social-links">
      <a href="#" class="social-link">Twitter</a>
      <a href="#" class="social-link">LinkedIn</a>
    </div>
  </div>
</nav>
```

---

## CSS Styling

### Menu Toggle Button
```css
.menu-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 50;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.menu-toggle.closed {
  scale: 0.35;
}

.menu-toggle.opened {
  scale: 1;
}

.menu-toggle-icon {
  position: relative;
  width: 24px;
  height: 24px;
}

.menu-bar {
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: currentColor;
  left: 50%;
  transform-origin: center;
  transition: transform 0.3s ease;
}

.menu-bar[data-position="top"] {
  transform: translate(-50%, -4px);
}

.menu-bar[data-position="bottom"] {
  transform: translate(-50%, 4px);
}

/* X transformation when menu is opened */
.menu-toggle.opened .menu-bar[data-position="top"] {
  transform: translate(-50%, 0) rotate(45deg) !important;
}

.menu-toggle.opened .menu-bar[data-position="bottom"] {
  transform: translate(-50%, 0) rotate(-45deg) !important;
}

.menu-text {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}
```

### Menu Overlay
```css
#menu-white-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 40;
  opacity: 0;
  pointer-events: none;
}
```

### Menu Content
```css
.menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 45;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.menu.opened {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.link,
.social-link {
  display: block;
  font-size: 24px;
  font-weight: 600;
  text-decoration: none;
  color: #000;
  margin: 20px 0;
  transform: translateY(20px);
  opacity: 0;
}
```

---

## TypeScript Animation Logic

### Toggle Animation Function
```typescript
function animateToggle(isOpening: boolean) {
  gsap.killTweensOf(menuToggleIcon);
  
  const timeline = gsap.timeline({
    defaults: { duration: 0.4, ease: 'elastic.out(1, 0.5)' }
  });
  
  timeline
    .to(menuToggleIcon, {
      scale: isOpening ? 1.28 : 0.7,
      duration: 0.1,
      ease: 'power4.out'
    })
    .to(menuToggleIcon, {
      scale: isOpening ? 1 : (window.innerWidth < 1024 ? 1 : 0.35),
      duration: 0.1
    });
  
  return timeline;
}
```

### Click Handler
```typescript
clickHandler = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  
  const isCurrentlyClosed = menuToggle.classList.contains('closed');
  const willBeOpening = isCurrentlyClosed;
  
  // Update button state
  menuToggleGroup.setAttribute('aria-expanded', willBeOpening ? 'true' : 'false');
  menuToggle.classList.remove(isCurrentlyClosed ? 'closed' : 'opened');
  menuToggle.classList.add(willBeOpening ? 'opened' : 'closed');
  
  animateToggle(willBeOpening);
  
  // Show X when opened, show hamburger when closed
  if (menuBarTop && menuBarBottom) {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      if (willBeOpening) {
        // Opening: transform hamburger to X, hide menu text
        const openTimeline = gsap.timeline();
        
        openTimeline.set([menuBarTop, menuBarBottom], {
          opacity: 1,
          pointerEvents: 'auto',
          visibility: 'visible',
          clearProps: 'all'
        });
        
        if (menuText) {
          openTimeline.to(menuText, {
            opacity: 0,
            pointerEvents: 'none',
            visibility: 'hidden',
            x: 0,
            duration: 0.2,
            ease: 'power2.out'
          }, 0);
        }
      } else {
        // Closing: hide bars, show menu text
        gsap.to([menuBarTop, menuBarBottom], {
          opacity: 0,
          pointerEvents: 'none',
          visibility: 'hidden',
          duration: 0.2,
          delay: 0.1,
          ease: 'power2.out'
        });
        
        if (menuText) {
          gsap.to(menuText, {
            opacity: 1,
            pointerEvents: 'auto',
            visibility: 'visible',
            duration: 0.2,
            ease: 'power2.out'
          });
        }
      }
    }
  }
};
```

### Menu Toggle Handler
```typescript
const handleMenuToggle = (isOpening: boolean) => {
  const menu = document.querySelector('.menu') as HTMLElement;
  const menuOverlay = document.getElementById('menu-white-overlay') as HTMLElement;
  
  if (!menu) return;
  
  const links = Array.from(menu.querySelectorAll('.link'));
  const socialLinks = Array.from(menu.querySelectorAll('.social-link'));
  
  // Kill any ongoing animations
  gsap.killTweensOf([menu, menuOverlay, ...links, ...socialLinks]);
  
  // Update state
  if (isOpening) {
    menuToggle.classList.remove('closed');
    menuToggle.classList.add('opened');
    menuToggleGroup.setAttribute('aria-expanded', 'true');
  } else {
    menuToggle.classList.remove('opened');
    menuToggle.classList.add('closed');
    menuToggleGroup.setAttribute('aria-expanded', 'false');
  }
  
  if (isOpening) {
    // OPENING ANIMATION
    menu.classList.add('opened');
    menu.style.pointerEvents = 'auto';
    menu.style.visibility = 'visible';
    menu.style.opacity = '1';
    
    // Fade in overlay
    if (menuOverlay) {
      gsap.to(menuOverlay, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    // Animate links in with stagger
    gsap.to([...links, ...socialLinks], {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power3.out',
      delay: 0.1,
      clearProps: 'visibility'
    });
  } else {
    // CLOSING ANIMATION
    if (links.length === 0 && socialLinks.length === 0) {
      // No links to animate, close immediately
      menu.classList.remove('opened');
      menu.style.pointerEvents = 'none';
      if (menuOverlay) {
        gsap.set(menuOverlay, { opacity: 0 });
      }
    } else {
      // Animate links out first, then overlay
      const timeline = gsap.timeline({
        onComplete: () => {
          menu.classList.remove('opened');
          menu.style.pointerEvents = 'none';
        }
      });
      
      // Animate links out (reverse of opening)
      timeline.to([...links, ...socialLinks], {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power3.in'
      });
      
      // Fade out overlay
      if (menuOverlay) {
        timeline.to(menuOverlay, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in'
        }, '-=0.1');
      }
    }
  }
};
```

### Hover Effects
```typescript
mouseEnterHandler = () => {
  if (!gsap.isTweening(menuToggleIcon)) {
    gsap.to(menuToggleIcon, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
    
    // Show hamburger bars on hover (if menu is closed)
    if (menuBarTop && menuBarBottom && !menuToggle.classList.contains('opened')) {
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        gsap.to([menuBarTop, menuBarBottom], {
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
    
    // Move menu text to the left to avoid overlap
    if (menuText && !menuToggle.classList.contains('opened')) {
      gsap.to(menuText, {
        x: -20,
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }
};

mouseLeaveHandler = () => {
  if (!gsap.isTweening(menuToggleIcon)) {
    const isOpened = menuToggle.classList.contains('opened');
    const isMobile = window.innerWidth < 1024;
    const closedScale = isMobile ? 1 : 0.35;
    
    gsap.to(menuToggleIcon, {
      scale: isOpened ? 1 : closedScale,
      duration: 0.3,
      ease: 'power2.out'
    });
    
    // Hide hamburger bars on leave (if menu is closed)
    if (menuBarTop && menuBarBottom && !isOpened) {
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        gsap.to([menuBarTop, menuBarBottom], {
          opacity: 0,
          pointerEvents: 'none',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
    
    // Move menu text back (if menu is closed)
    if (menuText && !isOpened) {
      gsap.to(menuText, {
        x: 0,
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }
};
```

---

## Animation Sequence

### Opening Menu
1. **Button Icon** scales up elastically (0.1s)
2. **Hamburger bars** transform to X via CSS rotation (handled by class)
3. **Menu text** fades out (0.2s)
4. **Overlay** fades in (0.3s, starts at 0.1s delay)
5. **Menu links** slide up and fade in with stagger (0.6s, 0.05s between each, 0.1s delay)

### Closing Menu
1. **Menu links** slide down and fade out (0.6s, staggered reverse)
2. **Overlay** fades out (0.3s, overlaps with links)
3. **X transforms** back to hamburger via CSS rotation
4. **Menu text** fades back in
5. **Button icon** scales down elastically

### On Hover
- Icon scales from 0.35 (desktop) or 1 (mobile) to 1
- Hamburger bars become visible
- Menu text shifts left (-20px) to avoid overlap

### On Leave
- Icon scales back to original size
- Hamburger bars fade out (if menu closed)
- Menu text returns to original position

---

## Animation Timings
| Element | Duration | Ease | Delay |
|---------|----------|------|-------|
| Button icon | 0.1s | power4.out | 0s |
| Hamburger/Text | 0.2s | power2.out | 0s |
| Overlay | 0.3s | power2.out | 0.1s |
| Menu links | 0.6s | power3.out/in | 0.1s |
| Link stagger | - | - | 0.05s each |
| Hover scale | 0.3s | power2.out | 0s |

---

## File Location
- **Script**: `src/scripts/menu-toggle.ts`
- **Styles**: `src/components/Navbar.astro` (inside `<style>` block)
