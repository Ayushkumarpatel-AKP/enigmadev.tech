'use client';

import { useEffect, useRef, useState } from 'react';

type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number };
type Bolt = { pts: { x: number; y: number }[]; life: number; max: number; width: number; alpha: number };

const ACCENT = '130,200,255';
const CORE = '228,244,255';
const COLD = '96,170,255';
const LIME = '210,250,117';

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const root = document.documentElement;
    root.classList.add('has-electric-cursor');

    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let moved = false;
    let hover = false;
    let charge = 0;
    const target = { x: w / 2, y: h / 2 };
    const cur = { x: target.x, y: target.y };
    const trail = { x: cur.x, y: cur.y };

    const sparks: Spark[] = [];
    const bolts: Bolt[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const boltPath = (x1: number, y1: number, x2: number, y2: number, segs: number, jitter: number) => {
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const edge = i === 0 || i === segs;
        pts.push({
          x: x1 + (x2 - x1) * t + (edge ? 0 : rand(-jitter, jitter)),
          y: y1 + (y2 - y1) * t + (edge ? 0 : rand(-jitter, jitter)),
        });
      }
      return pts;
    };

    const onMove = (e: MouseEvent) => {
      moved = true;
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const isInteractive = (el: Element | null) =>
      !!el?.closest('a, button, [role="button"], [data-magnetic], input, textarea, select, label');

    const onOver = (e: MouseEvent) => {
      hover = isInteractive(e.target as Element);
    };
    const onOut = (e: MouseEvent) => {
      if (!isInteractive(e.relatedTarget as Element)) hover = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dtMs = Math.min(now - last, 40);
      last = now;
      const dt = dtMs / 16.67;

      cur.x += (target.x - cur.x) * 0.42;
      cur.y += (target.y - cur.y) * 0.42;

      const dx = cur.x - trail.x;
      const dy = cur.y - trail.y;
      const dist = Math.hypot(dx, dy);
      const boost = hover ? 1.8 : 1;

      charge = Math.min(1, Math.max(0, charge + (dist > 2 ? 0.12 : -0.05)));

      // spawn along the path travelled so fast moves leave a continuous arc
      if (moved && dist > 2.5) {
        const steps = Math.min(Math.ceil(dist / 16), 9);
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const px = trail.x + dx * t;
          const py = trail.y + dy * t;

          for (let i = 0, n = hover ? 3 : 2; i < n; i++) {
            sparks.push({
              x: px,
              y: py,
              vx: rand(-2.4, 2.4) * boost,
              vy: rand(-2.4, 2.4) * boost,
              life: 0,
              max: rand(200, 480),
            });
          }

          if (Math.random() < 0.3 * boost) {
            bolts.push({
              pts: boltPath(px, py, px + rand(-52, 52), py + rand(-52, 52), 7, 12),
              life: 0,
              max: rand(110, 240),
              width: rand(0.7, 1.5),
              alpha: rand(0.5, 0.9),
            });
          }
        }
        trail.x = cur.x;
        trail.y = cur.y;
      } else {
        trail.x += (cur.x - trail.x) * 0.25;
        trail.y += (cur.y - trail.y) * 0.25;
      }

      // arcs cracking off the point
      if (moved && Math.random() < 0.18 + charge * 0.32) {
        const a = Math.random() * Math.PI * 2;
        const r0 = rand(3, 9);
        const len = hover ? rand(18, 40) : rand(10, 26);
        const bx = cur.x + Math.cos(a) * r0;
        const by = cur.y + Math.sin(a) * r0;
        bolts.push({
          pts: boltPath(bx, by, bx + Math.cos(a) * len, by + Math.sin(a) * len, 5, 8),
          life: 0,
          max: rand(80, 170),
          width: rand(0.6, 1.3),
          alpha: rand(0.5, 1),
        });
      }

      if (sparks.length > 170) sparks.splice(0, sparks.length - 170);
      if (bolts.length > 22) bolts.splice(0, bolts.length - 22);

      // fade previous frame -> lightning trails
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';

      // sparks — one batched path
      ctx.beginPath();
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.life += dtMs;
        if (sp.life >= sp.max) {
          sparks.splice(i, 1);
          continue;
        }
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.vx *= 0.93;
        sp.vy *= 0.93;
        ctx.moveTo(sp.x, sp.y);
        ctx.lineTo(sp.x - sp.vx * 2.6, sp.y - sp.vy * 2.6);
      }
      ctx.strokeStyle = `rgba(${ACCENT},0.8)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // jagged arcs
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        b.life += dtMs;
        if (b.life >= b.max) {
          bolts.splice(i, 1);
          continue;
        }
        const a = (1 - b.life / b.max) * b.alpha;
        ctx.beginPath();
        for (let p = 0; p < b.pts.length; p++) {
          const pt = b.pts[p];
          if (p === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = `rgba(${ACCENT},${a * 0.28})`;
        ctx.lineWidth = b.width * 3.2;
        ctx.stroke();
        ctx.strokeStyle = `rgba(${CORE},${a})`;
        ctx.lineWidth = b.width;
        ctx.stroke();
      }

      // charged core — kept small and soft
      if (moved) {
        const rad = (hover ? 17 : 9) * (0.9 + charge * 0.3);
        const grad = ctx.createRadialGradient(cur.x, cur.y, 0, cur.x, cur.y, rad);
        grad.addColorStop(0, `rgba(${CORE},0.7)`);
        grad.addColorStop(0.32, `rgba(${ACCENT},0.38)`);
        grad.addColorStop(0.72, `rgba(${COLD},0.1)`);
        grad.addColorStop(1, `rgba(${LIME},0.05)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cur.x, cur.y, rad, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${CORE},0.85)`;
        ctx.beginPath();
        ctx.arc(cur.x, cur.y, hover ? 1.6 : 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      root.classList.remove('has-electric-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[75]" aria-hidden="true" />;
}
