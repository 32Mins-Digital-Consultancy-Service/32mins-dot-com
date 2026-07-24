import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { GlobeCard } from "./GlobeCards";
import { cardData, type CardType } from "./globeCardData";

/**
 * Photoreal WebGL earth replacing the old flat rotating image.
 * - slow auto-rotation, horizontal drag-to-spin with inertia
 * - info points pinned to real locations, hidden behind the horizon
 * - opening a card eases the globe so that point faces the viewer
 *
 * Loaded via React.lazy — the static earth2.webp placeholder paints first and
 * crossfades out once the first WebGL frame renders (see Updates.tsx).
 */

const DAY_MAP = "/textures/earth-day.webp";
const CLOUDS_MAP = "/textures/earth-clouds.webp";
const BUMP_MAP = "/textures/earth-bump.webp";

const MARKER_LOCATIONS: Record<
  Exclude<CardType, "">,
  { lat: number; lon: number }
> = {
  card1: { lat: 48.85, lon: 2.35 }, // Paris — UNESCO / SDG4
  card3: { lat: 28.61, lon: 77.21 }, // New Delhi — GeM & Startup India
  card2: { lat: 13.08, lon: 80.27 }, // Chennai — IITM Pravartak
};

// Standard equirectangular lat/lon -> position on a three.js sphere.
function latLonToVec3(lat: number, lon: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

// Yaw that brings the given surface point to face the camera (+z).
function centerYawFor(lat: number, lon: number) {
  const v = latLonToVec3(lat, lon, 1);
  return Math.atan2(-v.x, v.z);
}

const shortestAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

const AXIAL_TILT_X = 0.42; // tip the north hemisphere toward the viewer
const INITIAL_YAW = centerYawFor(15, 55); // Indian Ocean view, like the image

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragment = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(0.22, 0.42, 1.0, 1.0) * intensity;
  }
