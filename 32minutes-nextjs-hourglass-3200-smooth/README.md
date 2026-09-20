# 32 Minutes — fine-grain 3D hourglass

Copy `components/Hourglass32.tsx`, `components/Hourglass32.module.css`, and `components/hourglass/` into your Next.js project. Copy `public/hourglass/hourglass.glb` into your project's `public/hourglass/` directory. Replace the earlier component and its helper modules together.

Install the renderer in your website project:

```bash
npm install three@0.180.0
```

```tsx
import Hourglass32 from '@/components/Hourglass32';

export default function WhyUs() {
  return <div style={{ height: 520, maxWidth: 640 }}>
    <Hourglass32 durationSeconds={32} showControls={false} />
  </div>;
}
```

Omit `showControls={false}` to display timer and interaction controls. The illustration still responds to dragging when its controls are hidden. The parent controls width; illustration mode has a 440px minimum height. The stage is transparent. Set `--hourglass-background` on a parent if a solid stage color is wanted. The optional controls use a dark backing for legibility.

## Updated interaction

- **3,200 small 3D spheres**, drawn in one instanced mesh, replace the numerals. Their diameter is 30% larger than the preceding 9,600-grain revision. Each has one spherical collision proxy.
- Bronze inputs become brighter metallic gold in the receiving chamber. Lighting and highlights respond to the camera and the model.
- Drag horizontally to roll around Z; drag vertically to tilt around X, into/out of the screen. Shift-drag vertically lifts the model. Arrow keys rotate; Shift plus up/down lifts. Orbit view changes only the camera.
- The initial perspective includes depth and yaw. The 2.2-second automatic flip adds a gentle yaw sweep. The view widens for narrow containers to keep rotations framed.
- Gravity uses the full 3D orientation. The old 47-degree timer cutoff is removed. The release timer advances whenever the receiving side slopes downward (more than roughly 5 degrees below horizontal). A truly horizontal vessel can naturally retain grains on its wall. Tilt the neck down to finish draining; the model does not force grains uphill.
- The outlet reserves individual grains before crossing to stagger release. Physics advances at 120 small steps per second, with a compact collision grid. Contact response dissipates upward rebound and sideways chatter. A short visual interpolation smooths remaining simulation jitter.

## Timing and repeating

The default 32-second mode starts automatically. The timer meters particle release; longer durations reduce the release rate without changing the glass geometry. It pauses during the flip, in a hidden tab, or when the receiving side is not downhill. Pause freezes motion.

At zero, simulation continues until **every particle is below the neck and moving slowly for 0.75 seconds**. Only then does the automatic 2.2-second turn start. No timeout forces a flip with grains remaining upstream. The full loop therefore lasts longer than 32 seconds, especially after manual tilting. A stable inversion swaps chamber roles and begins the next cycle.

Longer focus durations stop after all particles settle. Use `durationSeconds={1920}` for 32 minutes (minimum 32 seconds). `onComplete` fires after settling and must be passed from a client component. `assetUrl` supports a custom public path or CDN URL.

## Delivery and validation

The GLB is approximately 1.9 MB. Three.js is installed once through npm. No server APIs, credentials, external fonts, or textures are required. The component imports WebGL code after mounting and disposes its renderer and animation frame on unmount. Modern WebGL2 is required; performance depends on the device.

This is a stylized granular simulation, not engineering-grade material physics. Glass is a neutral transparent overlay, not refraction of the surrounding webpage. The Blender asset remains the frame/glass reference; grains are generated in the browser.

The standalone browser preview and local simulation tests are checked. A production Next.js build has not been verified in the destination website. The package updates local integration files only; it does not deploy changes to 32mins.com.
