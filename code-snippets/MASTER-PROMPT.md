# ACHIEVE.RO WEBSITE - MASTER RECREATION PROMPT

## PROJECT OVERVIEW

Build a high-performance, animation-rich portfolio/agency website for a modern web design and development studio called "Achieve Studio". The site showcases design work, services, and capabilities with sophisticated GSAP animations, draggable interactive elements, smooth transitions, and a premium aesthetic.

---

## TECH STACK & DEPENDENCIES

**Framework:** Astro 5.4.2
**CSS Framework:** Tailwind CSS 4.1.17
**Animation Library:** GSAP 3.14.2
**Styling Approach:** Tailwind CSS with custom CSS for advanced animations
**Build Tool:** Node.js with npm

**Key Dependencies:**
```json
{
  "astro": "^5.4.2",
  "tailwindcss": "^4.1.17",
  "@tailwindcss/vite": "^4.1.17",
  "gsap": "^3.14.2"
}
```

---

## COLOR PALETTE & DESIGN SYSTEM

### Primary Colors
- **Dark Background:** `#0f0f0f` (pure black, main bg)
- **Dark Background Alt:** `#0d141a` (dark blue-black, accents)
- **Light Background:** `#ffffff` (white)
- **Light Background Alt:** `#e4e5de` (cream white)
- **Accent Orange:** `#ff4500` (orange red, primary accent)

### Typography
- **Primary Font:** HKGrotesk (sans-serif)
  - Weights: 200 (ExtraLight), 300 (Light), 400 (Regular), 500 (Medium), 900 (Black)
  - Format: WOFF2 with WOFF fallback
- **Display Font:** OSFont (decorative, used for large headings)
  - Weight: 900
  - Format: WOFF
  - Used for: Hero section "ACHIEVE" letters, marquee text

### Tailwind Extensions
```javascript
colors: {
  'dark-bg': '#0f0f0f',
  'dark-bg-alt': '#0d141a',
  'light-bg': '#ffffff',
  'light-bg-alt': '#e4e5de',
  'text-light': '#ffffff',
  'text-dark': '#0f0f0f',
  'accent-orange': '#ff4500',
},
fontFamily: {
  sans: ['HKGrotesk', 'sans-serif'],
  osfont: ['OSFont', 'sans-serif'],
},
screens: {
  'xsm': '375px',
}
```

---

## PROJECT STRUCTURE

```
src/
├── components/
│   ├── Navbar.astro              # Navigation with menu toggle
│   ├── HeroSection.astro         # Hero with preloader, draggable text/logo
│   ├── Marquee.astro             # Scrolling text marquee component
│   ├── FeaturedWork.astro        # Showcase of 3 featured projects
│   ├── ServicesSection.astro     # 4 service cards with descriptions
│   ├── FAQSection.astro          # Expandable FAQ accordion
│   ├── CTASection.astro          # Color-cycling CTA button
│   ├── Footer.astro              # Footer with draggable "ACHIEVE" letters
│   ├── WorkGrid.astro            # Grid of all work projects
│   └── WorkPageTemplate.astro    # Template for individual project pages
├── layouts/
│   └── Layout.astro              # Main layout wrapper with metadata & styles
├── pages/
│   ├── index.astro               # Homepage
│   ├── services/index.astro      # Services page
│   ├── work/index.astro          # Portfolio/work listing page
│   ├── about/index.astro         # About page
│   └── work/[project]/index.astro # Individual project detail pages
├── scripts/
│   ├── main.ts                   # Entry point
│   ├── preloader.ts              # Loading sequence animations
│   ├── menu-toggle.ts            # Menu open/close with animations
│   ├── draggable.ts              # Make elements draggable with momentum
│   ├── footer-draggable.ts       # Footer letter dragging with inertia
│   ├── reveal-animations.ts      # Text reveal animations on scroll
│   ├── page-content-animations.ts # Content entrance animations
│   ├── scroll-stack.ts           # Work cards scroll stacking
│   ├── faq-accordion.ts          # FAQ expand/collapse logic
│   ├── bubble-button.ts          # Bubble ripple button effect
│   ├── smooth-scroll.ts          # Smooth scrolling behavior
│   ├── gsap-utils.ts             # GSAP utility functions
│   └── view-transition-handler.ts # Handle Astro view transitions
└── styles/
    └── global.css                # Global styles, fonts, custom utilities
```