`;

interface MarkerProps {
  id: Exclude<CardType, "">;
  occluder: React.RefObject<THREE.Mesh | null>;
  activeCard: CardType;
  setActiveCard: (card: CardType) => void;
  /** DOM layer stacked above the section's bottom fade (see Updates.tsx). */
  portal?: React.RefObject<HTMLElement | null>;
}

const Marker = ({
  id,
  occluder,
  activeCard,
  setActiveCard,
  portal,
}: MarkerProps) => {
  const [hidden, setHidden] = useState(false);
  const data = cardData.find((c) => c.id === id)!;
  const position = useMemo(() => {
    const { lat, lon } = MARKER_LOCATIONS[id];
    return latLonToVec3(lat, lon, 1.01);
  }, [id]);

  return (
    <Html
      position={position}
      center
      portal={portal as React.RefObject<HTMLElement> | undefined}
      occlude={[occluder as React.RefObject<THREE.Object3D>]}
      onOcclude={(value) => {
        setHidden(value);
        return null;
      }}
      zIndexRange={[20, 11]}
      style={{
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
        transition: "opacity 0.3s ease",
      }}
    >
      <GlobeCard
        data={data}
        isActive={activeCard === id}
        onToggle={() => setActiveCard(activeCard === id ? "" : id)}
        onClose={() => setActiveCard("")}
      />
    </Html>
  );
};

interface DragState {
  active: boolean;
  lastX: number;
  lastY: number;
  velocity: number;
  dx: number;
  dy: number;
}

interface EarthSceneProps {
  activeCard: CardType;
  setActiveCard: (card: CardType) => void;
  onReady: () => void;
  markerPortal?: React.RefObject<HTMLElement | null>;
  drag: React.RefObject<DragState>;
  /** Section is (or has been) in view — triggers the rise-in entrance. */
  entered: boolean;
}

const ENTRANCE_DROP = 0.55; // world units the globe starts below its seat
const ENTRANCE_SPIN = 1.1; // extra rad/s while it rises

const EarthScene = ({
  activeCard,
  setActiveCard,
  onReady,
  markerPortal,
  drag,
  entered,
}: EarthSceneProps) => {
  const [dayMap, cloudsMap, bumpMap] = useLoader(THREE.TextureLoader, [
    DAY_MAP,
    CLOUDS_MAP,
    BUMP_MAP,
  ]);

  useMemo(() => {
    dayMap.colorSpace = THREE.SRGBColorSpace;
    dayMap.anisotropy = 8;
    cloudsMap.colorSpace = THREE.NoColorSpace;
    bumpMap.colorSpace = THREE.NoColorSpace;
  }, [dayMap, cloudsMap, bumpMap]);

  const group = useRef<THREE.Group>(null);
  const earthMesh = useRef<THREE.Mesh>(null);
  const cloudsMesh = useRef<THREE.Mesh>(null);
  const announcedReady = useRef(false);
  // "pending": pre-warmed off-screen, parked below its seat.
  // "animating": section entered — rise up while spinning fast.
  // "done": seated, normal drift. If the user reaches the section before the
  // first frame (no pre-warm window), skip straight to done to stay aligned
  // with the placeholder image during the crossfade.
  const entrance = useRef({ mode: "pending" as const as string, t: 0 });

  useFrame((_, rawDelta) => {
    const g = group.current;
    const d = drag.current;
    if (!g || !d) return;
    // frameloop pauses while off-screen; clamp the resume-frame delta so the
    // rotation/entrance never jumps.
    const delta = Math.min(rawDelta, 0.1);
    if (!announcedReady.current) {
      announcedReady.current = true;
      if (entered) entrance.current.mode = "done";
      onReady();
    }

    // Entrance: come up spinning, then settle.
    const ent = entrance.current;
    let extraSpin = 0;
    if (ent.mode === "pending") {
      g.position.y = -ENTRANCE_DROP;
      if (entered) ent.mode = "animating";
    } else if (ent.mode === "animating") {
      ent.t = Math.min(1, ent.t + delta / 1.6);
      const eased = 1 - (1 - ent.t) ** 3;
      g.position.y = -ENTRANCE_DROP * (1 - eased);
      extraSpin = ENTRANCE_SPIN * (1 - eased);
      if (ent.t >= 1) ent.mode = "done";
    } else {
      g.position.y = 0;
    }

    // Apply pointer deltas accumulated by the DOM wrapper since last frame:
    // horizontal drag spins, vertical drag pitches within a comfortable band.
    if (d.dx || d.dy) {
      g.rotation.y += d.dx * 0.005;
      g.rotation.x = THREE.MathUtils.clamp(
        g.rotation.x + d.dy * 0.003,
        -0.25,
        0.65,
      );
      d.dx = 0;
      d.dy = 0;
    }

    const ease = Math.min(1, delta * 3);
    if (!d.active) {
      if (activeCard) {
        // Ease the open card's point toward the viewer, then hold. The
        // marker's screen height follows sin(lat - pitch), so pitching
        // toward (lat - 22deg) parks every marker at the same comfortable
        // height above the viewport's bottom edge.
        const { lat, lon } = MARKER_LOCATIONS[activeCard];
        const targetYaw = centerYawFor(lat, lon);
        const targetPitch = THREE.MathUtils.degToRad(
          THREE.MathUtils.clamp(lat - 22, -12, 32),
        );
        g.rotation.y += shortestAngle(targetYaw - g.rotation.y) * ease;
        g.rotation.x += (targetPitch - g.rotation.x) * ease;
        d.velocity = 0;
      } else {
        // Keep spinning gently from wherever the user left the globe — the
        // dragged pitch is intentionally NOT reset.
        d.velocity *= Math.max(0, 1 - delta * 2.5);
        g.rotation.y += delta * (0.05 + extraSpin) + d.velocity;
      }
    }
    if (cloudsMesh.current) cloudsMesh.current.rotation.y += delta * 0.012;
  });

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[-3, 2, 2.5]} intensity={2.2} />
      <group rotation={[AXIAL_TILT_X, INITIAL_YAW, 0]} ref={group}>
        <mesh ref={earthMesh}>
          <sphereGeometry args={[1, 96, 96]} />
          <meshPhongMaterial
            map={dayMap}
            bumpMap={bumpMap}
            bumpScale={4}
            specular={new THREE.Color("#243c66")}
            shininess={6}
          />
        </mesh>
        {/* Additive clouds: black areas add nothing, so the grayscale map
            needs no alpha channel and can't darken the earth beneath. */}
        <mesh ref={cloudsMesh}>
          <sphereGeometry args={[1.008, 64, 64]} />
          <meshBasicMaterial
            map={cloudsMap}
            blending={THREE.AdditiveBlending}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
        {(Object.keys(MARKER_LOCATIONS) as Exclude<CardType, "">[]).map(
          (id) => (
            <Marker
              key={id}
              id={id}
              occluder={earthMesh}
              activeCard={activeCard}
              setActiveCard={setActiveCard}
              portal={markerPortal}
            />
          ),
        )}
        {/* Fresnel atmosphere halo — inside the group so it rises with the
            earth during the entrance */}
        <mesh scale={1.15}>
          <sphereGeometry args={[1, 64, 64]} />
          <shaderMaterial
            vertexShader={atmosphereVertex}
            fragmentShader={atmosphereFragment}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            transparent
            depthWrite={false}
          />
        </mesh>
      </group>
    </>
  );
};

interface Globe3DProps {
  activeCard: CardType;
  setActiveCard: (card: CardType) => void;
  onReady: () => void;
  active: boolean;
  markerPortal?: React.RefObject<HTMLElement | null>;
  entered: boolean;
}

const Globe3D = ({
  activeCard,
  setActiveCard,
  onReady,
  active,
  markerPortal,
  entered,
}: Globe3DProps) => {
  // Drag is handled on this DOM wrapper (not the sphere mesh) so grabbing
  // anywhere over the globe — sky, atmosphere, earth — spins it. touch-action
  // pan-y keeps vertical touch scrolling native.
  const drag = useRef<DragState>({
    active: false,
    lastX: 0,
    lastY: 0,
    velocity: 0,
    dx: 0,
    dy: 0,
  });

  const endDrag = () => {
    drag.current.active = false;
  };

  return (
    <div
      className="h-full w-full cursor-grab active:cursor-grabbing"
      style={{ touchAction: "pan-y" }}
      onPointerDown={(e) => {
        const d = drag.current;
        d.active = true;
        d.lastX = e.clientX;
        d.lastY = e.clientY;
        d.velocity = 0;
        e.currentTarget.setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d.active) return;
        const dx = e.clientX - d.lastX;
        const dy = e.clientY - d.lastY;
        d.dx += dx;
        d.dy += dy;
        d.velocity = dx * 0.002;
        d.lastX = e.clientX;
        d.lastY = e.clientY;
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 3], fov: 45 }}
      >
        <Suspense fallback={null}>
          <EarthScene
            activeCard={activeCard}
            setActiveCard={setActiveCard}
            onReady={onReady}
            markerPortal={markerPortal}
            drag={drag}
            entered={entered}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Globe3D;
