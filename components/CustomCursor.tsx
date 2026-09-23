'use client';

import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dot = { ...target };
    const ring = { ...target };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const loop = () => {
      dot.x += (target.x - dot.x) * 0.35;
      dot.y += (target.y - dot.y) * 0.35;
      ring.x += (target.x - ring.x) * 0.12;
      ring.y += (target.y - ring.y) * 0.12;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const isInteractive = (el: Element | null) =>
      !!el?.closest('a, button, [role="button"], [data-magnetic], input, textarea, select, label');

    const onOver = (e: MouseEvent) => setHovering(isInteractive(e.target as Element));
    const onOut = (e: MouseEvent) => {
      const to = e.relatedTarget as Element | null;
      if (!isInteractive(to)) setHovering(false);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="hidden lg:block fixed left-0 top-0 z-[60] pointer-events-none" aria-hidden="true">
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full border mix-blend-difference transition-all duration-300 ease-out ${
            hovering ? 'h-12 w-12 border-[#d2fa75] bg-[#d2fa75]/10' : 'h-7 w-7 border-white/60'
          }`}
        />
      </div>
      <div ref={dotRef} className="hidden lg:block fixed left-0 top-0 z-[60] pointer-events-none" aria-hidden="true">
        <div
          className={`h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d2fa75] mix-blend-difference transition-transform duration-200 ${
            hovering ? 'scale-0' : 'scale-100'
          }`}
        />
      </div>
    </>
  );
}
