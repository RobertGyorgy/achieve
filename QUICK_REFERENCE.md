# Quick Reference Card

## 🚀 Quick Start (30 seconds)

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 📁 File Locations

| What | Where |
|------|-------|
| Components | `src/components/*.astro` |
| Pages | `src/pages/*.astro` |
| Styles | `src/styles/global.css` |
| Scripts | `src/scripts/*.ts` |
| Config | `*.config.js`, `astro.config.mjs` |
| Assets | `public/` |
| Docs | `*.md` files |

## 🎨 Key Colors

```
Dark: #0f0f0f
Dark Alt: #0d141a
Orange: #ff4500
White: #ffffff
Cream: #e4e5de
```

## 📝 Common Tasks

### Edit Component Content
```
1. Open src/components/ComponentName.astro
2. Edit HTML/text content
3. Save - browser auto-refreshes
```

### Add New Page
```
1. Create src/pages/pagename/index.astro
2. Import Layout, Navbar, Footer
3. Add content between tags
```

### Change Colors
```
tailwind.config.js → colors section
```

### Add Images
```
1. Place in public/images/
2. Reference: <img src="/images/filename.jpg" />
```

### Add Fonts
```
1. Place in public/fonts/
2. Add @font-face in src/styles/global.css
```

## 🎬 Animations

### Auto-Animate Text
```html
<h1 data-reveal="title" data-reveal-duration="0.6">
  Text
</h1>
```

### Animation Types
- `data-reveal="title"` - Rotate in
- `data-reveal="lines"` - Line by line
- `data-reveal="words"` - Word by word
- `data-reveal="object"` - Fade in

## 🏗️ Page Structure

All pages use this pattern:
```astro
---
import Layout from '../layouts/Layout.astro';
import Navbar from '../components/Navbar.astro';
import Footer from '../components/Footer.astro';
---

<Layout title="Page Title" description="Description">
  <Navbar />
  <main>
    <!-- Your content -->
  </main>
  <Footer />
</Layout>
```

## 🎯 Responsive Breakpoints

```
Mobile (default): 0px+
xsm:              375px+
sm:               640px+
md:               768px+
lg:               1024px+
xl:               1280px+
2xl:              1536px+
```

Usage:
```html
<div class="text-sm md:text-lg lg:text-xl">
  Responsive text
</div>
```

## 📦 Commands

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Build for production
npm run preview  # Preview production build
npm install      # Install dependencies
```

## 🔍 File Structure Quick View

```
src/
├── components/      ← Edit: Component HTML/logic
├── pages/          ← Edit: Page content
├── layouts/        ← Edit: Page wrapper
├── scripts/        ← Edit: Animations/logic
├── styles/         ← Edit: Global CSS
└── env.d.ts       ← TypeScript types

public/            ← Add: Images, videos, fonts
├── images/
├── videos/
└── fonts/
```

## 💡 Quick Tips

- **Live Reload:** Changes auto-update in browser
- **Mobile Test:** Open DevTools → Toggle device toolbar
- **Colors:** All in tailwind.config.js
- **Fonts:** All in src/styles/global.css
- **Components:** Reuse in any page
- **Animations:** Use data attributes or GSAP

## 📞 Documentation Quick Links

| Need | File |
|------|------|
| Overview | README.md |
| Start | QUICKSTART.md |
| Dev Guide | DEVELOPMENT.md |
| Assets | ASSETS.md |
| Nav Help | INDEX.md |
| Status | VERIFICATION.md |

## 🎯 Customization Checklist

### Content
- [ ] Update homepage text
- [ ] Update services
- [ ] Update projects
- [ ] Add team members

### Design
- [ ] Update colors (if needed)
- [ ] Add logo
- [ ] Add company name
- [ ] Adjust spacing (if needed)

### Assets
- [ ] Add favicon
- [ ] Add project images
- [ ] Add videos
- [ ] Add fonts (if using custom)

### SEO
- [ ] Update meta descriptions
- [ ] Update page titles
- [ ] Update OG images
- [ ] Add social links

### Deploy
- [ ] Run `npm run build`
- [ ] Test with `npm run preview`
- [ ] Choose hosting
- [ ] Deploy

## 🚀 Deploy Commands

```bash
# Build
npm run build

# Test build locally
npm run preview

# Then use platform's deployment method:
# - Vercel: vercel deploy
# - Netlify: netlify deploy
# - Or upload dist/ to your host
```

## ⚡ Performance Targets

- Lighthouse Performance: 90+
- Lighthouse Accessibility: 90+
- Lighthouse Best Practices: 90+
- Lighthouse SEO: 90+

## 🔐 Security Notes

- HTTPS enforced (platform handles)
- No sensitive data in code
- Env vars for secrets (.env)
- HTML escaping automatic
- XSS protection built-in

## 📱 Mobile Optimization

- Mobile menu included
- Touch-friendly buttons
- Responsive images
- Optimized fonts
- Viewport meta set

## 🎨 Component Props

```astro
<Marquee 
  text="Your Text"
  bgColor="bg-dark-bg"
  textColor="text-white"
/>
```

Check component files for available props.

## 🐛 Debugging Quick Tips

1. **Check console:** Press F12 → Console tab
2. **Check network:** F12 → Network tab
3. **Check build:** Run `npm run build`
4. **Check syntax:** Save file, check console
5. **Clear cache:** `npm run build` clears it

## 📖 One-Liner Docs

- **Astro:** Framework for building fast websites
- **Tailwind:** Utility-first CSS framework
- **GSAP:** Animation library for smooth effects
- **TypeScript:** JavaScript with type safety

## ✨ You're All Set!

Everything is ready. Just run:

```bash
npm install && npm run dev
```

Then start customizing! 🎉
