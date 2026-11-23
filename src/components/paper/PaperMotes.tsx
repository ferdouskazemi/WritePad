'use client';

import { useEffect, useRef } from 'react';

type Mote = { x: number; y: number; r: number; vy: number; sway: number; swaySpeed: number; a: number; tw: number };

/** ذرات طلایی که آرام در نور بالا می‌روند (اختیاری، برای پس‌زمینهٔ تیره) */
export function PaperMotes({ color = '255,214,140', count = 35 }: { color?: string; count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let isRunning = true;

    const spawn = (initial: boolean): Mote => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10 * dpr,
      r: (Math.random() * 1.5 + 0.5) * dpr,
      vy: (Math.random() * 0.22 + 0.08) * dpr,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.01 + 0.003,
      a: Math.random() * 0.45 + 0.25,
      tw: Math.random() * Math.PI * 2,
    });
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
    };
    resize();
    const motes = Array.from({ length: count }, () => spawn(true));

    const frame = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y -= m.vy;
        m.sway += m.swaySpeed;
        m.tw += 0.03;
        m.x += Math.sin(m.sway) * 0.25 * dpr;
        if (m.y < -10 * dpr) Object.assign(m, spawn(false));
        const alpha = m.a * (0.6 + 0.4 * Math.sin(m.tw));
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 3.5);
        g.addColorStop(0, `rgba(${color},${alpha})`);
        g.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    frame();

    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(raf);
      } else {
        if (!isRunning) {
          isRunning = true;
          raf = requestAnimationFrame(frame);
        }
      }
    };

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      isRunning = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [color, count]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, mixBlendMode: 'screen' }}
    />
  );
}
