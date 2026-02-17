# How to Migrate the Achieve.ro Menu System

This guide explains how to implement the menu in a new project without "blindly copy-pasting".

## 1. The Ingredients (Dependencies)

You need these libraries installed in your new project:

- **GSAP**: The animation engine.
  ```bash
  npm install gsap
  ```
- **Tailwind CSS**: For styling. Ensure your `tailwind.config.js` has the custom colors (see Style Configurations below).

## 2. File Structure Blueprint

Recreate this structure in your new codebase:

```
src/
├── components/
│   └── Navbar.astro          (The Skeleton: HTML & Layout)
├── scripts/
│   ├── menu-toggle.ts        (The Brain: Logic & State)
│   ├── link-underlines.ts    (The Polish: Hover Animations)
│   └── bubble-button.ts      (The Button: "Let's Work" Morphing)
└── styles/
    └── global.css            (If not using Tailwind for everything)
```

## 3. Step-by-Step Implementation

### Step 1: The Styling Foundation

Add these colors to your `tailwind.config.js`. The menu relies on them.

```javascript
theme: {
  extend: {
    colors: {
      'dark-bg': '#0f0f0f',
      'dark-text': '#0f0f0f',
      'light-text': '#ffffff',
      'main-bg': '#ffffff' // or whatever your white is
    }
  }
}
```

**Note**: The current Achieve.ro project uses slightly different color names (`text-dark`, `text-light`, `dark-bg`, `light-bg`). You can either:
- Use the names suggested above for consistency with the migration guide
- Or adapt the scripts to use your existing color names

### Step 2: The Link Animation (`link-underlines.ts`)

The link underline animation is already extracted in `src/scripts/link-underlines.ts`. To use it:

1. **Copy** `src/scripts/link-underlines.ts` to your new project
2. **Add the required HTML structure** to your links:
   ```html
   <a href="/work" class="animated-nav-link">
     Work
     <span class="underline-animation"></span>
   </a>
   ```
3. **Add CSS** for the underline element:
   ```css
   .animated-nav-link {
     position: relative;
   }
   
   .underline-animation {
     position: absolute;
     bottom: 0;
     left: 0;
     height: 2px;
     background-color: currentColor;
   }
   ```
4. **Initialize** it in your component:
   ```typescript
   import { initLinkUnderlines } from '../scripts/link-underlines';
   initLinkUnderlines();
   ```

### Step 3: The Menu Logic (`menu-toggle.ts`)

The menu toggle logic is extracted in `src/scripts/menu-toggle.ts`. 

**Key Features:**
- Opens/closes menu with slide animation
- Transforms hamburger icon to X
- Handles Escape key to close
- Handles clicking outside to close
- Prevents body scroll when open

**Usage:**

1. **Copy** `src/scripts/menu-toggle.ts` to your new project
2. **Ensure your HTML structure matches:**
   - Menu toggle button with `id="menu-toggle"`
   - Hamburger lines with class `.hamburger-line`
   - Menu overlay with `id="menu-overlay"` and initial `transform: translateY(-100%)`
3. **Initialize** it:
   ```typescript
   import { initMenuToggle } from '../scripts/menu-toggle';
   initMenuToggle();
   ```

**Crucial Change**: If your new site doesn't use `view-transition-handler.ts`, the script works standalone. If you do have view transitions, you may want to integrate the initialization with your view transition handler.

### Step 4: The Bubble Button (`bubble-button.ts`)

The "Let's Work" button morphing effect is extracted in `src/scripts/bubble-button.ts`.

**Usage:**

1. **Copy** `src/scripts/bubble-button.ts` to your new project
2. **Add the required HTML:**
   ```html
   <button id="lets-work-btn" class="work-btn">
     <span>Let's work</span>
   </button>
   ```
3. **Add the CSS** (see `Navbar.astro` for complete styles):
   ```css
   .work-btn {
     position: relative;
     padding: 16px 40px;
     overflow: hidden;
   }
   
   .work-blob {
     position: absolute;
     width: 2px;
     height: 2px;
     background: #ff4500;
     border-radius: 50%;
     border: 1px solid #ff4500;
     transition: border-width 0.45s ease-in-out;
   }
   
   .work-expand {
     border-width: 300px;
     margin-left: -300px;
     margin-top: -300px;
   }
   ```
4. **Initialize** it:
   ```typescript
   import { initBubbleButton } from '../scripts/bubble-button';
   initBubbleButton();
   ```

### Step 5: Connecting it in `Navbar.astro`

In your component, import and initialize the scripts:

```astro
---
// Your HTML here...
---
<script>
  import { initMenuToggle } from '../scripts/menu-toggle';
  import { initLinkUnderlines } from '../scripts/link-underlines';
  import { initBubbleButton } from '../scripts/bubble-button';
  
  // Run on load
  if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      initMenuToggle();
      initLinkUnderlines();
      initBubbleButton();
    });
    
    // Re-initialize on page load (for Astro view transitions)
    document.addEventListener('astro:page-load', () => {
      initMenuToggle();
      initLinkUnderlines();
      initBubbleButton();
    });
  }
</script>
```

## 4. "Gotchas" to Watch Out For

### Z-Index War
The menu uses `z-40` and `z-50` (or `z-9999` in the current implementation). Ensure your other page content is lower z-index so the menu is always on top.

### Font Loading
The "ACHIEVE" big text uses a custom font (Nura). If you don't have this font file, swap it for a standard bold font in Tailwind (e.g., `font-sans font-black`).

### Video
The menu expects a video file at `/videos/menu-promo.webm`. If you don't have one, either:
- Delete that `<div>` from your menu
- Replace the `<video>` tag with an `<img>` placeholder
- Remove the video container entirely if not needed

### Menu-Specific Features
The current `Menu.astro` includes draggable letters and a draggable/resizable video container. These are **optional features** specific to the Achieve.ro menu. If you don't need them, you can:
- Remove the draggable letter functionality
- Remove the video container entirely
- Keep only the core menu toggle, navigation links, and social links

### View Transitions
The scripts are designed to work with Astro view transitions. They re-initialize on `astro:page-load` events. If you're using a different framework or no view transitions, adjust the initialization accordingly.

## 5. Current Implementation Notes

The Achieve.ro menu system has been refactored into modular scripts:

- ✅ **`menu-toggle.ts`**: Core menu open/close logic
- ✅ **`link-underlines.ts`**: Animated link hover effects
- ✅ **`bubble-button.ts`**: Morphing button effect
- ✅ **`Menu.astro`**: Uses `menu-toggle.ts` and contains menu-specific features (draggable letters, video container)
- ✅ **`Navbar.astro`**: Uses `bubble-button.ts` and contains the navbar HTML structure

All scripts are standalone and can be copied to a new project. The only dependencies are:
- GSAP for animations
- Tailwind CSS for styling (or equivalent CSS framework)

## 6. Minimal Implementation Example

For a minimal menu implementation without the extra features:

1. Copy `menu-toggle.ts`
2. Create a simple menu overlay HTML structure
3. Add basic styling for the menu
4. Initialize `initMenuToggle()` on page load

You don't need the link underlines or bubble button if you want a simpler menu.



