# Animation Ideas for `page.tsx` (HomePage)

A comprehensive list of animation ideas for every section of the homepage, organized by section. All ideas leverage **framer-motion** (already installed) and CSS.

---

## 1. Hero Section (`UpdatesPage`)

### Text Animations

- **Staggered word reveal**: Each word of "Meaningful Knowledge Impactful Digital Content" fades/slides up one by one with a stagger delay (e.g., 0.1s per word).
- **Typewriter effect**: Characters appear one at a time from left to right, simulating typing.
- **Split-line slide-in**: "Meaningful Knowledge" slides in from the left, "Impactful Digital Content" slides in from the right, meeting in the center.
- **Blur-to-sharp reveal**: Text starts fully blurred (`filter: blur(20px)`) and animates to sharp (`blur(0)`) over 1.5s.
- **Scale bounce-in**: Text starts at `scale(0.8)` with `opacity: 0` and springs to `scale(1)` with `opacity: 1` using a spring physics animation.
- **Vertical letter cascade**: Each letter drops in from above with slight randomized delays, like falling rain.
- **Glitch/scramble effect**: Random characters cycle through before settling on the correct letters (like a cipher decoding).

### "CONVERTING" / "FOR EVERYONE" Labels

- **Tracking expansion**: Start with `letter-spacing: 0` and animate to the full `0.32em` tracking.
- **Fade-slide from above/below**: "CONVERTING" slides down from above while "FOR EVERYONE" slides up from below, framing the main heading.
- **Opacity pulse**: Subtle pulse animation on the labels after they appear (opacity oscillates between 0.6 and 1).

### CTA Buttons

- **Staggered pop-in**: Buttons scale from 0 to 1 with a spring animation, secondary button first, then primary 0.2s later.
- **Slide-up with fade**: Buttons translate from `y: 30px, opacity: 0` to `y: 0, opacity: 1`.
- **Magnetic hover**: On hover, button subtly follows cursor position within a small radius (framer-motion `useMotionValue` + `useTransform`).
- **Shine sweep on hover**: A light gradient sweeps across the button surface on hover (CSS pseudo-element animation).
- **Border glow pulse**: Primary button has a pulsing glow/shadow animation on idle to draw attention.

### Down Arrows

- **Continuous bounce**: Arrows gently bounce up and down in an infinite loop (`y: [0, 10, 0]`).
- **Sequential fade pulse**: First arrow fades, then second arrow fades, creating a "scroll down" visual rhythm.
- **Scale breathe**: Arrows slowly scale between 0.9 and 1.1 in an infinite loop.

---

## 2. Earth Image Section

### Earth Image

- **Parallax scroll**: Earth image moves at a different speed than the content as user scrolls (use `useScroll` + `useTransform` from framer-motion).
- **Slow rotation**: Earth continuously rotates very slowly (`rotate: 360deg` over 60s, infinite loop) in addition to the existing 90deg rotation.
- **Scale-on-scroll**: Earth starts smaller and scales up as user scrolls toward it, creating a "approaching the planet" feel.
- **Luminosity pulse**: Subtle brightness/opacity oscillation to simulate atmospheric glow.
- **Reveal on scroll**: Earth starts below the viewport and rises into view as user scrolls (scroll-triggered `translateY`).

### Bottom Gradient Overlay

- **Fade-in on scroll**: The gradient overlay fades from `opacity: 0` to `opacity: 1` as user scrolls past the earth.
- **Height animation**: Gradient height animates from 0 to its full height as the section enters the viewport.

---

## 3. Summary Section (Stats Bar)

### Stat Numbers

- **Count-up animation**: Numbers animate from 0 to their final value (e.g., 0 -> 1200+) when the section enters the viewport. Use `useInView` + `animate` from framer-motion.
- **Odometer/flip counter**: Digits flip like an old airport departure board, each digit rolling independently.
- **Scale pop**: Each stat number pops in with `scale(1.2)` then settles to `scale(1)` with stagger delays.

### Stat Blocks

- **Staggered slide-in**: Each stat block slides up from below with stagger delay (0.15s apart).
- **Horizontal reveal**: Stats slide in from left to right sequentially, like cards being dealt.
- **Border/divider animation**: The separators between stats draw in (width from 0 to full) after the numbers appear.

### Overall Bar

- **Glass morphism entrance**: The blurred backdrop bar fades in and slides up from below the content.
- **Width expansion**: Bar starts narrow (centered) and expands to full width when scrolled into view.

---

## 4. Solutions Section (`SolutionsPage`)

### Section Header

- **Badge slide-in**: "Our Services" badge slides in from the left with a slight rotation, then straightens.
- **Heading underline draw**: An underline/accent line draws itself under the heading from left to right.
- **Text reveal mask**: Heading text is revealed by a colored block that slides across (wipe reveal).

### Service Cards Grid

