# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server (HMR)
npm run build     # tsc type-check + vite production build
npm run lint      # eslint
npm run preview   # serve the production build locally
```

No test suite exists — this is a marketing/portfolio site.

## Stack

- **React 19** with the **React Compiler** enabled (`babel-plugin-react-compiler`) — do not add manual `useMemo`/`useCallback`; the compiler handles memoization automatically
- **Vite** aliased to `rolldown-vite` (Rolldown-powered build, same API as Vite)
- **Tailwind CSS v4** — uses `@import "tailwindcss"` in `index.css`, not the legacy `@tailwind` directives
- **React Router v7** (`react-router-dom` only — do not add `react-router` as a direct dependency)
- **Framer Motion** for animations
- **Lenis** (`lenis/react`) — site-wide smooth scrolling. `SmoothScroll.tsx` wraps the app; programmatic scrolling must go through `smoothScrollTo()` in `src/lib/scroll.ts` (falls back to native for reduced-motion users). Never call `scrollIntoView` directly.
- **three.js + @react-three/fiber + drei** — used ONLY by the lazy-loaded 3D globe (`Globe3D.tsx`); it ships in its own chunk, don't import three from eagerly-loaded code
- **vite-plugin-svgr** — all `.svg` files in `src/assets/` are imported as React components, not URLs

## Architecture

### Routing (`src/main.tsx`)
- `/` → `HomePage` (shell that renders all sections in one scroll page)
- `/about` → `AboutPage` (lazy-loaded)
- Nested routes (`/solutions`, `/aboutus`, etc.) are defined but sections are rendered inline inside `HomePage`

### Homepage navigation
Menu links use `to="/#section-id"`. `HomePage` reads `hash` from `useLocation()` and smooth-scrolls (via Lenis `smoothScrollTo`) to the matching `<section id="...">`. Section IDs: `solutions`, `aboutus`, `clients`, `whyus`, `ourprojects`, `contactus`.

### Styling conventions
- **Main site**: pure Tailwind utility classes. Dark navy background (`#000016` → `#000C30` gradient).
- **`/test` route only**: Bootstrap classes mixed with Tailwind — Bootstrap is not used anywhere else.
- Custom CSS in `index.css`: `--viewport-height` (uses `100dvh` where supported for mobile address bar), `.jaffee-*` brochure flip animation, `.btn-style510/511` button shimmer effects, `.typewriter` animation. All primary CTAs (including the footer's "Schedule a meet") use `CtaButton` — the old FancyButton morph animation was removed on purpose.
- Global font: `Bricolage Grotesque`; `.manrope-font` class for `Manrope`.

### Project cards
`ProjectCards.tsx` shows static cover images only — the owner removed the hover-to-play video previews (and the old `/test` prototype + `.mp4` assets), do not reintroduce them. The "Take a sneak peek" panel reveals its device mockups via scroll progress (`useScroll` on the panel), not hover.

### 3D & interactive pieces
- `Globe3D.tsx` — photoreal WebGL earth in the Updates section. `/public/textures/earth-day.webp` is NASA Blue Marble (public domain, 4096×2048). Lazy-loaded; the static `/earth2.webp` paints first and crossfades out — that file is a capture of the rendered globe at its initial orientation (regenerate by temporarily setting `preserveDrawingBuffer: true` and saving `canvas.toDataURL()`), so keep them in sync if the initial view changes. Info points are pinned at real lat/long and portal into a marker layer that escapes the earth's alpha mask. The earth and the hero band background dissolve into the page gradient via CSS `mask-image` — never reintroduce a color-matched overlay fade; masks are what keep the section edge seamless. Falls back to the flat image + dot row when WebGL is unavailable or reduced motion is set.
- `Tilt3D.tsx` — generic mouse-follow perspective tilt used on project cards, solutions grid, and testimonials. Inert on touch/reduced-motion.
- The Why-Us hourglass is deliberately a plain image with only a hover zoom — the owner does not want particle/flip effects on it.

### Public assets
Static files served from `/public/`: `/Badge.webp`, `/bg-image.webp`, `/Outer_Spread.webp`, `/32mins_emp/` (employee portraits), `/textures/` (globe maps).
Asset files referenced in code (e.g. cover images, videos) live in `src/assets/` and are imported with relative paths like `src/assets/nmicps_cover.webp`.
All raster assets are WebP sized close to their largest display size — run `node scripts/optimize-images.mjs` to convert new heavy PNG/JPGs (it only writes new files, never deletes). Below-the-fold `<img>`s take `loading="lazy" decoding="async"`; `<video>`s take `preload="none"`.
