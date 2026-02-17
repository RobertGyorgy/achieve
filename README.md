# Achieve Studio - Premium Portfolio Website

A sophisticated, animation-rich portfolio and agency website built with modern web technologies.

## 🚀 Tech Stack

- **Framework:** Astro 5.4.2
- **CSS Framework:** Tailwind CSS 4.1.17
- **Animation Library:** GSAP 3.14.2
- **Language:** TypeScript
- **Package Manager:** npm

## 📋 Project Structure

```
src/
├── components/          # Reusable Astro components
│   ├── Navbar.astro
│   ├── HeroSection.astro
│   ├── Marquee.astro
│   ├── FeaturedWork.astro
│   ├── ServicesSection.astro
│   ├── FAQSection.astro
│   ├── CTASection.astro
│   └── Footer.astro
├── layouts/
│   └── Layout.astro     # Main layout wrapper
├── pages/
│   ├── index.astro      # Homepage
│   ├── services/index.astro
│   ├── work/
│   │   ├── index.astro  # Portfolio listing
│   │   └── [project].astro # Dynamic project pages
│   └── about/index.astro
├── scripts/             # TypeScript utilities
│   ├── main.ts          # Entry point
│   ├── gsap-utils.ts    # GSAP helper functions
│   └── reveal-animations.ts # Text reveal system
├── styles/
│   └── global.css       # Global styles and fonts
└── env.d.ts            # TypeScript declarations
```

## ⚡ Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Navigate to http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

### Colors
- **Dark Background:** `#0f0f0f`
- **Dark Background Alt:** `#0d141a`
- **Light Background:** `#ffffff`
- **Light Background Alt:** `#e4e5de`
- **Accent Orange:** `#ff4500`

### Typography
- **Primary Font:** HKGrotesk (sans-serif)
  - Weights: 200, 300, 400, 500, 900
- **Display Font:** Nura (serif)
  - Weight: 900

### Custom Tailwind Configuration
Extended theme includes:
- Custom color palette
- Font family extensions
- Additional screen sizes (xsm: 375px)

## 🎬 Animation Features

### GSAP Integration
- Timeline-based animations
- ScrollTrigger for scroll-linked animations
- Staggered animations for lists
- Hardware-accelerated transforms

### Reveal Animations
Available data attributes for automatic animations:
- `data-reveal="title"` - Text reveal with 3D rotation
- `data-reveal="lines"` - Line-by-line reveal
- `data-reveal="words"` - Word-by-word reveal
- `data-reveal="object"` - Object fade-in

Configuration attributes:
- `data-reveal-duration` - Animation duration in seconds
- `data-reveal-delay` - Start delay in seconds
- `data-reveal-stagger` - Stagger amount between elements
- `data-reveal-direction` - Direction: up, down, left, right

## 📱 Responsive Design

Breakpoints used:
- Mobile: 0px - 374px
- xsm: 375px+
- sm: 640px+
- md: 768px+
- lg: 1024px+ (major desktop threshold)
- xl: 1280px+
- 2xl: 1536px+

## 🔧 Key Features

### Components

1. **Navbar** - Fixed navigation with mobile menu toggle
2. **Hero Section** - Animated preloader with draggable elements
3. **Marquee** - Horizontal scrolling text with configurable styling
4. **Featured Work** - Project showcase cards with hover effects
5. **Services Section** - Service cards with descriptions and features
6. **FAQ Section** - Expandable accordion with smooth animations
7. **CTA Button** - Color-cycling button with dynamic glow
8. **Footer** - Links and social media integration

### Interactive Elements

- **Draggable Elements:** Hero text and logo (desktop only)
- **Menu Toggle:** Mobile navigation with hamburger animation
- **Color Cycling:** CTA button changes colors on hover
- **Smooth Scrolling:** Entire site uses smooth scroll behavior

## 📊 Performance Optimizations

- GPU acceleration with `translateZ(0)`
- `will-change` properties on animated elements
- Lazy loading for below-fold content
- Font preloading in head
- Optimized WebP/JPG images with fallbacks
- WebM/MP4 video optimization

### Lighthouse Targets
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## 🌐 SEO & Meta Tags

All pages include:
- Proper meta descriptions
- Open Graph tags
- Twitter Card tags
- Canonical URLs
- Structured data support

## 🎯 Development Workflow

### File Organization
```
public/
├── fonts/           # Custom font files
├── images/          # High-quality images
├── images-mobile/   # Mobile-optimized images
├── videos/          # WebM format (desktop)
└── videos-mobile/   # MP4 format (mobile)
```

### Component Guidelines
1. Use semantic HTML
2. Include ARIA labels for interactive elements
3. Ensure keyboard navigation support
4. Optimize for mobile-first approach
5. Use Tailwind utilities for styling

## 🚀 Deployment

### Static Site Hosting
- Build output: `/dist` directory
- Compatible with: Vercel, Netlify, GitHub Pages
- Environment variables: Optional for external services

### Build Command
```bash
npm run build
```

## 📚 Additional Resources

### GSAP Documentation
- [GSAP Official Docs](https://gsap.com/docs/)
- [ScrollTrigger Plugin](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)

### Astro Documentation
- [Astro Docs](https://docs.astro.build/)
- [Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs/)
- [Tailwind Config](https://tailwindcss.com/docs/configuration)

## 🔐 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- iOS Safari: Latest 2 versions

## 📝 Content Management

### Projects Data Structure
Each project includes:
- Title and slug
- Year and description
- Services array
- Desktop/mobile video URLs
- Poster image
- Optional: Challenge, Solution, Results

### Services Data Structure
Each service includes:
- Title and description
- 5 feature points
- Desktop video (webm)
- Mobile video (mp4)
- Poster image

## 🐛 Debugging

### Development Mode
```bash
npm run dev
```

Enable development logs in console:
- GSAP animation initialization
- Page transition events
- Reveal animation triggers

### Performance Monitoring
Use Lighthouse in Chrome DevTools:
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Generate report

## 📄 License

© 2024 Achieve Studio. All rights reserved.

## ✨ Credits

Built with modern web technologies and best practices for premium digital experiences.
