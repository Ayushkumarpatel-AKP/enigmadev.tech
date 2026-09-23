'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export type Project = {
  tag: string;
  world: string;
  title: string;
  desc: string;
  image: string;
  href: string;
  accent: string;
  spot: string;
};

export function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    el.style.setProperty('--ry', `${((x / r.width) - 0.5) * 6}deg`);
    el.style.setProperty('--rx', `${((y / r.height) - 0.5) * -4}deg`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <Link
      ref={ref}
      href={project.href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="project-card group relative flex h-full flex-col overflow-hidden border hairline bg-white/[.02]"
      style={{ '--spot': project.spot } as React.CSSProperties}
    >
      <span className="project-spot" aria-hidden="true" />

      <div className="relative aspect-[4/3] overflow-hidden border-b hairline">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={`${project.title} project visual`}
          className="h-full w-full object-cover saturate-[.55] transition duration-700 group-hover:scale-[1.07] group-hover:saturate-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/25 to-transparent" />
        <span className="eyebrow absolute left-4 top-4" style={{ color: project.accent }}>{project.tag}</span>
        <span
          className="absolute right-4 top-4 z-10 flex h-9 w-9 -translate-y-1 items-center justify-center border bg-black/40 opacity-0 backdrop-blur transition duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          style={{ borderColor: project.accent, color: project.accent }}
        >
          <ArrowUpRight size={15} />
        </span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-5 md:p-6">
        <span className="eyebrow !text-white/45">For {project.world}</span>
        <h3 className="mt-3 text-2xl tracking-[-.04em] transition-transform duration-500 group-hover:translate-x-1 md:text-3xl">{project.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/55">{project.desc}</p>
        <span className="link-arrow mt-6 inline-flex text-[11px] uppercase tracking-[.16em]" style={{ color: project.accent }}>Explore <ArrowUpRight size={14} /></span>
      </div>

      <span className="relative z-10 h-[2px] w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ background: project.accent }} aria-hidden="true" />
    </Link>
  );
}
