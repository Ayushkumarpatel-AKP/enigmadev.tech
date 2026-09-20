'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDown } from 'lucide-react';

const EASE = [0.2, 0.7, 0.2, 1] as const;

function RevealLine({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: 0.08 + i * 0.12, duration: 0.7, ease: EASE }}
      className="block"
    >
      {children}
    </motion.span>
  );
}

export function Contact() {
  return (
    <section id="contact" className="overflow-hidden bg-[#f4f3ef] px-5 py-28 text-[#080808] md:px-8 md:py-40">
      {/* top row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <p className="eyebrow !text-black/50">Start a conversation</p>
        <span className="flex items-center gap-2 border border-black/20 px-4 py-2 text-[10px] uppercase tracking-[.16em]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-black" />
          </span>
          Open for new projects
        </span>
      </motion.div>

      {/* headline */}
      <h2 className="display-sm mt-10 font-bold" style={{ color: '#080808' }}>
        <RevealLine i={0}>LET'S BUILD</RevealLine>
        <RevealLine i={1}>SOMETHING</RevealLine>
        <RevealLine i={2}>MEANINGFUL.</RevealLine>
      </h2>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
        className="mt-10 max-w-xl text-lg leading-tight text-black/60 md:text-2xl"
      >
        Software, AI, research or hardware — tell us what you're building, we'll take it from there.
      </motion.p>

      {/* giant email CTA */}
      <motion.a
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.45, duration: 0.6, ease: EASE }}
        href="mailto:enigma.devs22@gmail.com"
        className="group mt-12 flex items-center justify-between gap-4 bg-[#080808] px-6 py-6 text-[#f4f3ef] transition-colors duration-400 hover:bg-[#d2fa75] hover:text-black md:px-10 md:py-8"
      >
        <span className="truncate text-lg tracking-[-.02em] md:text-3xl">enigma.devs22@gmail.com</span>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 transition duration-400 group-hover:rotate-45 group-hover:border-black/30 md:h-14 md:w-14">
          <ArrowUpRight size={22} />
        </span>
      </motion.a>

      {/* socials */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {[
          { label: 'LinkedIn', handle: '/company/enigma-devs', href: 'https://www.linkedin.com/company/enigma-devs' },
          { label: 'Instagram', handle: '@enigma.devs', href: 'https://www.instagram.com/enigma.devs' },
        ].map((s, i) => (
          <motion.a
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55 + i * 0.1, duration: 0.6, ease: EASE }}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between border border-black/20 p-6 transition-colors duration-400 hover:border-black hover:bg-black hover:text-[#f4f3ef] md:p-8"
          >
            <span>
              <span className="eyebrow block !text-black/45 transition group-hover:!text-white/50">0{i + 1} — Follow</span>
              <span className="mt-2 block text-2xl tracking-[-.03em] md:text-3xl">{s.label}</span>
              <span className="mt-1 block text-xs uppercase tracking-[.14em] opacity-50">{s.handle}</span>
            </span>
            <ArrowUpRight size={26} className="shrink-0 transition duration-300 group-hover:rotate-45 group-hover:text-[#d2fa75]" />
          </motion.a>
        ))}
      </div>

      {/* bottom strip */}
      <div className="mt-16 flex flex-col justify-between gap-3 border-t border-black/15 pt-5 text-[10px] uppercase tracking-[.16em] text-black/45 md:flex-row">
        <span>Software · AI · Research · Hardware</span>
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex w-fit items-center gap-2 transition hover:text-black">
          Back to top <ArrowDown size={13} className="rotate-180" />
        </a>
      </div>
    </section>
  );
}
