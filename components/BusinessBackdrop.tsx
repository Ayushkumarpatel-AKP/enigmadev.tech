'use client';

import { useEffect, useRef } from 'react';

type Bar = { h: number; target: number };
type Stream = { y: number; speed: number; pos: number; len: number };

const GRID = 64;
const BAR_GAP = 26;
const BLUE = '130,200,255';
const COLD = '96,170,255';
const CORE = '228,244,255';

export function BusinessBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    let dpr = 1;
    let w = 0;
    let h = 0;
    let bars: Bar[] = [];
    let streams: Stream[] = [];

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const barCount = Math.max(10, Math.ceil(w / BAR_GAP));
      bars = Array.from({ length: barCount }, () => ({ h: rand(0.06, 0.42), target: rand(0.06, 0.6) }));
      streams = Array.from({ length: 6 }, (_, i) => ({
        y: (h / 7) * (i + 1),
        speed: rand(0.035, 0.11),
        pos: rand(-w, w),
        len: rand(90, 280),
      }));
    };

    const lineAt = (x: number, t: number) =>
      0.5 + 0.16 * Math.sin(x * 0.006 + t * 0.0008) + 0.09 * Math.sin(x * 0.017 - t * 0.0013);

    let t = 0;
    let raf = 0;
    let last = performance.now();

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // blueprint grid
      ctx.strokeStyle = 'rgba(244,243,239,0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += GRID) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y <= h; y += GRID) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // rising bars
      const bw = w / bars.length;
      for (let i = 0; i < bars.length; i++) {
        const b = bars[i];
        b.h += (b.target - b.h) * 0.03;
        if (Math.random() < 0.006) b.target = rand(0.06, 0.62);
        const bh = b.h * h * 0.5;
        ctx.fillStyle = `rgba(${BLUE},${0.07 + b.h * 0.26})`;
        ctx.fillRect(i * bw + bw * 0.24, h - bh, bw * 0.5, bh);
      }

      // data streams
      ctx.lineWidth = 1.2;
      for (const s of streams) {
        s.pos += s.speed * 16;
        if (s.pos - s.len > w) {
          s.pos = -s.len;
          s.y = rand(h * 0.1, h * 0.9);
        }
        const grad = ctx.createLinearGradient(s.pos - s.len, 0, s.pos, 0);
        grad.addColorStop(0, `rgba(${COLD},0)`);
        grad.addColorStop(1, `rgba(${CORE},0.45)`);
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(s.pos - s.len, s.y);
        ctx.lineTo(s.pos, s.y);
        ctx.stroke();
      }

      // analytics line
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y = h * (0.16 + lineAt(x, t) * 0.36);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${BLUE},0.34)`;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // travelling pulse on the line
      const px = (t * 0.13) % w;
      const py = h * (0.16 + lineAt(px, t) * 0.36);
      const glow = ctx.createRadialGradient(px, py, 0, px, py, 30);
      glow.addColorStop(0, `rgba(${BLUE},0.85)`);
      glow.addColorStop(1, `rgba(${BLUE},0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(px, py, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(${CORE},1)`;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const frame = (now: number) => {
      const dt = Math.min(now - last, 40);
      last = now;
      t += dt;
      draw();
      raf = requestAnimationFrame(frame);
    };

    setup();
    window.addEventListener('resize', setup);

    if (reduced) {
      draw();
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', setup);
    };
  }, []);

  return <canvas ref={ref} className="business-backdrop absolute inset-0 h-full w-full" aria-hidden="true" />;
}
