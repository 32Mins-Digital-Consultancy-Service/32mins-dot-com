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
- **React Router v7** (`react-router-dom`)
- **Framer Motion** for animations
- **vite-plugin-svgr** — all `.svg` files in `src/assets/` are imported as React components, not URLs

## Architecture

### Routing (`src/main.tsx`)
- `/` → `HomePage` (shell that renders all sections in one scroll page)
- `/about` → `AboutPage`
- `/test` → `TestComponent` (dev scratchpad using Bootstrap, not part of the main site)
- Nested routes (`/solutions`, `/aboutus`, etc.) are defined but sections are rendered inline inside `HomePage`

### Homepage navigation
Menu links use `to="/#section-id"`. `HomePage` reads `hash` from `useLocation()` and calls `scrollIntoView` to smooth-scroll to the matching `<section id="...">`. Section IDs: `solutions`, `aboutus`, `clients`, `whyus`, `ourproject`, `contactus`.

### Styling conventions
- **Main site**: pure Tailwind utility classes. Dark navy background (`#000016` → `#000C30` gradient).
- **`/test` route only**: Bootstrap classes mixed with Tailwind — Bootstrap is not used anywhere else.
- Custom CSS in `index.css`: `--viewport-height` (uses `100dvh` where supported for mobile address bar), `.jaffee-*` brochure flip animation, `.btn-style510/511/902` button shimmer effects, `.typewriter` animation.
- Global font: `Bricolage Grotesque`; `.manrope-font` class for `Manrope`.

### Video card pattern
`ProjectCards.tsx` is the production component; `testComponent.tsx` is the prototype. Both share the same logic:
- Hover (desktop): `onMouseEnter` plays video, `onMouseLeave` stops and resets
- Touch (mobile): `onTouchStart` with `e.preventDefault()` to suppress synthetic mouse events — first tap plays, second tap on same card stops
- A `useRef` tracks the currently playing `<video>` element so switching cards pauses the previous one before playing the new one
- Cover image and video swap via `hidden`/`block` (Tailwind) — no `position: absolute` needed since only one is visible at a time

### Public assets
Static files served from `/public/`: `/Badge.webp`, `/bg-image.webp`, `/Outer_Spread.png`, `/32mins_emp/` (employee portraits).
Asset files referenced in code (e.g. cover images, videos) live in `src/assets/` and are imported with relative paths like `src/assets/nmicps_cover.png`.
