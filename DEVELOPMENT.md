# Achieve Studio - Development Guide

## Getting Started

### 1. Initial Setup
```bash
# Clone or navigate to the project
cd /Users/robertgyorgy/achieve.ro\ v\ noua

# Install dependencies
npm install

# Start development server
npm run dev
```

Navigate to `http://localhost:3000` to see the site live.

## Project Structure Overview

### Pages
- **`/`** - Homepage with hero, featured work, services, FAQ, and CTA
- **`/services`** - Services listing page
- **`/work`** - Portfolio/work listing grid
- **`/work/[project]`** - Dynamic project detail pages
- **`/about`** - About page with team and company info

### Components
All components are in `src/components/` and are Astro files (`.astro`):

| Component | Purpose |
|-----------|---------|
| `Navbar.astro` | Fixed header with navigation |
| `HeroSection.astro` | Full-screen hero with preloader |
| `Marquee.astro` | Scrolling text banner |
| `FeaturedWork.astro` | Showcase of 3 projects |
| `ServicesSection.astro` | Grid of 4 services |
| `FAQSection.astro` | Expandable FAQ items |
| `CTASection.astro` | Color-cycling CTA button |
| `Footer.astro` | Footer with links and info |

### Scripts
TypeScript utilities in `src/scripts/`:

| Script | Purpose |
|--------|---------|
| `main.ts` | Entry point, initializes all systems |
| `gsap-utils.ts` | GSAP helper functions |
| `reveal-animations.ts` | Text reveal animation system |

## Key Features

### 1. Animations with GSAP
The site uses GSAP for smooth, performant animations.

**Quick Start:**
```typescript
import gsap from 'gsap';

// Simple tween
gsap.to(element, { duration: 0.5, x: 100 });

// Timeline
const tl = gsap.timeline();
tl.to(element, { y: 0, opacity: 1, stagger: 0.1 });
```

### 2. Text Reveals
Use data attributes to automatically animate text:

```html
<!-- Title reveal -->
<h1 data-reveal="title" data-reveal-duration="0.6">
  Amazing Title
</h1>

<!-- Line reveal -->
<p data-reveal="lines" data-reveal-stagger="0.1">
  First line
  Second line
  Third line
</p>

<!-- Word reveal -->
<p data-reveal="words">
  Watch each word appear individually
</p>

<!-- Object reveal -->
<div data-reveal="object" data-reveal-direction="up">
  Fade in from below
</div>
```

### 3. Draggable Elements
Currently implemented in HeroSection for desktop only:

```typescript
// Elements automatically become draggable on desktop
// Toggle by checking window.innerWidth >= 1024
```

### 4. Responsive Design
Mobile-first approach using Tailwind breakpoints:

```html
<!-- Default: mobile -->
<div class="text-sm">Mobile</div>

<!-- sm: 640px -->
<div class="sm:text-base">Tablet</div>

<!-- md: 768px -->
<div class="md:text-lg">Large tablet</div>

<!-- lg: 1024px -->
<div class="lg:text-xl">Desktop</div>
```

## Common Tasks

### Adding a New Page

1. Create file in `src/pages/` with `.astro` extension:
```astro
---
import Layout from '../layouts/Layout.astro';
import Navbar from '../components/Navbar.astro';
import Footer from '../components/Footer.astro';
---

<Layout title="Page Title" description="Page description">
  <Navbar />
  <main>
    <!-- Your content -->
  </main>
  <Footer />
</Layout>
```

2. File-based routing creates the URL automatically:
   - `src/pages/about/index.astro` → `/about`
   - `src/pages/blog/post-slug.astro` → `/blog/post-slug`

### Adding a New Component

1. Create `.astro` file in `src/components/`:
```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<div>
  <h2>{title}</h2>
  {description && <p>{description}</p>}
</div>

<style>
  /* Component-scoped styles */
</style>
```

2. Import and use in pages:
```astro
import MyComponent from '../components/MyComponent.astro';

<MyComponent title="Hello" description="World" />
```

### Styling Components

Use Tailwind CSS classes:
```astro
<div class="bg-dark-bg text-white p-8 rounded-lg hover:shadow-lg transition-shadow">
  Styled with Tailwind
</div>
```

Custom styles in `<style>` tags:
```astro
<style>
  :global(body) { /* Affects global styles */ }
  
  .component { /* Scoped to component */ }
  
  @media (max-width: 768px) {
    .component { /* Mobile styles */ }
  }
</style>
```

### Adding GSAP Animations

In component script section:
```astro
<script>
  import gsap from 'gsap';

  const element = document.querySelector('.target');
  
  element?.addEventListener('click', () => {
    gsap.to(element, {
      duration: 0.5,
      scale: 1.2,
      ease: 'power2.out'
    });
  });
</script>
```

## Styling System

### Tailwind Configuration
Extended in `tailwind.config.js`:

```javascript
colors: {
  'dark-bg': '#0f0f0f',
  'dark-bg-alt': '#0d141a',
  'light-bg': '#ffffff',
  'light-bg-alt': '#e4e5de',
  'text-light': '#ffffff',
  'text-dark': '#0f0f0f',
  'accent-orange': '#ff4500',
}
```

### Common Pattern
Dark backgrounds with orange accents:
```html
<div class="bg-dark-bg text-white">
  <button class="bg-accent-orange text-dark-bg hover:scale-105">
    CTA Button
  </button>
</div>
```

## Performance Tips

1. **Use Lazy Loading**
   ```html
   <img loading="lazy" src="..." alt="..." />
   ```

2. **Optimize Images**
   - Use WebP format with JPG fallback
   - Different sizes for mobile/desktop

3. **Code Splitting**
   - Scripts are automatically split per page
   - Use dynamic imports for large libraries

4. **CSS Classes Over Inline Styles**
   - Better with Tailwind optimization
   - Easier to maintain

## Debugging

### Browser DevTools
1. Open DevTools (F12)
2. Check Console for errors
3. Use Lighthouse for performance

### GSAP Debugging
```javascript
gsap.globalTimeline.getChildren().forEach(child => {
  console.log(child);
});
```

### Astro Debugging
```astro
<!-- Log in server logs -->
<script define:vars={{ debug: true }}>
  console.log('Client-side log');
</script>
```

## Building for Production

```bash
# Create optimized build
npm run build

# Preview production build locally
npm run preview

# The dist/ folder contains static files ready for deployment
```

## Deployment

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy
```

### Static Hosting (GitHub Pages, etc.)
Upload contents of `dist/` folder to your host.

## Troubleshooting

### Issue: Animations not working
- Check if GSAP is imported: `import gsap from 'gsap';`
- Ensure element exists before animating
- Check console for errors

### Issue: Styles not applying
- Clear cache: `npm run build` then `npm run preview`
- Check Tailwind class names for typos
- Verify custom CSS is in proper scope

### Issue: Images not loading
- Check file paths are relative to `public/`
- Use `/images/file.jpg` not `./images/file.jpg`
- Verify file exists in correct folder

## Resources

- [Astro Documentation](https://docs.astro.build/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GSAP Docs](https://gsap.com/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

## Quick Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code quality
npm run lint         # Check for errors (if configured)
npm run format       # Format code (if configured)
```

## Next Steps

1. **Add Content**: Update component copy and data
2. **Add Images**: Place assets in `/public/images`
3. **Configure SEO**: Update meta tags in Layout
4. **Add Analytics**: Integrate GA, Hotjar, etc.
5. **Deploy**: Push to Vercel, Netlify, or your host
