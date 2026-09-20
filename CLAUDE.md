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
- Custom CSS in `index.css`: `--viewport-height` (uses `100dvh` where supported for mobile address bar), `.jaffee-*` brochure flip animation, `.btn-style510/511/902` button shimmer effects, `.typewriter` animation.
- Global font: `Bricolage Grotesque`; `.manrope-font` class for `Manrope`.

### Services grid
`src/components/grid.tsx` renders the Services section as four pillar cards, one per competency from the owner's 2030 vision document: title, one short description, and the document's sub-service names as `SubpageHeader variant="small"` tag pills (the same pills the project cards use). Copy lives in `src/components/servicesData.ts`: `PILLARS` (title, description, chips, indices into `SERVICES`) and `SERVICES` (the nine individual services with a one-line lead + one supporting sentence; not rendered as cards any more but still the source of the homepage JSON-LD `offers` in `src/pages/home/page.tsx`). `knowsAbout` in `index.html` is updated by hand. The owner chose this over a pill switcher, a bento, and a glass list (Sept 2026), and earlier rejected a rotating carousel, the "Media Content Marketing" card, illustrations, and a scroll-driven "tree" — do not reintroduce them. The section must use only existing surfaces (section pill, `#06041A` card, Tilt3D, SpotlightCard, fade-up easing).

### Layout measure
Every homepage section, the contact band and the footer share one content measure: the `site-container` utility in `index.css` (76rem max, centred, `clamp(1.25rem,4vw,2.5rem)` side padding). Section roots use it; nothing inside a section sets its own `max-w-*`/`px-*` for the outer edges, so all edges line up down the page (the owner asked for this, Sept 2026). Full-bleed pieces (hero band, globe) sit outside it.

### Project cards
`ProjectCards.tsx` shows static cover images only — the owner removed the hover-to-play video previews (and the old `/test` prototype + `.mp4` assets), do not reintroduce them. Every cover is a sharp 720×496 capture of the project's live homepage cropped below its own header (`src/assets/*_cover.webp`) with the project's logo as a separate asset (`src/assets/logo_*.webp`); the card blurs and tints the capture in CSS at rest (`Cover`, `tone` light/dark picks the tint) and on hover clears the blur/tint and fades the logo so the site shows. A project with exactly two links (SWAYAM Plus: Website + LMS) renders `SplitCover`: two captures clipped to their zones with `clip-path`, zones widen on hover/focus. Cards link to the live sites (`links[]`). Tags describe the organisation's service (e.g. "Platform Build", "Video Production"), never portfolio/skill words like "Full-Stack". Order: SWAYAM Plus, ChitraVaani, Smart Sutra, then the rest; one column on phones, two from `sm`, three at `lg` (six tracks, `col-span-2`) with a short last row centred via `col-start`. The "Take a sneak peek" panel spans every column and reveals its device mockups via scroll progress (`useScroll` on the panel), not hover.

### 3D & interactive pieces
- `Globe3D.tsx` — photoreal WebGL earth in the Updates section. `/public/textures/earth-day.webp` is NASA Blue Marble (public domain, 4096×2048). Lazy-loaded and pre-warmed on idle; it is the only earth on capable devices (the owner does not want the flat image shown first). `/earth2.webp` is a fallback that appears only when WebGL is unavailable, reduced motion is set, the globe throws, or no frame arrives within `GLOBE_TIMEOUT_MS` of the section being in view; it is a capture of the rendered globe at its initial orientation (regenerate by temporarily setting `preserveDrawingBuffer: true` and saving `canvas.toDataURL()`). Info points are pinned at real lat/long and portal into a marker layer that escapes the earth's alpha mask. The earth and the hero band background dissolve into the page gradient via CSS `mask-image` — never reintroduce a color-matched overlay fade; masks are what keep the section edge seamless. Falls back to the flat image + dot row when WebGL is unavailable or reduced motion is set.
- `Tilt3D.tsx` — generic mouse-follow perspective tilt used on project cards, solutions grid, and testimonials. Inert on touch/reduced-motion.
- `Hourglass3D.tsx` — the Why-Us hourglass. `/public/hourglass/hourglass.glb` (meshopt-compressed, decoded with `three/addons/libs/meshopt_decoder`; the Sand_* meshes were stripped from it) is the vessel; the sand is a live position-based granular simulation of 3,200 small metallic spheres in one instanced draw (`src/components/hourglass/`: `HourglassView.ts` owns renderer/scene/lights/shadow floor/interaction, `physics.ts` the grains with a metered outlet at 120 steps/s, `sandVisual.ts` the instanced spheres with bronze→gold refinement, `transformation.ts` the chamber-role state machine, `sand.ts` the vessel wall profile that must match the GLB). This is the owner's Sept 2026 "3200-smooth" engine, ported from their Next.js drop-in (`32minutes-nextjs-hourglass-3200-smooth/`, untracked); keep its behaviour: gravity follows the full 3D orientation, the release timer only advances while the receiving side is downhill (`canFlow`), the flip (2.2 s with a yaw sweep) starts only after every grain is through and still for 0.75 s (`readyToFlip`; the wrapper adds a 45 s safety for a wedged grain), and a stable inversion swaps roles. Drag sideways to roll, vertically to pitch in depth, shift-drag to lift (grains get a kick); arrow keys mirror this; the vessel stays where it is released (no snap-back). Camera starts at (3.3, 1.9, 8.6) with fov 34° widened for narrow boxes; OrbitControls exist but are disabled (object mode). Lazy-loaded when the section approaches and fades in on its first frame; there is no static stand-in. Without WebGL2, with reduced motion, on failure, or below `lg`, the section is plain stacked copy with no visual. Physics only steps while the section is in view. Layout: the vessel is centered in the section with the copy split into two columns around it. The copy is laid out line by line with **pretext** (`@chenglou/pretext`, `prepareWithSegments` + `layoutNextLineRange`): `HourglassView.onOutline` projects the frame's bounding cylinder through the camera and convex-hulls it, `src/lib/hourglassSilhouette.ts` provides the analytic upright hull until the first frame plus `outlineExtent()`, and `WhyUs.tsx` gives every line only the width the hull leaves free at that height (`intrusion()`), so the text reflows as the hourglass tilts or lifts; the Get in touch button is inset the same way. Font and line height are read from the column's computed style and re-measured after `document.fonts.ready` (pretext's cache is cleared). The owner asked for pretext over the earlier CSS `shape-outside` floats (Sept 2026) — do not go back to floats. No card, no text overlay (the owner rejected both). The 3D vessel mounts only at `lg` and up (`useIsDesktop`). The left column sits a little above the neck and the right column starts lower (`LEFT_RISE` / `RIGHT_STAGGER`).

### Public assets
Static files served from `/public/`: `/Badge.webp`, `/bg-image.webp`, `/Outer_Spread.webp`, `/32mins_emp/` (employee portraits), `/textures/` (globe maps), `/hourglass/hourglass.glb` (Why-Us vessel model; the Blender source lives outside this repo).
Asset files referenced in code (e.g. cover images, videos) live in `src/assets/` and are imported with relative paths like `src/assets/nmicps_cover.webp`.
All raster assets are WebP sized close to their largest display size — run `node scripts/optimize-images.mjs` to convert new heavy PNG/JPGs (it only writes new files, never deletes). Below-the-fold `<img>`s take `loading="lazy" decoding="async"`; `<video>`s take `preload="none"`.
