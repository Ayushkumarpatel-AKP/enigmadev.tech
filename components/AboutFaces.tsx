'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TEAM } from '@/components/team-data';

const HOLD = 2200;
const EASE = [0.2, 0.7, 0.2, 1] as const;

export function AboutFaces() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % TEAM.length), HOLD);
    return () => clearInterval(id);
  }, []);

  const m = TEAM[i];

  return (
    <div className="pointer-events-none absolute right-4 top-[14%] md:right-[90px] md:top-[12%] lg:right-[202px] lg:top-[10%]" aria-hidden="true">
      <div className="flex flex-col items-center">
        <div className="relative isolate">
          <span className="about-faces-halo" aria-hidden="true" />
          <div className="about-faces-img relative h-[245px] w-[172px] overflow-hidden rounded-[22px] ring-1 ring-white/15 md:h-[400px] md:w-[280px] md:rounded-[28px] lg:h-[540px] lg:w-[380px] lg:rounded-[34px]">
          <AnimatePresence initial={false}>
            <motion.img
              key={m.name}
              src={m.photo}
              alt=""
              initial={{ opacity: 0, scale: 1.07 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.9, ease: EASE },
                scale: { duration: HOLD / 1000, ease: 'linear' },
              }}
              className="absolute inset-0 h-full w-full object-cover object-top grayscale contrast-[1.05]"
            />
          </AnimatePresence>
          </div>
        </div>

        <div className="mt-5 hidden w-full text-center md:block">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={m.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="eyebrow !text-white/45"
            >
              {m.name} · {m.title}
            </motion.p>
          </AnimatePresence>
          <div className="mt-3 flex justify-center gap-1.5">
            {TEAM.map((t, k) => (
              <span
                key={t.name}
                className={`h-1 rounded-full transition-all duration-500 ${
                  k === i ? 'w-5 bg-[#d2fa75]' : 'w-1.5 bg-white/25'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
