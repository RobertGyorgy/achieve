# Asset Requirements & Directory Structure

## 📂 Directory Structure for Assets

Create these directories in `/public/` and add your assets:

```
public/
├── fonts/
│   ├── HKGrotesk-ExtraLight.woff2
│   ├── HKGrotesk-ExtraLight.woff
│   ├── HKGrotesk-Light.woff2
│   ├── HKGrotesk-Light.woff
│   ├── HKGrotesk-Regular.woff2
│   ├── HKGrotesk-Regular.woff
│   ├── HKGrotesk-Medium.woff2
│   ├── HKGrotesk-Medium.woff
│   ├── HKGrotesk-Black.woff2
│   ├── HKGrotesk-Black.woff
│   └── Nura.ttf
├── images/
│   ├── projects/
│   │   ├── digital-agency.jpg
│   │   ├── ecommerce.jpg
│   │   ├── saas.jpg
│   │   ├── mobile-app.jpg
│   │   ├── ai-chat.jpg
│   │   └── brand.jpg
│   └── other-images/
├── images-mobile/
│   ├── projects/
│   │   ├── digital-agency.jpg
│   │   ├── ecommerce.jpg
│   │   └── ...
│   └── other-images/
├── videos/
│   ├── hero-bg.webm
│   ├── featured-project-1.webm
│   ├── featured-project-2.webm
│   ├── featured-project-3.webm
│   ├── service-1.webm
│   ├── service-2.webm
│   ├── service-3.webm
│   └── service-4.webm
├── videos-mobile/
│   ├── hero-bg.mp4
│   ├── featured-project-1.mp4
│   ├── featured-project-2.mp4
│   ├── featured-project-3.mp4
│   ├── service-1.mp4
│   ├── service-2.mp4
│   ├── service-3.mp4
│   └── service-4.mp4
├── og-images/
│   ├── default.jpg
│   ├── home.jpg
│   ├── services.jpg
│   ├── work.jpg
│   └── about.jpg
└── favicon.svg
```

## 🎨 Asset Specifications

### Fonts (Required)

Place font files in `public/fonts/`:

**HKGrotesk** (Main font)
- HKGrotesk-ExtraLight.woff2 / .woff (weight: 200)
- HKGrotesk-Light.woff2 / .woff (weight: 300)
- HKGrotesk-Regular.woff2 / .woff (weight: 400)
- HKGrotesk-Medium.woff2 / .woff (weight: 500)
- HKGrotesk-Black.woff2 / .woff (weight: 900)

**Nura** (Display font)
- Nura.ttf (weight: 900)

### Images

#### Project Images (`public/images/projects/`)
- **digital-agency.jpg** - Featured project showcase image
- **ecommerce.jpg** - E-commerce platform image
- **saas.jpg** - SaaS dashboard image
- **mobile-app.jpg** - Mobile app design image
- **ai-chat.jpg** - AI chat platform image
- **brand.jpg** - Brand redesign image

**Specifications:**
- Format: JPG, WebP, or PNG
- Desktop size: 1400x900px (aspect ratio 16:9)
- Mobile size: 800x500px
- Optimize for web (compress)
- Add to both `images/` and `images-mobile/` with appropriate sizes

#### Open Graph Images (`public/og-images/`)
Used for social media previews
- **default.jpg** - 1200x630px
- **home.jpg** - 1200x630px
- **services.jpg** - 1200x630px
- **work.jpg** - 1200x630px
- **about.jpg** - 1200x630px

### Videos

#### Desktop Videos (`public/videos/`)
- **Format:** WebM (.webm)
- **Codec:** VP9 video + Opus audio
- **Resolution:** 1920x1080px or 1280x720px
- **Duration:** 10-30 seconds (looping)
- **File size:** 2-5MB per video
- **Compression:** Use high quality (CRF 15-20)

**Files needed:**
- hero-bg.webm (Hero section background)
- service-1.webm through service-4.webm (Service cards)
- featured-project-1.webm through featured-project-3.webm (Featured work)

