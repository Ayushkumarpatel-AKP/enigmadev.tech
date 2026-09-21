'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, Linkedin } from 'lucide-react';
import { TEAM, type Member } from '@/components/team-data';

/* TEAM data ab @/components/team-data me hai — wahi edit karo (homepage preview bhi wahi se aata hai) */

const NAV = ['All', 'Full-Stack', 'Backend', 'Hardware'] as const;

function Cover({ m }: { m: Member }) {
  if (m.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={m.photo}
        alt={`${m.name} photo`}
        className={`absolute inset-0 h-full w-full saturate-[.7] contrast-[1.05] transition duration-700 group-hover:scale-[1.06] group-hover:saturate-100 ${m.fit === 'contain' ? 'object-contain bg-[#0b0b0b]' : 'object-cover'}`}
        style={{ objectPosition: m.pos ?? '50% 50%', transform: m.zoom ? `scale(${m.zoom})` : undefined }}
        draggable={false}
      />
    );
  }
  return (
    <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_10%,#1d1d1b_0%,#0b0b0b_55%,#060606_100%)] transition duration-700 group-hover:bg-[radial-gradient(120%_120%_at_80%_90%,#272c14_0%,#101106_45%,#060606_100%)]">
      <div className="flex h-full items-center justify-center">
        <span className="display-sm select-none text-white/[.13] transition duration-700 group-hover:scale-105 group-hover:text-[#d2fa75]/25">
          {m.initials}
        </span>
      </div>
      <div className="absolute inset-4 border hairline opacity-60" aria-hidden="true" />
    </div>
  );
}

