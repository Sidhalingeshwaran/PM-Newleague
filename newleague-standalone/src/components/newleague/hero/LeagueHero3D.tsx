'use client';

import { useEffect, useRef, useState } from 'react';
import { createCourtScene } from './courtScene';

/**
 * Interactive 3D arena for the homepage hero.
 *
 * - Canvas 2D renderer (no WebGL or extra dependencies required).
 * - Pointer / touch parallax with eased camera movement.
 * - Renders a single static frame when the user prefers reduced motion.
 * - Pauses when off-screen or when the tab is hidden.
 * - Fewer particles and a lower pixel ratio on small or low-power devices.
 * - If a 2D context is unavailable the server-rendered poster stays visible.
 *
 * Loaded with `next/dynamic` (ssr: false) from HeroScene so the code only
 * ships on the league homepage.
 */
export default function LeagueHero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext('2d', { alpha: false });
    } catch {
      ctx = null;
    }
    if (!ctx) return; // static poster remains as the fallback

    const small = window.matchMedia('(max-width: 767px)').matches;
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
    const scene = createCourtScene({
      particleCount: small || lowPower ? 55 : 140,
      standLightCount: small || lowPower ? 140 : 320,
    });
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let visible = true;
    let start = performance.now();
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let pointerActive = false;

    const draw = (time: number) => {
      if (!ctx || width === 0 || height === 0) return;
      const t = reducedMotion.matches ? 0 : (time - start) / 1000;
      ctx.setTransform(
        canvas.width / width,
        0,
        0,
        canvas.height / height,
        0,
        0
      );
      scene.render(ctx, width, height, t, current.x, current.y);
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        small || lowPower ? 1.5 : 2
      );
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      if (!running) draw(performance.now());
    };

    const tick = (time: number) => {
      if (!pointerActive) {
        // Gentle idle drift when there is no pointer (e.g. on touch devices).
        const idle = (time - start) / 1000;
        target.x = Math.sin(idle * 0.18) * 0.35;
        target.y = Math.sin(idle * 0.13) * 0.2;
      }
      current.x += (target.x - current.x) * 0.045;
      current.y += (target.y - current.y) * 0.045;
      draw(time);
      frame = requestAnimationFrame(tick);
    };

    const play = () => {
      if (running || reducedMotion.matches || !visible || document.hidden)
        return;
      running = true;
      frame = requestAnimationFrame(tick);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      target.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      pointerActive = true;
    };
    const onPointerLeave = () => {
      pointerActive = false;
    };
    const onVisibility = () => (document.hidden ? pause() : play());
    const onMotionChange = () => {
      if (reducedMotion.matches) {
        pause();
        current.x = 0;
        current.y = 0;
        draw(performance.now());
      } else {
        start = performance.now();
        play();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const inView = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    inView.observe(host);

    host.addEventListener('pointermove', onPointerMove, { passive: true });
    host.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    reducedMotion.addEventListener('change', onMotionChange);

    resize();
    draw(performance.now());
    setReady(true);
    play();

    return () => {
      pause();
      resizeObserver.disconnect();
      inView.disconnect();
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      reducedMotion.removeEventListener('change', onMotionChange);
      // Release the backing store promptly.
      canvas.width = 0;
      canvas.height = 0;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
        ready ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
