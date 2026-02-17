# CTA Button - Color Cycling Animation

## Overview
A call-to-action button that cycles through vibrant colors on hover with accompanying text and arrow animations.

## Key Features
- Color cycling on hover (16 different colors)
- Dynamic glow effect matching the current color
- Text and arrow animations with GSAP
- Responsive design (animations only on desktop)
- Integration with Cal.com scheduling

## HTML Structure
```astro
<section class="late-cta flex justify-end pb-32 px-4 lg:px-10">
  <button
    type="button"
    data-cal-link="achieve-studio/30min"
    data-tooltip="Let's chat"
    data-hover-colors={JSON.stringify(colors)}
    class="bg-[#1C1C1C] group cursor-pointer relative rounded-2xl xl:rounded-3xl w-full select-none overflow-hidden text-left transition-all duration-200 ease-in-out hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-current/20 focus-visible:ring-4 xl:w-3/4 2xl:w-1/2"
    aria-label="Schedule a meeting: Have more questions?"
  >
    <div class="px-6 py-12 lg:px-12 lg:py-16">
      <div class="relative z-10">
        <div class="space-y-4">
          <h2 class="cta-heading text-2xl font-normal text-white will-change-transform sm:text-4xl md:text-4xl" 
              data-reveal="lines" data-reveal-duration="1.2" data-reveal-stagger="0.05" data-reveal-delay="0">
            Have more questions?
          </h2>
          <p class="text-2xl font-normal text-white will-change-transform sm:text-4xl md:text-4xl" 
             data-reveal="lines" data-reveal-duration="1.2" data-reveal-stagger="0.05" data-reveal-delay="0.15">
            Book a date for a short google meet call to discuss a potential partnership.
          </p>
        </div>
        <div class="cta-arrow mt-16 flex items-center lg:mt-32" aria-hidden="true">
          <h3 id="cta-text" class="translate-x-12 text-4xl xsm:text-5xl font-normal text-white will-change-transform sm:translate-x-20 sm:text-7xl md:translate-x-24 md:text-8xl lg:translate-x-0 lg:text-8xl whitespace-nowrap" 
              data-reveal="lines" data-reveal-duration="1.2" data-reveal-delay="0.2" data-reveal-simple>
            Book a call
          </h3>
          <span class="xsm:h-10 xsm:w-10 absolute left-0 block h-8 w-8 overflow-hidden sm:h-14 sm:w-14 md:left-4 md:h-16 md:w-16">
            <span id="cta-arrow" class="absolute bottom-0 left-0 translate-x-0 opacity-100 will-change-transform lg:-translate-x-[90%] lg:opacity-0">
              <svg viewBox="0 0 24 24" role="img" width="24" height="24" fill="none" 
                   class="h-8 w-8 xsm:h-10 xsm:w-10 text-white sm:h-14 sm:w-14 md:h-16 md:w-16" 
                   data-reveal="object" data-reveal-direction="up" data-reveal-duration="1.2" data-reveal-delay="0.1">
                <path fill-rule="evenodd" clip-rule="evenodd" 
                      d="M1.9999 11.9998C1.9999 12.552 2.44762 12.9997 2.9999 12.9997H18.9757C18.8901 13.148 18.7838 13.2876 18.657 13.4144L12.2931 19.7784C11.9025 20.1689 11.9025 20.8021 12.2931 21.1926C12.6836 21.5831 13.3168 21.5831 13.7073 21.1926L22.1926 12.7073C22.5831 12.3168 22.5831 11.6836 22.1926 11.2931L22.1924 11.293L13.7071 2.80767C13.3166 2.41715 12.6834 2.41715 12.2929 2.80767C11.9024 3.1982 11.9024 3.83136 12.2929 4.22189L18.657 10.586C18.7836 10.7126 18.8896 10.8518 18.9752 10.9998H2.9999C2.44762 10.9997 1.9999 11.4475 1.9999 11.9998Z" 
                      fill="currentColor" />
              </svg>
            </span>
          </span>
        </div>
      </div>
    </div>
  </button>
</section>
```