function Card({ m, i }: { m: Member; i: number }) {
  return (
    <article className="group relative flex w-[290px] shrink-0 select-none flex-col border hairline bg-[#0b0b0b] transition-colors duration-500 hover:border-[#d2fa75]/60 md:w-[330px]">
      {/* cover + hover intro */}
      <div className="relative aspect-[4/4.2] overflow-hidden border-b hairline">
        <Cover m={m} />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true" />

        <span className="eyebrow absolute left-5 top-5 !text-white/50">0{i + 1}</span>
        <span className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center border hairline bg-black/40 text-white/60 backdrop-blur transition duration-500 group-hover:border-[#d2fa75] group-hover:bg-[#d2fa75] group-hover:text-black">
          <ArrowUpRight size={15} />
        </span>

        {/* short intro — hover par slide up */}
        <div className="absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-black via-black/85 to-transparent px-5 pb-5 pt-12 opacity-0 transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <p className="border-l-2 border-[#d2fa75] pl-3 text-[13px] leading-relaxed text-white/85">{m.bio}</p>
        </div>
      </div>

      {/* circular img panel — photo ya initials, cover ke upar overlap */}
      <div className="relative z-10 -mt-8 ml-5 h-16 w-16 overflow-hidden rounded-full border border-white/25 bg-[#161614] transition duration-500 group-hover:border-[#d2fa75]">
        {m.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.photo} alt={`${m.name} photo`} className="h-full w-full object-cover saturate-[.8]" style={{ objectPosition: m.pos ?? '50% 50%' }} draggable={false} />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-lg font-medium tracking-[-.02em] text-white/85 transition duration-500 group-hover:text-[#d2fa75]">
            {m.initials}
          </span>
        )}
      </div>

      {/* name / role — hamesha visible */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="eyebrow mb-2 !text-[#d2fa75]">
          {m.title} · {m.role}
        </p>
        <h3 className="text-[1.55rem] leading-none tracking-[-.04em]">{m.name}</h3>
        <div className="mt-4 flex flex-wrap gap-2 border-t hairline pt-4">
          {m.tags.map((t) => (
            <span
              key={t}
              className="border hairline px-3 py-1 text-[10px] uppercase tracking-[.14em] text-white/55 transition group-hover:border-white/25 group-hover:text-white/80"
            >
              {t}
            </span>
          ))}
        </div>
        {(m.links?.linkedin || m.links?.github) && (
          <div className="mt-4 flex items-center gap-2">
            <span className="eyebrow mr-1">Connect</span>
            {m.links?.linkedin && (
              <a
                href={m.links.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={`${m.name} on LinkedIn`}
                onPointerDown={(e) => e.stopPropagation()}
                className="flex h-9 w-9 items-center justify-center border border-white/35 bg-white/[.06] text-white transition duration-300 hover:border-[#d2fa75] hover:bg-[#d2fa75] hover:text-black"
              >
                <Linkedin size={15} />
              </a>
            )}
            {m.links?.github && (
              <a
                href={m.links.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${m.name} on GitHub`}
                onPointerDown={(e) => e.stopPropagation()}
                className="flex h-9 w-9 items-center justify-center border border-white/35 bg-white/[.06] text-white transition duration-300 hover:border-[#d2fa75] hover:bg-[#d2fa75] hover:text-black"
              >
                <Github size={15} />
              </a>
            )}
          </div>
        )}
      </div>

      <div className="h-[2px] w-full origin-left scale-x-0 bg-[#d2fa75] transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />
    </article>
  );
}

export function Team() {
  const [tab, setTab] = useState<(typeof NAV)[number]>('All');
  const scrollerRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const dragging = useRef(false);
  const lastInteract = useRef(0);

  const filtered = tab === 'All' ? TEAM : TEAM.filter((m) => m.tracks.includes(tab));
  const isAll = tab === 'All';
  // All me infinite loop ke liye 3 copies, filter me sirf utne cards — koi duplicate nahi
  const visible = isAll ? [...filtered, ...filtered, ...filtered] : filtered;

  const countFor = (n: (typeof NAV)[number]) =>
    n === 'All' ? TEAM.length : TEAM.filter((m) => m.tracks.includes(n)).length;

  // All me infinite right-to-left loop, filter me sirf manual scroll (koi auto loop nahi)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (!isAll) {
      el.scrollLeft = 0;
      return;
    }
    const third = () => el.scrollWidth / 3;
    el.scrollLeft = third();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const idle = Date.now() - lastInteract.current > 2500;
      if (!dragging.current && !hovering.current && idle && document.visibilityState === 'visible') {
        el.scrollLeft += 0.55 * (dt / 16.67);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tab, isAll]);

  // All wale loop ka wrap (dono direction)
  const handleWrap = () => {
    const el = scrollerRef.current;
    if (!el || dragging.current) return;
    const t = el.scrollWidth / 3;
    if (t <= 0) return;
    if (el.scrollLeft >= t * 2) el.scrollLeft -= t;
    else if (el.scrollLeft <= 2) el.scrollLeft += t;
  };

  // drag-to-scroll
  const dragPos = useRef({ x: 0, left: 0 });
  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!el) return;
    dragging.current = true;
    lastInteract.current = Date.now();
    dragPos.current = { x: e.clientX, left: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
    el.classList.add('grabbing');
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!el || !dragging.current) return;
    el.scrollLeft = dragPos.current.left - (e.clientX - dragPos.current.x);
  };
  const endDrag = () => {
    dragging.current = false;
    lastInteract.current = Date.now();
    scrollerRef.current?.classList.remove('grabbing');
  };

  const nudge = (dir: 1 | -1) => {
    lastInteract.current = Date.now();
    scrollerRef.current?.scrollBy({ left: dir * 360, behavior: 'smooth' });
  };

  return (
    <section id="team" className="overflow-hidden border-t hairline py-28 md:py-40">
      <div className="px-5 md:px-8">
        <p className="eyebrow mb-8">The team</p>
      <h2 className="display-sm max-w-6xl" data-tid="team-title">
        MINDS BEHIND
        <br />
        <span className="text-white/35">THE MACHINE.</span>
      </h2>
        <p className="mt-10 max-w-xl text-lg leading-tight text-white/65 md:text-2xl">
          Five builders, one discipline — software, hardware and research treated as a single craft.
        </p>

        {/* nav: category filter + left/right controls */}
        <div className="mt-14 flex flex-wrap items-center gap-2 border-y hairline py-4">
          {NAV.map((n) => {
            const active = tab === n;
            return (
              <button
                key={n}
                onClick={() => setTab(n)}
                className={`flex items-center gap-2 border px-4 py-2 text-[11px] uppercase tracking-[.14em] transition duration-300 ${
                  active
                    ? 'border-[#d2fa75] bg-[#d2fa75] text-black'
                    : 'hairline text-white/60 hover:border-white/40 hover:text-white'
                }`}
              >
                {n}
                <span className={`text-[10px] ${active ? 'text-black/60' : 'text-white/35'}`}>
                  {String(countFor(n)).padStart(2, '0')}
                </span>
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-2">
            <p className="eyebrow mr-2 hidden lg:block">Drag / scroll — hover for intro</p>
            <button
              aria-label="Scroll team left"
              onClick={() => nudge(-1)}
              className="flex h-9 w-9 items-center justify-center border hairline text-white/70 transition hover:border-[#d2fa75] hover:text-[#d2fa75]"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              aria-label="Scroll team right"
              onClick={() => nudge(1)}
              className="flex h-9 w-9 items-center justify-center border hairline text-white/70 transition hover:border-[#d2fa75] hover:text-[#d2fa75]"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* scroll strip */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
        className="relative mt-10"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#080808] to-transparent md:w-24" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#080808] to-transparent md:w-24" aria-hidden="true" />

        <div
          key={tab}
          ref={scrollerRef}
          onScroll={isAll ? handleWrap : undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={() => {
            endDrag();
            hovering.current = false;
          }}
          onMouseEnter={() => {
            hovering.current = true;
          }}
          onMouseLeave={() => {
            hovering.current = false;
          }}
          onWheel={() => {
            lastInteract.current = Date.now();
          }}
          onTouchStart={() => {
            lastInteract.current = Date.now();
          }}
          className="no-scrollbar flex w-full cursor-grab gap-5 overflow-x-auto px-5 pb-2 pt-1 md:px-8"
        >
          {visible.map((m, i) => (
            <Card key={`${m.name}-${i}`} m={m} i={i % filtered.length} />
          ))}
        </div>
      </motion.div>

      {/* join strip */}
      <div className="px-5 md:px-8">
        <div className="mt-14 flex flex-col justify-between gap-4 border hairline bg-[#f4f3ef] p-6 text-[#080808] md:flex-row md:items-center md:p-8">
          <div>
            <p className="eyebrow !text-black/50">Join the studio</p>
            <p className="mt-2 text-xl tracking-[-.03em] md:text-2xl">Want to build with us?</p>
          </div>
          <a
            href="mailto:enigma.devs22@gmail.com"
            className="link-arrow inline-flex w-fit items-center gap-2 border-b border-black/25 pb-2 text-sm uppercase tracking-[.14em]"
          >
            Say hello <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
