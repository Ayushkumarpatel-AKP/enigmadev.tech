import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { EarthBackdrop } from '@/components/EarthBackdrop';
import { Reveal } from '@/components/Reveal';
import { ScrambleText } from '@/components/ScrambleText';

const ACCENT = '#d1a77b';

const capabilities = [
  ['SAR image analysis', 'Reading Synthetic Aperture Radar imagery of marine surfaces.'],
  ['Environmental preprocessing', 'Cleaning and normalising raw radar returns before inference.'],
  ['Computer vision inference', 'Models that look for patterns rather than single pixels.'],
  ['Deep learning classification', 'Separating oil-like signatures from the noise around them.'],
  ['Oil / non-oil separation', 'A binary call that has to survive real ocean conditions.'],
  ['False-positive analysis', 'Because a look-alike is not the same as a spill.'],
];

const steps = ['Satellite image', 'Preprocessing', 'AI model', 'Detection', 'Categorization'];

const facts = [
  ['02', 'Environmental intelligence'],
  ['06', 'Capabilities'],
  ['05', 'Stage pipeline'],
];

export default function Earth(){
  return <main className="relative">
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <EarthBackdrop/>
        <div className="absolute inset-0 bg-[#080808]/30"/>
      </div>
    </div>

    <div className="relative z-10">
      <section className="flex min-h-[100svh] flex-col justify-end px-5 pb-10 pt-32 md:px-8">
        <p className="eyebrow mb-8" style={{color:ACCENT}}>02 / Environmental intelligence</p>
        <h1 className="display" data-tid="earth-title">
          <span className="block"><ScrambleText text="FOR" duration={1100} delay={120}/></span>
          <span className="block"><ScrambleText text="EARTH" duration={1400} delay={340}/></span>
        </h1>
        <div className="mt-16 flex flex-col gap-8 border-t hairline pt-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-lg leading-tight text-white/75 md:text-2xl">Intelligence for understanding environmental systems at scale.</p>
          <p className="eyebrow shrink-0">Software · AI · Research · Hardware</p>
        </div>
      </section>

      <section className="px-5 py-28 md:px-8 md:py-40">
        <div className="mb-10 flex items-end justify-between border-b hairline pb-4">
          <p className="eyebrow">The problem</p>
          <p className="eyebrow">Scale</p>
        </div>
        <h2 className="display-sm max-w-5xl">
          <span className="block"><ScrambleText as="span" text="MILLIONS OF" trigger="inView"/></span>
          <span className="block text-white/35"><ScrambleText as="span" text="SQUARE KILOMETRES." trigger="inView" delay={110}/></span>
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-12 max-w-xl text-lg leading-tight text-white/60 md:text-2xl">Marine environments cannot be watched by hand. We explore how computer vision on satellite radar can surface the patterns worth a human looking at.</p>
        </Reveal>
      </section>

      <section className="px-5 pb-28 md:px-8 md:pb-36">
        <div className="mb-10 flex items-end justify-between border-b hairline pb-4">
          <p className="eyebrow">What we build</p>
          <p className="eyebrow">06 capabilities</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {capabilities.map(([title, body], i) => (
            <Reveal key={title} delay={i * 0.06} className="h-full">
              <article className="group flex h-full flex-col justify-between border hairline bg-white/[.02] p-6 transition-colors duration-500 hover:border-[#d1a77b]/60 hover:bg-white/[.05] md:p-7">
                <span className="eyebrow" style={{color:ACCENT}}>0{i + 1}</span>
                <div className="mt-14">
                  <h3 className="text-xl tracking-[-.04em] md:text-2xl">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t hairline px-5 py-28 md:px-8 md:py-40">
        <div className="mb-10 flex items-end justify-between border-b hairline pb-4">
          <p className="eyebrow">Featured build</p>
          <p className="eyebrow">Enigma Devs / 2026</p>
        </div>
        <Reveal>
          <h2 className="display-sm">OIL SPILL INTELLIGENCE</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-10 max-w-3xl text-xl leading-tight text-white/70 md:text-3xl">A computer vision pipeline exploring how Synthetic Aperture Radar imagery can help identify and categorize patterns associated with oil spills across marine environments.</p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-20 grid items-start gap-12 lg:grid-cols-[1.15fr_.85fr]">
            <div className="relative aspect-[4/3] overflow-hidden border hairline bg-white/[.03] md:aspect-auto md:min-h-[620px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/for-earth.svg" alt="Oil Spill Intelligence project visual" className="absolute inset-0 h-full w-full object-cover opacity-85"/>
            </div>
            <div>
              <p className="eyebrow mb-5">Capabilities</p>
              <ul className="border-t hairline">
                {['SAR image analysis','Oil / non-oil classification','Environmental preprocessing','Computer vision inference','Deep learning classification','False-positive analysis'].map((c) => (
                  <li key={c} className="flex items-center gap-4 border-b hairline py-4 text-sm text-white/70">
                    <span className="h-1 w-1 shrink-0 rounded-full" style={{background:ACCENT}}/>
                    {c}
                  </li>
                ))}
              </ul>
              <Link href="/#contact" className="link-arrow mt-10 inline-flex text-sm uppercase tracking-[.14em]" style={{color:ACCENT}}>
                Start a conversation <ArrowUpRight size={16}/>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="px-5 pb-28 md:px-8 md:pb-36">
        <div className="mb-10 flex items-end justify-between border-b hairline pb-4">
          <p className="eyebrow">The pipeline</p>
          <p className="eyebrow">Image → category</p>
        </div>
        <Reveal>
          <h2 className="display-sm mb-16 max-w-4xl">
            <span className="block"><ScrambleText as="span" text="FROM ORBIT" trigger="inView"/></span>
            <span className="block text-white/35"><ScrambleText as="span" text="TO ANSWER." trigger="inView" delay={110}/></span>
          </h2>
        </Reveal>
        <div className="relative">
          <div className="pipeline-line pipeline-earth absolute left-0 right-0 top-[13px] hidden h-px md:block" aria-hidden="true"/>
          <div className="grid gap-6 md:grid-cols-5 md:gap-3">
            {steps.map((s, i) => (
              <Reveal key={s} delay={i * 0.08}>
                <div className="relative border-t hairline pt-5 md:border-t-0">
                  <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border bg-[#080808] text-[10px]" style={{borderColor:ACCENT, color:ACCENT}}>0{i + 1}</span>
                  <p className="mt-5 text-lg tracking-[-.03em]">{s}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="mt-20 grid grid-cols-1 gap-8 border-t hairline pt-10 sm:grid-cols-3">
          {facts.map(([value, label], i) => (
            <Reveal key={label} delay={i * 0.06}>
              <div>
                <p className="stat-value">{value}</p>
                <p className="eyebrow mt-3">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 border-t hairline px-5 py-20 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="eyebrow">Enigma Devs / 2026</p>
          <p className="mt-3 text-2xl tracking-[-.03em] md:text-3xl">Building technology with a reason.</p>
        </div>
        <div className="flex flex-wrap gap-6">
          <Link href="/" className="link-arrow text-sm uppercase tracking-[.14em] text-white/60">All worlds</Link>
          <Link href="/#contact" className="link-arrow text-sm uppercase tracking-[.14em]" style={{color:ACCENT}}>Let&apos;s talk <ArrowUpRight size={16}/></Link>
        </div>
      </section>
    </div>
  </main>;
}
