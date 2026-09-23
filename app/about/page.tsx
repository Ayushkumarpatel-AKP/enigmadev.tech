import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Team } from '@/components/Team';
import { AboutFaces } from '@/components/AboutFaces';
import { Reveal } from '@/components/Reveal';
import { ScrambleText } from '@/components/ScrambleText';

const principles = [
  { n: '01', title: 'One discipline', body: 'Software, hardware, AI and research are not separate teams here — they are a single connected craft.' },
  { n: '02', title: 'We build our own', body: 'Products like SecureAnswer, Sign2Voice and our environmental work begin as our own ideas, not client briefs alone.' },
  { n: '03', title: 'Research-led', body: 'We experiment, prototype and publish. Curiosity is the first step of every system we ship.' },
  { n: '04', title: 'Idea to shipped', body: 'Concept, design, engineering and hardware integration handled end to end by a small, senior team.' },
];

const facts = [
  ['05', 'Builders in the studio'],
  ['03', 'Worlds we build for'],
  ['3×', 'Hackathon wins'],
  ['06', 'Disciplines'],
];

export default function About(){
  return <main>
    <section className="relative overflow-hidden px-5 md:px-8 min-h-[100svh] flex flex-col justify-end pt-32 pb-10">
      <div className="about-glow" aria-hidden="true"/>
      <AboutFaces/>
      <div className="relative">
        <p className="eyebrow mb-8">About the studio</p>
        <h1 className="display" data-tid="about-title">
          <span className="block"><ScrambleText text="A SMALL TEAM." duration={1300} delay={120}/></span>
          <span className="block text-white/35"><ScrambleText text="BIG SYSTEMS." duration={1300} delay={420}/></span>
        </h1>
        <div className="mt-16 flex flex-col gap-8 border-t hairline pt-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-lg leading-tight text-white/70 md:text-2xl">A multidisciplinary team of developers, designers, researchers and builders exploring what becomes possible when software, AI and hardware are treated as one connected discipline.</p>
          <Link href="/#contact" className="link-arrow shrink-0 text-sm uppercase tracking-[.14em] text-[#d2fa75]">Work with us <ArrowUpRight size={16}/></Link>
        </div>
      </div>
    </section>

    <section className="border-y hairline px-5 py-16 md:px-8 md:py-20">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {facts.map(([value,label],i)=><Reveal key={label} delay={i*0.06}><div><p className="stat-value">{value}</p><p className="eyebrow mt-3">{label}</p></div></Reveal>)}
      </div>
    </section>

    <section className="px-5 py-28 md:px-8 md:py-40">
      <div className="mb-10 flex items-end justify-between border-b hairline pb-4">
        <p className="eyebrow">How we work</p>
        <p className="eyebrow">04 principles</p>
      </div>
      <h2 className="display-sm mb-16 max-w-4xl">
        <span className="block"><ScrambleText as="span" text="OUR PRINCIPLES." trigger="inView"/></span>
      </h2>
      <div className="grid gap-5 md:grid-cols-2">
        {principles.map((p,i)=><Reveal key={p.title} delay={i*0.07} className="h-full">
          <article className="group relative flex h-full flex-col justify-between overflow-hidden border hairline bg-white/[.02] p-6 transition-colors duration-500 hover:border-[#d2fa75]/60 hover:bg-white/[.045] md:p-8">
            <div className="flex items-start justify-between">
              <span className="eyebrow !text-[#d2fa75]">{p.n}</span>
              <ArrowUpRight size={20} className="text-white/25 transition duration-300 group-hover:rotate-45 group-hover:text-[#d2fa75]"/>
            </div>
            <div className="mt-16">
              <h3 className="text-2xl tracking-[-.04em] md:text-3xl">{p.title}</h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">{p.body}</p>
            </div>
            <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#d2fa75] transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true"/>
          </article>
        </Reveal>)}
      </div>
    </section>

    <Team/>

    <section className="flex justify-between border-t hairline px-5 py-20 md:px-8">
      <p className="eyebrow">Enigma Devs / 2026</p>
      <Link href="/#contact" className="link-arrow text-sm uppercase tracking-[.14em]">Let&apos;s talk <span>↗</span></Link>
    </section>
  </main>;
}
