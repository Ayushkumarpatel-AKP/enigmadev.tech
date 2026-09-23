'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { ScrambleText } from '@/components/ScrambleText';
import { getLenis } from '@/lib/lenis-store';

const EASE = [0.76, 0, 0.24, 1] as const;
const DURATION = 1700;
const START_DELAY = 140;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

export function IntroLoader() {
  const [active, setActive] = useState(false);
  const progress = useMotionValue(0);
  const countRef = useRef<HTMLSpanElement>(null);

  // percentage is written straight to the DOM — no re-render per frame
  useMotionValueEvent(progress, 'change', (v) => {
    if (countRef.current) countRef.current.textContent = String(Math.round(v * 100)).padStart(3, '0');
  });

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

    let raf = 0;
    let startTime = 0;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const t = Math.min((now - startTime) / DURATION, 1);
      progress.set(smoothstep(t));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem('enigma-intro', '1');
        setActive(false);
        unlock();
      }
    };

    // small beat so hydration/first paint settles before the count-up starts
    const timer = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, START_DELAY);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      unlock();
    };
  }, [progress]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#080808] px-6"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 1, ease: EASE }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-3">
              <Image src="/images/enigma-logo.svg" alt="Enigma Devs" width={30} height={30} priority className="rounded-sm" />
              <ScrambleText text="ENIGMA DEVS" className="text-sm font-semibold uppercase tracking-[.28em]" duration={1300} />
            </div>

            <p className="eyebrow mt-9 !text-[#d2fa75]">
              Decrypting systems — <span ref={countRef}>000</span>%
            </p>

            <div className="mt-4 h-px w-56 max-w-[70vw] overflow-hidden bg-white/15">
              <motion.div
                className="h-full w-full origin-left bg-[#d2fa75]"
                style={{ scaleX: progress, boxShadow: '0 0 8px rgba(210,250,117,.6)' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