- **Staggered card entrance**: Cards fade in and slide up one by one with 0.1s stagger using `staggerChildren` in framer-motion.
- **Flip-in cards**: Each card does a 3D flip from back to front (`rotateY: 180 -> 0`) as it enters viewport.
- **Scale-from-center**: All cards start at `scale(0)` in the center and animate to their grid positions.
- **Hover lift + shadow**: On hover, individual cards lift (`translateY: -8px`) with an expanding shadow.
- **Card border glow**: On hover, a subtle gradient border appears around the card (using `background` on a wrapper with padding).
- **Icon animation**: Service icons within cards animate on hover (e.g., rotate, bounce, or color shift).

### Vertical Carousel (existing)

- **Enhanced transitions**: Add spring physics to carousel transitions instead of linear easing for more natural feel.
- **Depth effect**: Items entering/exiting have slight `scale` and `blur` changes to simulate depth.

---

## 5. About Us Section (`AboutUsPage`)

### Two-Column Layout

- **Left content slide-in**: Text content slides in from the left (`x: -80 -> 0`) when scrolled into view.
- **Right images slide-in**: Images slide in from the right (`x: 80 -> 0`) with a slight delay.
- **Intersection observer trigger**: Both columns animate only when the section is 30%+ in viewport.

### Images

- **Staggered image reveal**: First image slides in, then second image slides in 0.3s later (they already have offset positioning).
- **Clip-path reveal**: Images are revealed via a `clip-path` animation (e.g., `inset(100% 0 0 0)` -> `inset(0)`), like a curtain opening.
- **Hover zoom**: On hover, images scale slightly (`scale(1.05)`) with `overflow: hidden` on container.
- **Parallax offset**: Images move at slightly different scroll speeds from each other, enhancing the staggered layout.
- **Image tilt on hover**: Subtle 3D tilt effect using `perspective` and `rotateX`/`rotateY` based on mouse position.

### Quote Block

- **Fade-in with blur**: Quote fades in from blurred to sharp when scrolled into view.
- **Quotation mark animation**: The large quotation marks scale from 0 to their full size with a spring animation.
- **Text line-by-line reveal**: Each line of the quote appears sequentially from top to bottom.
- **Background gradient animation**: The gradient behind the quote slowly shifts/moves for a living feel.

---

## 6. Clients Section (`ClientsPage`)

### Marquee (existing)

- **Pause on hover**: Marquee pauses when user hovers over it, allowing them to read logos/names.
- **Speed variation**: Marquee slightly speeds up and slows down in a sine wave pattern for organic feel.
- **Fade edges**: Items at the left/right edges of the marquee fade to transparent (CSS mask-image).

### Testimonial Cards

- **Card flip**: Cards flip from back (showing client logo) to front (showing testimonial) on scroll.
- **Slide-in from sides**: Left card slides in from left, right card from right, meeting in the center.
- **Hover quote highlight**: On hover, the quotation text gets a subtle background highlight animation.
- **Testimonial auto-rotate**: If there are more testimonials than shown, auto-rotate them with a crossfade every 5s.
- **Avatar/name entrance**: Client name and title slide in from below after the quote text appears.

### Section Header

- **Badge counter**: "Our Clients" badge includes a small animated counter showing the number.
- **Subheading letter spacing animation**: "Helping businesses grow" animates letter-spacing from tight to normal.

---

## 7. Why Us Section (`WhyUsPage`)

### Text Content

- **Bullet point cascade**: Each differentiator point appears one by one with a check mark animation.
- **Highlight keyword animation**: Key words in the paragraph briefly highlight with a colored background that fades.
- **CTA button attention pulse**: "Get in touch" button has a periodic ring/ripple animation radiating outward.

### Hourglass Illustration

- **Sand flow animation**: Animate the hourglass to appear as if sand is flowing (CSS animation on the SVG or a layered approach).
- **Gentle float**: Hourglass gently floats up and down in an infinite loop (`y: [-5, 5]`).
- **Rotation on scroll**: Hourglass slowly rotates as user scrolls through the section (scroll-linked).
- **3D perspective tilt**: Hourglass has a subtle 3D tilt that follows scroll position.

### Gradient Rectangle

- **Color shift**: The blue gradient slowly shifts hue/position over time for a living, breathing feel.
- **Expand on scroll**: Rectangle scales from 0 to full size as the section enters viewport.
- **Glow pulse**: Rectangle emits a soft pulsing glow (box-shadow animation).

---

## 8. Contact Us Section (`ContactUsPage`)

### Background "Reach Us" Text

- **Slow horizontal scroll**: The large "Reach Us" text slowly drifts horizontally in an infinite loop.
- **Opacity breathe**: Text opacity oscillates between 0.03 and 0.08 for a subtle living effect.
- **Parallax on scroll**: "Reach Us" moves at a different scroll speed than foreground content.

### Card Entrance

- **Scale-in with blur**: Entire card scales from 0.9 to 1.0 and unblurs when scrolled into view.
- **3D tilt entrance**: Card rotates slightly in 3D (`perspective + rotateX`) and flattens as it enters viewport.
- **Border draw**: Card border traces itself around the card (animated `border` using SVG `stroke-dashoffset`).

