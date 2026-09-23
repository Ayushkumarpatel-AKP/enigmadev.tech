'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrambleText } from '@/components/ScrambleText';
import { getLenis } from '@/lib/lenis-store';

const EASE = [0.76, 0, 0.24, 1] as const;

export function IntroLoader() {
  const [active, setActive] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (sessionStorage.getItem('enigma-intro') === '1') return;

    const unlock = () => {
      document.body.style.overflow = '';
      getLenis()?.start();
    };

    setActive(true);
    getLenis()?.stop();
    document.body.style.overflow = 'hidden';

    const start = performance.now();
    const duration = 1700;
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setPct(Math.round(progress * 100));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem('enigma-intro', '1');
        setActive(false);
        unlock();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      unlock();
    };
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#080808] px-6"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            className="flex items-center gap-3"
          >
            <Image src="/images/enigma-logo.svg" alt="Enigma Devs" width={30} height={30} priority className="rounded-sm" />
            <ScrambleText text="ENIGMA DEVS" className="text-sm font-semibold uppercase tracking-[.28em]" duration={1300} />
          </motion.div>

          <p className="eyebrow mt-9 !text-[#d2fa75]">
            Decrypting systems — {String(pct).padStart(3, '0')}%
          </p>

          <div className="mt-4 h-px w-56 max-w-[70vw] bg-white/15">
            <div
              className="h-full bg-[#d2fa75] transition-[width] duration-150 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
