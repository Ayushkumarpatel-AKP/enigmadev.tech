'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { setLenis } from '@/lib/lenis-store';

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      lerp: 0.2,
      wheelMultiplier: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.6,
      respectReducedMotion: true,
    });

    setLenis(lenis);
    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
