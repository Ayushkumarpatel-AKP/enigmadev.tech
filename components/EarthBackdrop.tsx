'use client';

import { useEffect, useRef } from 'react';

const TAN = '209,167,123';
const WARM = '238,209,180';

export function EarthBackdrop() {
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
    let cx = 0;
    let cy = 0;
    let R = 0;
    let pings: { r: number; alpha: number }[] = [];
    let sats: { rx: number; ry: number; a: number; speed: number; tilt: number }[] = [];

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
      cy = h * 0.52;
      R = Math.min(w, h) * 0.42;
      sats = Array.from({ length: 3 }, (_, i) => ({
        rx: R * (0.68 + i * 0.17),
        ry: R * (0.4 + i * 0.11),
        a: rand(0, Math.PI * 2),
        speed: rand(0.00016, 0.00042) * (i % 2 ? -1 : 1),
        tilt: rand(-0.5, -0.14),
      }));
    };

    let t = 0;
    let pingTimer = 0;
    let raf = 0;
    let last = performance.now();

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);

      // survey grid
      ctx.strokeStyle = 'rgba(244,243,239,0.032)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 72) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y <= h; y += 72) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // curved latitude lines
      ctx.strokeStyle = `rgba(${TAN},0.07)`;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        for (let x = cx - R; x <= cx + R; x += 6) {
          const y = cy + R * 0.55 * Math.sin(((x - cx) / R) * Math.PI) * (i / 3.2);
          if (x === cx - R) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // range rings
      ctx.strokeStyle = `rgba(${TAN},0.14)`;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (R / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // crosshair
      ctx.beginPath();
      ctx.moveTo(cx - R, cy);
      ctx.lineTo(cx + R, cy);
      ctx.moveTo(cx, cy - R);
      ctx.lineTo(cx, cy + R);
      ctx.strokeStyle = `rgba(${TAN},0.1)`;
      ctx.stroke();

      // radar sweep with trailing edge
      const sweep = (t * 0.0007) % (Math.PI * 2);
      for (let i = 0; i < 28; i++) {
        const a = sweep - i * 0.04;
        ctx.strokeStyle = `rgba(${WARM},${(1 - i / 28) * 0.3})`;
        ctx.lineWidth = i === 0 ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx.stroke();
      }

      // sonar pings
      pingTimer += dt;
      if (pingTimer > 2200) {
        pingTimer = 0;
        pings.push({ r: R * 0.05, alpha: 0.45 });
      }
      for (let i = pings.length - 1; i >= 0; i--) {
        const p = pings[i];
        p.r += 0.028 * dt;
        p.alpha -= 0.00022 * dt;
        if (p.alpha <= 0 || p.r > R) {
          pings.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(${TAN},${p.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, p.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // orbiting satellites
      for (const s of sats) {
        s.a += s.speed * dt;
        ctx.strokeStyle = `rgba(${WARM},0.07)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, s.rx, s.ry, s.tilt, 0, Math.PI * 2);
        ctx.stroke();

        const x = cx + Math.cos(s.a) * s.rx * Math.cos(s.tilt) - Math.sin(s.a) * s.ry * Math.sin(s.tilt);
        const y = cy + Math.cos(s.a) * s.rx * Math.sin(s.tilt) + Math.sin(s.a) * s.ry * Math.cos(s.tilt);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 18);
        glow.addColorStop(0, `rgba(${WARM},0.85)`);
        glow.addColorStop(1, `rgba(${WARM},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${WARM},1)`;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
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

  return <canvas ref={ref} className="earth-backdrop absolute inset-0 h-full w-full" aria-hidden="true" />;
}