## Color Array
```typescript
const colors = [
  "#FF1493", // Deep Pink
  "#FF69B4", // Hot Pink
  "#FFB6C1", // Light Pink
  "#FF1493", // Deep Pink (repeated)
  "#DA70D6", // Orchid
  "#9370DB", // Medium Purple
  "#8A2BE2", // Blue Violet
  "#4169E1", // Royal Blue
  "#00BFFF", // Deep Sky Blue
  "#00CED1", // Dark Turquoise
  "#00FF7F", // Spring Green
  "#32CD32", // Lime Green
  "#FFD700", // Gold
  "#FFA500", // Orange
  "#FF6347", // Tomato
  "#FF4500"  // Orange Red
];
```

## JavaScript Animation Logic
```typescript
function initColorCyclingButton(button: HTMLElement) {
  const colors = JSON.parse(button.getAttribute('data-hover-colors') || '[]');
  if (!colors.length) return;
  
  let colorIndex = 0;
  
  // Get animation elements
  const ctaText = button.querySelector('#cta-text') as HTMLElement;
  const ctaArrow = button.querySelector('#cta-arrow') as HTMLElement;
  
  // Set default orange state with glow
  button.style.backgroundColor = '#FF4500';
  button.style.boxShadow = '0 0 20px rgba(255, 69, 0, 0.6), 0 0 40px rgba(255, 69, 0, 0.4), 0 0 60px rgba(255, 69, 0, 0.2)';
  
  // Set initial states for smooth animation
  if (ctaText && window.innerWidth >= 1024) {
    gsap.set(ctaText, { x: 0, force3D: true });
  }
  if (ctaArrow && window.innerWidth >= 1024) {
    gsap.set(ctaArrow, { x: '-90%', opacity: 0, force3D: true });
  }
  
  // Mouse enter - cycle to next color and animate text/arrow
  button.addEventListener('mouseenter', () => {
    const currentColor = colors[colorIndex];
    button.style.backgroundColor = currentColor;
    
    // Extract RGB values from hex for the glow
    const hex = currentColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Create matching glow effect with the current color
    button.style.boxShadow = `0 0 25px rgba(${r}, ${g}, ${b}, 0.7), 0 0 50px rgba(${r}, ${g}, ${b}, 0.5), 0 0 75px rgba(${r}, ${g}, ${b}, 0.3)`;
    
    // Animate text and arrow smoothly with GSAP
    if (window.innerWidth >= 1024) {
      if (ctaText) {
        gsap.to(ctaText, {
          x: 112, // 7rem = 112px
          duration: 0.5,
          ease: 'power2.out',
          force3D: true
        });
      }
      if (ctaArrow) {
        gsap.to(ctaArrow, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          force3D: true
        });
      }
    }
    
    // Increment color index for next hover
    colorIndex = (colorIndex + 1) % colors.length;
  });
  
  // Mouse leave - reset to default orange and reset animations
  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = '#FF4500';
    button.style.boxShadow = '0 0 20px rgba(255, 69, 0, 0.6), 0 0 40px rgba(255, 69, 0, 0.4), 0 0 60px rgba(255, 69, 0, 0.2)';
    
    // Reset text and arrow animations
    if (window.innerWidth >= 1024) {
      if (ctaText) {
        gsap.to(ctaText, {
          x: 0,
          duration: 0.4,
          ease: 'power2.in',
          force3D: true
        });
      }
      if (ctaArrow) {
        gsap.to(ctaArrow, {
          x: '-90%',
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          force3D: true
        });
      }
    }
  });
}
```

## CSS Styling
```css
/* CTA Button Container */
.late-cta {
  background-color: #0d141a;
  position: relative;
}

.late-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #0d141a;
  z-index: -1;
}

/* CTA Button */
.late-cta button {
  transition: all 0.3s ease !important;
  border: none;
  outline: none;
}

.late-cta button:hover {
  transition: all 0.3s ease !important;
}

/* Button text stays white */
.late-cta button h2,
.late-cta button p,
.late-cta button h3 {
  color: #ffffff;
}

/* Arrow animation - handled by GSAP for smoother animation */
.late-cta button #cta-text,
.late-cta button #cta-arrow {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}
```

## Animation Details
- **Color Cycle**: Each hover moves to the next color in the array
- **Text Animation**: Moves 112px to the right on hover
- **Arrow Animation**: Moves from -90% to 0 (slides in) with opacity change
- **Glow Effect**: Dynamically generated from the hex color values
- **Desktop Only**: Animations only apply to screens >= 1024px width
- **Duration**: 0.5s for entering, 0.4s for leaving

## File Location
- **Component**: `src/components/CTASection.astro`