#### Mobile Videos (`public/videos-mobile/`)
- **Format:** MP4 (.mp4)
- **Codec:** H.264 video + AAC audio
- **Resolution:** 720x480px or 640x360px
- **File size:** 1-3MB per video
- **Compression:** Balanced quality/size

Same files as desktop but in MP4 format.

### Favicon

`public/favicon.svg` - SVG format, 100x100px minimum

## 🛠️ How to Add Assets

### 1. Fonts
```bash
# Copy font files to public/fonts/
cp path/to/fonts/* public/fonts/
```

Fonts are already configured in `src/styles/global.css` with @font-face rules.

### 2. Images
```bash
# Create directory and add images
mkdir -p public/images/projects
cp project-image.jpg public/images/projects/

# Mobile versions
mkdir -p public/images-mobile/projects
cp project-image-small.jpg public/images-mobile/projects/
```

Reference in components:
```astro
<img 
  src="/images/projects/digital-agency.jpg" 
  alt="Digital Agency Project"
  loading="lazy"
/>
```

### 3. Videos
```bash
# Desktop videos
mkdir -p public/videos
cp hero-bg.webm public/videos/

# Mobile videos
mkdir -p public/videos-mobile
cp hero-bg.mp4 public/videos-mobile/
```

Reference in components:
```astro
<video 
  autoplay 
  muted 
  loop 
  playsinline
>
  <source src="/videos/hero-bg.webm" type="video/webm" />
  <source src="/videos-mobile/hero-bg.mp4" type="video/mp4" />
</video>
```

### 4. Open Graph Images
```bash
mkdir -p public/og-images
cp social-preview.jpg public/og-images/default.jpg
```

Already configured in Layout.astro - will use image meta tag.

## 📝 Video Encoding Examples

### WebM (Desktop)
```bash
ffmpeg -i input.mp4 \
  -c:v libvpx-vp9 \
  -crf 20 \
  -c:a libopus \
  -b:a 128k \
  output.webm
```

### MP4 (Mobile)
```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -crf 23 \
  -preset fast \
  -c:a aac \
  -b:a 96k \
  -s 720x480 \
  output.mp4
```

## ✅ Asset Checklist

### Essential (Must Have)
- [ ] Fonts (HKGrotesk + Nura)
- [ ] Favicon
- [ ] OG images (at least default.jpg)

### Important (Recommended)
- [ ] Project images (6 images)
- [ ] Videos - desktop (webm format)
- [ ] Videos - mobile (mp4 format)

### Optional
- [ ] Mobile-optimized images (separate sizes)
- [ ] Additional hero/background images
- [ ] Team member photos

## 🚀 Without Assets

The site will **still work** without all assets:
- Fallback placeholders will display
- Animations will still function
- All pages will be accessible
- Text content will display properly

This allows you to:
1. Test locally without all assets
2. Deploy with placeholder images
3. Add real assets incrementally

## 📊 File Size Targets

| Asset Type | Target Size | Notes |
|------------|------------|-------|
| WebM video | 2-5 MB | Per 10-30 sec video |
| MP4 video | 1-3 MB | Mobile version |
| JPEG image | 100-300 KB | Optimized for web |
| WebP image | 50-150 KB | Modern format |
| Font files | 20-100 KB | WOFF2 format |

## 🔗 Useful Resources

### Video Encoding
- [Handbrake](https://handbrake.fr/) - GUI video converter
- [FFmpeg](https://ffmpeg.org/) - Command line encoding
- [CloudConvert](https://cloudconvert.com/) - Online converter

### Image Optimization
- [Tinypng](https://tinypng.com/) - Compress PNG/JPEG
- [Squoosh](https://squoosh.app/) - Google's image optimizer
- [ImageOptim](https://imageoptim.com/) - Mac app

### Font Conversion
- [Font Squirrel](https://www.fontsquirrel.com/tools/webfont-generator) - Convert fonts
- [Fontello](https://fontello.com/) - Icon fonts

## 📞 Questions?

Refer to:
- **README.md** - Overview
- **DEVELOPMENT.md** - Detailed guides
- **QUICKSTART.md** - Quick setup

The website is **fully functional without custom assets** - use placeholders during development and add real assets when ready!
