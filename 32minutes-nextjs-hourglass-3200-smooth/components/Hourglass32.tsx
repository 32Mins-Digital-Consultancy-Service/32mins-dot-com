'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Hourglass32.module.css';
import type { HourglassView } from './hourglass/hourglass.js';

type Props = {
  /** Active flow duration; minimum 32 seconds. */
  durationSeconds?: number;
  assetUrl?: string;
  className?: string;
  /** Hide the panel when embedding as a website illustration. */
  showControls?: boolean;
  onComplete?: () => void;
};

export default function Hourglass32({ durationSeconds = 32, assetUrl = '/hourglass/hourglass.glb', className = '', showControls = true, onComplete }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<HourglassView | null>(null);
  const session = useRef({ elapsed: 0, running: false, completed: false });
  const completeCallback = useRef(onComplete);
  completeCallback.current = onComplete;
  const [duration, setDuration] = useState(Math.max(32, durationSeconds));
  const [state, setState] = useState({ running: false, remaining: Math.max(32, durationSeconds), cycle: 1, upright: true });
  const [mode, setMode] = useState<'object' | 'orbit'>('object');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const durationRef = useRef(duration);
  durationRef.current = duration;
  useEffect(() => { setDuration(Number.isFinite(durationSeconds) ? Math.max(32, durationSeconds) : 32); }, [durationSeconds]);
  useEffect(() => { session.current = { elapsed: 0, running: false, completed: false }; view.current?.setProgress(0, false); view.current?.resetSand(); setState(s => ({ ...s, running: false, remaining: duration, cycle: 1 })); }, [duration]);

  useEffect(() => {
    let disposed = false, frame = 0, previous = 0, lastUI = 0;
    // Import only on the client; no WebGL or document access during server rendering.
    import('./hourglass/hourglass.js').then(async ({ HourglassView }) => {
      if (disposed || !host.current) return;
      const instance = new HourglassView(host.current, { assetURL: assetUrl });
      view.current = instance;
      instance.onCycle = () => { session.current.elapsed = 0; session.current.completed = false; };
      await instance.ready;
      if (disposed) return;
      setReady(true);
      if (durationRef.current === 32) session.current.running = true;
      function animate(now: number) {
        if (disposed) return;
        const delta = previous ? Math.min((now - previous) / 1000, .05) : 0;
        previous = now;
        const s = session.current, duration = durationRef.current;
        if (s.running && instance.canFlow && !document.hidden) s.elapsed = Math.min(duration, s.elapsed + delta);
        const progress = s.elapsed / duration;
        instance.setProgress(progress, s.running);
        instance.render(document.hidden ? 0 : delta);
        if (s.elapsed >= duration && !s.completed && s.running && instance.readyToFlip) { s.completed = true; completeCallback.current?.(); if (duration === 32) { instance.flip(); } else { s.running = false; } }
        if (now - lastUI > 100) {
          setState({ running: s.running, remaining: Math.max(0, Math.ceil(duration - s.elapsed)), cycle: instance.roles.cycle, upright: instance.canFlow });
          lastUI = now;
        }
        frame = requestAnimationFrame(animate);
      }
      frame = requestAnimationFrame(animate);
    }).catch(() => { if (!disposed) { setError('The 3D view requires WebGL2. Please try another browser.'); view.current?.dispose(); view.current = null; } });
    return () => { disposed = true; cancelAnimationFrame(frame); view.current?.dispose(); view.current = null; };
  }, [assetUrl]);

  const reset = () => { session.current = { elapsed: 0, running: false, completed: false }; view.current?.setProgress(0, false); view.current?.resetSand(); };
  const toggle = () => { if (session.current.completed) reset(); session.current.running = !session.current.running; };
  const flip = () => { session.current = { elapsed: 0, running: true, completed: false }; view.current?.flip(); };
  const changeMode = (value: 'object' | 'orbit') => { setMode(value); view.current?.setMode(value); };
  const clock = `${String(Math.floor(state.remaining / 60)).padStart(2, '0')}:${String(state.remaining % 60).padStart(2, '0')}`;

  return <section className={`${styles.root} ${!showControls ? styles.illustration : ''} ${className}`} aria-label="32 Minutes interactive hourglass">
    <div ref={host} className={styles.scene} tabIndex={0} role="group" aria-label="Drag sideways to roll and vertically to tilt in depth. Shift-drag lifts. Arrow keys rotate; Shift plus up or down lifts." />
    {showControls && <div className={styles.top}><span>32 MINUTES</span><span>Cycle {state.cycle}</span></div>}
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {showControls && <div className={styles.controls}>
      <div className={styles.legend}>IDEAS &amp; COMPLEXITY <span>→</span> REFINED DIGITAL IMPACT</div>
      <div className={styles.row}><span role="timer" aria-label="Time remaining" className={styles.clock}>{clock}</span><span className={styles.status}>{!ready ? 'Preparing hourglass…' : state.running && !state.upright ? 'Tilt the neck downward to continue' : state.running ? state.remaining === 0 ? 'Settling particles…' : 'Transforming' : state.remaining === 0 ? 'Complete' : 'Ready when you are'}</span></div>
      <div className={styles.row}>
        <button disabled={!ready || !!error} onClick={toggle}>{state.running ? 'Pause' : state.remaining === 0 ? 'Start again' : 'Start'}</button>
        <button disabled={!ready || !!error} onClick={flip}>Flip</button>
        <button disabled={!ready || !!error} onClick={reset}>Reset</button>
        <label>Duration <select value={duration} onChange={e => setDuration(Number(e.target.value))}>
          {Array.from(new Set([32, 300, 900, 1920, duration])).sort((a,b) => a-b).map(s => <option key={s} value={s}>{s < 60 ? `${s} sec` : `${s / 60} min`}</option>)}
        </select></label>
      </div>
      <div className={styles.row} role="group" aria-label="Drag mode">
        <button aria-pressed={mode === 'object'} onClick={() => changeMode('object')}>Rotate in 3D</button>
        <button aria-pressed={mode === 'orbit'} onClick={() => changeMode('orbit')}>Orbit view</button>
        <button onClick={() => view.current?.resetView()}>Reset view</button>
      </div>
    </div>}
  </section>;
}