---

## PAGE STRUCTURE & COMPONENTS

### HOMEPAGE (`/`)

**Page Flow:**
1. Preloader (with animated ACHIEVE letters)
2. Hero Section (draggable text, animated video background)
3. Marquee (scrolling "PREMIUM WORK")
4. Featured Work (3 showcase projects)
5. Marquee (scrolling "SERVICES")
6. Services Section (4 service cards)
7. Marquee (scrolling "WORK TOGETHER")
8. FAQ Section
9. CTA Button Section
10. Footer

### SERVICES PAGE (`/services`)

Similar structure to homepage but with:
- Different marquee text ("SERVICES")
- Expanded services grid
- FAQ section
- CTA button

### WORK/PORTFOLIO PAGE (`/work`)

- Dark background
- Marquee header ("ALL WORK")
- Grid of work projects
- CTA button
- Footer

### INDIVIDUAL PROJECT PAGE (`/work/[project]`)

- Hero image/video
- Project details (title, description, year, services)
- Live site button (if applicable)
- Next project preview
- Footer

---

## KEY COMPONENTS DETAILED

### 1. HERO SECTION

**Features:**
- Animated preloader with ACHIEVE letters
- Draggable text elements (WEB DESIGN + DEV STUDIO)
- Draggable logo letters (ACHIEVE)
- Video background (white gradient to orange)
- Wave animation canvas
- Fluid animation effects
- Animated description text with reveal effect

**Animations:**
- Preloader letters flip in with 3D transforms
- Hero text fades and slides up on load
- Logo letters respond to mouse movement (draggable)
- Video container fades in on preloader complete

### 2. MARQUEE COMPONENT

**Features:**
- Horizontally scrolling text
- Background image
- Configurable text/colors
- Smooth infinite scroll loop
- Tooltip "Swipe" indicator

**Props:**
- `text`: String to display
- `image`: Background image URL
- `bgColor`: Tailwind color class
- `textColor`: Tailwind color class

### 3. FEATURED WORK SECTION

**Features:**
- 3 project showcase cards
- Hover effects (text translation, icon reveal)
- Video previews (desktop: webm, mobile: mp4)
- Project tags
- Responsive grid layout
- Orange glow effect on desktop

**Card Details:**
- Desktop: Large cards with orange backgrounds and glows
- Mobile: Rounded cards with vertical layout
- Hover: Title slides right, arrow icon appears

### 4. SERVICES SECTION

**Features:**
- 4 service cards (Web Design, Web Development, AI & Software, E-commerce)
- Description text with bullet points
- Video backgrounds (webm/mp4)
- Animated reveals on scroll
- Fully responsive layout

**Service Cards Include:**
- Title
- Comprehensive description
- 5 bullet points with tooltips
- Desktop/mobile video URLs
- Poster image for fallback

### 5. FAQ SECTION

