'use client';

import { useEffect, useRef } from 'react';

const LAV = '199,182,245';
const SOFT = '235,228,255';

export function PeopleBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const BARS = 72;
    let dpr = 1;
    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let R = 0;
    let rings: { r: number; alpha: number }[] = [];
    let dust: { x: number; y: number; vx: number; vy: number; s: number }[] = [];

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w * 0.5;
      cy = h * 0.46;
      R = Math.min(w, h) * 0.26;
      dust = Array.from({ length: 40 }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.14, 0.14),
        vy: rand(-0.14, 0.14),
        s: rand(0.6, 1.8),
      }));
    };

    let t = 0;
    let ringTimer = 0;
    let raf = 0;
    let last = performance.now();

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);

      // drifting dust
      for (const d of dust) {
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (d.x < 0) d.x = w;
        if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h;
        if (d.y > h) d.y = 0;
        ctx.fillStyle = `rgba(${LAV},0.22)`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.s, 0, Math.PI * 2);
        ctx.fill();
      }

      // expanding gesture pulses
      ringTimer += dt;
      if (ringTimer > 1500) {
        ringTimer = 0;
        rings.push({ r: R * 0.7, alpha: 0.34 });
      }
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.r += 0.05 * dt;
        ring.alpha -= 0.00026 * dt;
        if (ring.alpha <= 0) {
          rings.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(${LAV},${ring.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // base ring
      ctx.strokeStyle = `rgba(${LAV},0.16)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.72, 0, Math.PI * 2);
      ctx.stroke();

      // circular voice spectrum — batched into one path
      ctx.beginPath();
      for (let i = 0; i < BARS; i++) {
        const a = (i / BARS) * Math.PI * 2;
        const amp = 0.16 + 0.84 * Math.abs(Math.sin(t * 0.0022 + i * 0.42) * Math.cos(t * 0.0014 + i * 0.11));
        const r0 = R * 0.72;
        const r1 = r0 + amp * R * 0.46;
        ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
        ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      }
      ctx.strokeStyle = `rgba(${SOFT},0.45)`;
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      ctx.stroke();

      // centre glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.7);
      glow.addColorStop(0, `rgba(${LAV},0.22)`);
      glow.addColorStop(1, `rgba(${LAV},0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // voice waveform along the base
      ctx.beginPath();
      const base = h * 0.87;
      for (let x = 0; x <= w; x += 5) {
        const env = Math.exp(-Math.pow((x - w / 2) / (w * 0.34), 2));
        const y = base + (Math.sin(x * 0.017 + t * 0.005) * 12 + Math.sin(x * 0.031 - t * 0.0032) * 7) * env;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${SOFT},0.35)`;
      ctx.lineWidth = 1.3;
      ctx.stroke();
    };

    const frame = (now: number) => {
      const dt = Math.min(now - last, 40);
      last = now;
      t += dt;
      draw(dt);
      raf = requestAnimationFrame(frame);
    };

    setup();
    window.addEventListener('resize', setup);

    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', setup);
    };
  }, []);

  return <canvas ref={ref} className="people-backdrop absolute inset-0 h-full w-full" aria-hidden="true" />;
}
