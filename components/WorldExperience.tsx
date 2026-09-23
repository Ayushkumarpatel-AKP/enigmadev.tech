'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';

const worlds = [
  { label: 'FOR BUSINESSES', short: 'Businesses', href: '/businesses', image: '/images/for-companies.svg', desc: 'Intelligent software systems designed to turn complex operations, information and workflows into something people can actually use.', accent: '#d2fa75' },
  { label: 'FOR EARTH', short: 'Earth', href: '/earth', image: '/images/for-earth.svg', desc: 'Technology that observes, understands and helps protect the systems our planet depends on.', accent: '#d1a77b' },
  { label: 'FOR THE PEOPLE', short: 'People', href: '/people', image: '/images/for-people.svg', desc: 'Technology should become more accessible, more inclusive and more useful to the people who depend on it.', accent: '#c7b6f5' },
];

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const easeOut = (v: number) => 1 - Math.pow(1 - v, 2.2);

function WorldPanel({ world, i, total, progress }: { world: (typeof worlds)[number]; i: number; total: number; progress: MotionValue<number> }) {
  const span = total - 1;

  // 0 -> 1 as this panel gets covered by the next one
  const covered = useTransform(progress, (p) => clamp01(p * span - i));
  // full life of the panel (entering -> fully covered), used for the image parallax
  const life = useTransform(progress, (p) => (clamp01(p * span - (i - 1)) + clamp01(p * span - i)) / 2);

  const scale = useTransform(covered, (c) => 1 - easeOut(c) * 0.1);
  const opacity = useTransform(covered, (c) => 1 - easeOut(c) * 0.72);
  const radius = useTransform(covered, (c) => easeOut(c) * 26);
  const copyY = useTransform(covered, (c) => `${-easeOut(c) * 12}%`);
  const copyOpacity = useTransform(covered, (c) => 1 - clamp01((c - 0.35) / 0.5));
  const titleX = useTransform(covered, (c) => `${-easeOut(c) * 4}%`);
  const imageY = useTransform(life, [0, 1], ['-6%', '6%']);
  const imageScale = useTransform(life, [0, 0.5, 1], [1.1, 1.02, 1.1]);

  return (
    <article className="world-panel">
      <motion.div className="world-card" style={{ scale, opacity, borderRadius: radius }}>
        <motion.div className="absolute inset-[-7%]" style={{ y: imageY, scale: imageScale }}>
          <Image className="world-image" src={world.image} alt={`${world.label} visual`} fill sizes="100vw" priority={i === 0} />
        </motion.div>
        <span className="world-glow" style={{ background: world.accent }} aria-hidden="true" />
        <span className="world-shade" aria-hidden="true" />
        <motion.div className="world-copy" style={{ y: copyY, opacity: copyOpacity }}>
          <div className="flex justify-between">
            <p className="eyebrow">World 0{i + 1}</p>
            <p className="eyebrow">Enigma / 2026</p>
          </div>
          <Link href={world.href} className="group block">
            <motion.h2 className="world-title whitespace-pre-line" style={{ x: titleX }}>{world.label.replace('FOR ', 'FOR\n')}</motion.h2>
          </Link>
          <div className="world-bottom">
            <p className="world-description">{world.desc}</p>
            <div className="flex flex-col items-start gap-4 md:items-end">
              <span className="eyebrow">0{i + 1} / 0{total}</span>
              <Link href={world.href} className="link-arrow text-sm uppercase tracking-[.14em]" style={{ color: world.accent }}>Explore our work <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </article>
  );
}

export function WorldExperience() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = Math.min(worlds.length - 1, Math.max(0, Math.round(p * (worlds.length - 1))));
    setActive((prev) => (prev === next ? prev : next));
  });

  return (
    <section id="work" ref={ref} className="world-stack">
      {worlds.map((world, i) => (
        <WorldPanel key={world.label} world={world} i={i} total={worlds.length} progress={scrollYProgress} />
      ))}

      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden lg:block">
        <div className="sticky top-1/2 -translate-y-1/2">
          <div className="flex flex-col items-end gap-4 pr-8">
            {worlds.map((world, i) => (
              <div key={world.label} className="flex items-center justify-end gap-3">
                <span className={`text-[10px] uppercase tracking-[.18em] transition-colors duration-500 ${active === i ? 'text-white' : 'text-white/30'}`}>
                  {world.short}
                </span>
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${active === i ? 'scale-150' : 'bg-white/30'}`}
                  style={active === i ? { background: world.accent } : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