**Features:**
- Dark background (#0d141a)
- Expandable details elements
- Plus (+) icon that rotates on expand
- Smooth open/close animation
- White text
- Custom scrolling behavior

**Interactions:**
- Click to expand/collapse
- Icon rotates 90° on expand
- Content slides in/out
- Smooth transitions

### 6. CTA BUTTON SECTION

**Features:**
- Dark background container
- Color-cycling button on hover
- 16 vibrant colors in cycle
- Dynamic glow matching button color
- Text slides on hover
- Arrow animates in/out
- Cal.com integration for scheduling

**Colors in Cycle:**
Deep Pink, Hot Pink, Light Pink, Orchid, Medium Purple, Blue Violet, Royal Blue, Deep Sky Blue, Dark Turquoise, Spring Green, Lime Green, Gold, Orange, Tomato, Orange Red

**Animations:**
- Text: slides 112px right (0.5s power2.out)
- Arrow: fades in and slides (0.5s power2.out)
- Glow: dynamically generated from hex values with RGB

### 7. FOOTER

**Features:**
- Dark background
- Large draggable "ACHIEVE" letters
- Social links
- Contact information
- Dragging with inertia physics
- Each letter can be dragged independently

**Interactions:**
- Mouse down: Start drag, disable transitions
- Mouse move: Calculate velocity, update position
- Mouse up: Apply inertia with 0.95 damping factor
- Letters maintain position on release

---

## ANIMATION SYSTEM

### GSAP Integration

**Timeline-based Animations:**
- Use GSAP timelines for complex sequences
- Staggered animations for lists
- Keyframe animations for entrance effects

**Common Patterns:**
```javascript
// Simple tween
gsap.to(element, { duration: 0.5, x: 100, ease: 'power2.out' });

// Timeline with stagger
const tl = gsap.timeline();
tl.to(elements, { y: 0, opacity: 1, stagger: 0.05, ease: 'power3.out' });

// Conditional animations (desktop only)
if (window.innerWidth >= 1024) {
  gsap.to(element, { ... });
}
```

### Reveal Animations

**Data Attributes for Auto-Animation:**
- `data-reveal="title"` - Text reveal with 3D rotation
- `data-reveal="lines"` - Line-by-line text reveal
- `data-reveal="words"` - Word-by-word text reveal
- `data-reveal="object"` - Object fade-in with direction
- `data-reveal="border"` - Border draw animation
- `data-reveal="svg"` - SVG animation

**Animation Attributes:**
- `data-reveal-duration` - Animation duration in seconds
- `data-reveal-delay` - Start delay in seconds
- `data-reveal-stagger` - Stagger amount between elements
- `data-reveal-direction` - Direction: up, down, left, right
- `data-reveal-simple` - Simplified animation (no complex effects)

### View Transitions

**Astro View Transitions:**
- Automatic page transitions with fade effect
- GSAP animations re-initialize on page load
- Custom transition handler for complex sequences

**Transition Handler Pattern:**
```typescript
GsapViewTransitionHandler.register('selector', (transition) => {
  transition.add(() => {
    // Re-initialize animations
  });
});
```

---

## INTERACTIVE ELEMENTS

### 1. MENU TOGGLE

**Button States:**
- `closed`: Small dot (scale 0.35 on desktop, scale 1 on mobile)
- `opened`: Full circle (scale 1)

**Hamburger Transformation:**
- Top bar: rotates 45° when opened
- Bottom bar: rotates -45° when opened
- Creates "X" shape

**Menu Content Animation:**
- Overlay fades in (0.3s power2.out)
- Links slide up with stagger (0.6s, 0.05s between)
- On close: reverse animation

**Hover Effects:**
- Icon scales to 1 on hover
- Text moves left (-20px) to avoid overlap
- Hamburger bars become visible

### 2. DRAGGABLE ELEMENTS

**Hero Draggable:**
- Logo letters: Individual dragging
- Hero text words: Individual dragging
- No constraints, free movement

**Footer Draggable:**
- ACHIEVE letters: Individual dragging
- Velocity tracking for momentum
- Inertia: 0.95 damping factor
- Continues until velocity < 0.1

**Bubble Button:**
- Ripple effect on click
- Bubble expands from center
- Custom color backgrounds

### 3. CTA BUTTON

**Hover Behavior:**
1. Change background color to next in cycle
2. Generate matching glow effect
3. Animate text 112px to the right
4. Fade in and slide arrow
5. Advance color index for next hover

**Mouse Leave:**
- Reset to orange background
- Reset text position (slide back)
- Fade out arrow

---

## PERFORMANCE OPTIMIZATIONS

### GPU Acceleration
- Use `translateZ(0)` for hardware acceleration
- `will-change` on animated elements
- `backface-visibility: hidden` for 3D transforms
- `force3D: true` in GSAP tweens

### Image Optimization
- WebP format with fallbacks
- Responsive images for different viewports
- Lazy loading for below-fold content

### Video Optimization
- WebM format for desktop (better compression)
- MP4 format for mobile/fallback
- Poster images for initial display
- Autoplay with muted attribute

### Font Optimization
- Font preloading in head
- WOFF2 with WOFF fallback
- `font-display: swap` for custom fonts
- System fonts as fallback

### Code Splitting
- Component-based architecture
- Lazy loading scripts
- Event-based initialization

---

## RESPONSIVE DESIGN BREAKPOINTS

**Tailwind Breakpoints Used:**
- Mobile: default (0px - 374px)
- xsm: 375px
- sm: 640px
- md: 768px
- lg: 1024px (major desktop threshold)
- xl: 1280px
- 2xl: 1536px

**Key Responsive Changes:**
- **< 1024px:** No draggable elements, simplified animations, mobile video formats
- **< 768px:** Adjusted typography sizes, reduced spacing, simplified layouts
- **< 640px:** Single column layouts, touch-friendly spacing, optimized font sizes

---

## SEO & META TAGS

**Required Meta Tags:**
- `<title>` - Page title
- `<meta name="description">` - Page description
- `<meta name="keywords">` - Keywords
- `<meta name="author">` - Author name
- `<link rel="canonical">` - Canonical URL

**Open Graph Tags:**
- `og:type`, `og:url`, `og:title`, `og:description`, `og:image`

**Twitter Card:**
- `twitter:card`, `twitter:url`, `twitter:title`, `twitter:description`, `twitter:image`

**Additional:**
- `<meta name="theme-color">` - Browser theme color
- `<meta name="mobile-web-app-capable">` - PWA support
- View transitions meta tags for Astro

---

## STYLING APPROACH

### Tailwind CSS
- Utility-first approach
- Custom color extensions
- Custom screen sizes
- Dark mode via class strategy

### Custom CSS
- Global styles in `src/styles/global.css`
- Component scoped styles (inside `<style>` tags)
- CSS variables for theming
- Advanced transforms and animations

### Common Classes

**Text Reveal:**
- `.preserve-3d` - 3D perspective
- `.dragging` - During drag state
- `.opened` / `.closed` - Menu states

**Animations:**
- `.will-change-transform` - Performance optimization
- `.transform-gpu` - GPU acceleration
- `.fade-bg` - Background fade effect

---

## CONTENT STRUCTURE

### Services Data
Each service includes:
- Title (Web Design, Web Development, etc.)
- Description paragraph
- 5 bullet points with titles and tooltips
- Desktop video URL (webm)
- Mobile video URL (mp4)
- Poster image

### Projects Data
Each project includes:
- Title
- Slug/href
- Tags array
- Desktop video (webm)
- Mobile video (mp4)
- Poster image
- Optional: Description, year, services, next project

### FAQ Data
Each FAQ includes:
- Question
- Answer
- Auto-indexed for map iteration

---

## INTERACTION PATTERNS

### Tooltips
- Data attribute: `data-tooltip="text"`
- Shows on hover with custom library
- Context-aware placement

### Smooth Scrolling
- `scroll-behavior: smooth` on html
- Custom smooth scroll script for enhanced effect

### Form Handling
- Contact form in navbar menu
- Input validation
- Success message display
- Error message display

### Modal/Menu Overlay
- Fixed positioning
- Backdrop blur effect
- Click outside to close
- Keyboard escape support

---

## BROWSER COMPATIBILITY

**Target Browsers:**
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- iOS Safari: Latest 2 versions

**Fallbacks:**
- CSS Grid with flexbox fallback
- Transforms with fallback properties
- WebP with JPG fallback
- WebM with MP4 fallback

---

## DEVELOPMENT WORKFLOW

### Local Development
```bash
npm install
npm run dev
# Runs on http://localhost:3000
```

### Build Process
```bash
npm run build
# Generates static site in dist/
npm run preview
# Preview production build locally
```

### Git Workflow
- Feature branches for new components
- Pull requests with code review
- Merge to main for deployment

---

## FILE ASSET ORGANIZATION

**Directory:** `/public/`

### Images
- `/public/images/` - Main high-quality images
- `/public/images-mobile/` - Mobile-optimized images
- `/public/og-images/` - OpenGraph preview images

### Videos
- `/public/videos/` - Desktop WebM videos
- `/public/videos-mobile/` - Mobile MP4 videos

### Fonts
- `/public/fonts/` - Custom font files
  - HKGrotesk-Regular.woff2
  - HKGrotesk-Medium.woff2
  - HKGrotesk-Light.woff2
  - HKGrotesk-ExtraLight.woff2
  - HKGrotesk-Black.woff2
  - OSFont.woff

---

## SPECIAL CONSIDERATIONS

### 3D Transforms
- Used for preloader and reveals
- `transform-style: preserve-3d` on containers
- `perspective` values for depth

### Scroll Animations
- ScrollTrigger plugin from GSAP
- Trigger animations at specific scroll positions
- Staggered animations for lists

### State Management
- Classes for state (opened/closed, dragging)
- Data attributes for configuration
- LocalStorage for preferences (optional)

### Accessibility
- Semantic HTML (button, nav, form, etc.)
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast text
- Alt text for images

---

## ADDITIONAL FEATURES

### Preloader
- Animated logo letters
- Loading progress visualization
- Background gradient animation
- Auto-play hero animations on complete

### Wave/Fluid Animation
- Canvas-based animation
- Particle/wave effects
- Gradient background
- Responsive sizing

### Custom Scrollbar
- Hidden on most pages (`.scrollbar-hide`)
- Smooth scrolling behavior
- Custom styles if visible

---

## DEPLOYMENT

**Static Site Hosting:**
- Build to `/dist` directory
- Deploy to any static host (Vercel, Netlify, etc.)
- Environment variables for external services (Cal.com)

**Performance Targets:**
- Lighthouse Performance: 90+
- Lighthouse Accessibility: 90+
- Lighthouse Best Practices: 90+
- Lighthouse SEO: 90+

---

## SUMMARY

This is a sophisticated, animation-heavy portfolio website for a web design/development agency. The site emphasizes:
1. **Premium Aesthetics:** Dark/light contrast, orange accents
2. **Rich Animations:** GSAP timelines, scroll reveals, draggable elements
3. **Interactive Elements:** Draggable hero text, menu animations, color-cycling buttons
4. **Performance:** GPU acceleration, optimized assets, efficient code
5. **Responsive Design:** Mobile-first approach with progressive enhancement
6. **Accessibility:** Semantic HTML, keyboard navigation, ARIA labels
7. **Modern Stack:** Astro, Tailwind, GSAP for maximum performance and developer experience

---

## QUICK START CHECKLIST

- [ ] Set up Astro 5 with Tailwind CSS 4
- [ ] Configure custom colors and fonts
- [ ] Create layout wrapper with meta tags
- [ ] Build hero section with preloader
- [ ] Implement draggable elements (footer, hero)
- [ ] Build marquee scrolling component
- [ ] Create featured work cards
- [ ] Add services grid with videos
- [ ] Build FAQ accordion
- [ ] Create CTA button with color cycling
- [ ] Implement menu toggle and animations
- [ ] Add reveal animations system
- [ ] Set up view transitions
- [ ] Optimize images and videos
- [ ] Test responsive design
- [ ] Optimize performance
- [ ] Deploy to hosting platform
