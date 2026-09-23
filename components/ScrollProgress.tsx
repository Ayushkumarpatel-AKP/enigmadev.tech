'use client';

import { useEffect, useState } from 'react';
import { useScroll, useSpring, motion } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });
  const [hide, setHide] = useState(true);

  useEffect(() => {
    setHide(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  if (hide) return null;

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[70] h-[2px] origin-left"
      style={{
        scaleX,
        background: '#d2fa75',
        boxShadow: '0 0 6px #d2fa75, 0 0 14px rgba(210,250,117,.5)',
      }}
      aria-hidden="true"
    />
  );
}