### Email Input

- **Focus expand**: Input field width expands and gets a glowing border when focused.
- **Placeholder typing**: Placeholder text types itself out character by character.
- **Submit button animation**: Arrow icon slides right on hover/click, then resets.
- **Success confetti**: On email submit, small confetti or sparkle burst animation.

### Gradient Background

- **Animated gradient**: The blue gradient background slowly shifts angle or position over time (`background-position` animation).
- **Mesh gradient**: Replace linear gradient with an animated mesh/blob gradient for a modern look.

---

## 9. Menu / Navigation

### Scroll-Based Transitions (existing, can enhance)

- **Backdrop blur ramp**: Blur intensity increases smoothly with scroll distance (not binary on/off).
- **Logo shrink**: Logo/badge scales down slightly as user scrolls past the hero.
- **Active link indicator**: A small animated underline slides to the active section link as user scrolls.
- **Progress bar**: Thin progress bar at the top of the nav showing overall page scroll progress.

### Mobile Menu

- **Staggered menu items**: Menu links slide in one by one from the right with stagger delay when menu opens.
- **Overlay fade**: Background overlay fades in with a blur effect when mobile menu opens.
- **Close animation**: Menu items slide out in reverse order before the panel closes.

---

## 10. Footer

### Content

- **Staggered column reveal**: Each footer column fades in and slides up with stagger delay on scroll.
- **Social icon bounce**: Social icons bounce in one by one with spring physics.
- **Hover ripple on social icons**: On hover, a ripple effect emanates from the icon center.
- **"Request a Proposal" spotlight**: A subtle spotlight/glow animation draws attention to the proposal CTA.

### Bottom Bar

- **Line draw**: The separator line between footer content and copyright draws itself from center outward.
- **Copyright year flip**: The year number does a flip/counter animation when it enters view.

---

## 11. Global / Page-Wide Animations

### Scroll-Triggered Reveals

- **Universal scroll reveal**: Apply a reusable `<ScrollReveal>` wrapper component that uses `useInView` from framer-motion. Wraps any section for consistent fade-up-on-scroll behavior.
- **Stagger by section**: Each major section staggers its children's entrance animations when scrolled into view.

### Page Load Sequence

- **Orchestrated entrance**: On first load, animate elements in sequence: Menu slides down -> Hero text reveals -> CTA buttons pop in -> Down arrows start bouncing. Use framer-motion's `AnimatePresence` + `staggerChildren`.
- **Loading screen transition**: Brief branded loading screen that wipes/dissolves to reveal the page.
- **Curtain reveal**: Two halves of the screen slide apart (left and right) to reveal the hero section.

### Smooth Scroll

- **Locomotive-style smooth scroll**: Implement smooth/inertia scrolling for the entire page (consider `lenis` library).
- **Scroll snapping**: Add optional CSS `scroll-snap` to snap between major sections.

### Cursor Effects

- **Custom cursor**: Replace default cursor with a custom animated dot/circle that scales on hover over interactive elements.
- **Cursor trail**: Subtle trail/glow that follows the cursor across the page.
- **Magnetic elements**: Buttons and links slightly pull toward the cursor when it's nearby.

### Parallax Layers

- **Multi-layer parallax**: Background, midground (earth image), and foreground (text) all scroll at different speeds throughout the page.
- **Floating elements**: Small decorative dots, stars, or particles float slowly in the background across all sections.

### Transition Between Sections

- **Color bleed**: Background color transitions smoothly between sections rather than having hard boundaries.
- **Section divider animations**: Animated SVG wave or curve dividers between sections instead of hard lines.
- **Scroll-linked progress dots**: Fixed side navigation dots that fill/glow as the user scrolls through sections.

---

## Priority Recommendations

If implementing in phases, here is a suggested priority order:

| Priority | Animation                                       | Impact | Effort |
| -------- | ----------------------------------------------- | ------ | ------ |
| 1        | Scroll-triggered fade-in reveals (all sections) | High   | Low    |
| 2        | Count-up numbers on Summary stats               | High   | Low    |
| 3        | Staggered card entrance on Solutions grid       | High   | Medium |
| 4        | Page load orchestrated sequence (hero)          | High   | Medium |
| 5        | Parallax on Earth image                         | Medium | Low    |
| 6        | About Us two-column slide-in                    | Medium | Medium |
| 7        | Testimonial card entrance animations            | Medium | Low    |
| 8        | CTA button hover effects (shine, magnetic)      | Medium | Medium |
| 9        | Menu active section indicator                   | Medium | Medium |
| 10       | Contact Us card entrance + input animations     | Low    | Medium |
| 11       | Footer staggered reveal                         | Low    | Low    |
| 12       | Custom cursor + floating particles              | Low    | High   |

---

_All animations should respect `prefers-reduced-motion` media query for accessibility. Wrap animations in a check or use framer-motion's `reducedMotion` prop._
