'use client';

import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrambleText } from '@/components/ScrambleText';
import { RotatingWord } from '@/components/RotatingWord';

const EASE = [0.2, 0.7, 0.2, 1] as const;

export function Hero(){
  return <section className="hero min-h-[100svh] flex flex-col justify-end px-5 md:px-8 pb-8 md:pb-10 pt-32">
    <video className="hero-image" src="/videos/enigma-hero.webm" poster="/images/starry-sky.png" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
    <div className="hero-shade" aria-hidden="true" />
    <div className="hero-content">
      <div className="max-w-[1100px]">
        <motion.p className="eyebrow mb-8" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.7,ease:EASE}}>Independent technology studio / 2026</motion.p>
        <h1 className="display" data-tid="hero-title">
          <span className="block"><ScrambleText text="ENIGMA" duration={1300} delay={120}/></span>
          <span className="block"><ScrambleText text="DEVS" duration={1300} delay={420}/></span>
        </h1>
      </div>
      <motion.div className="mt-20 flex items-end justify-between border-t hairline pt-4" initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.65,ease:EASE}}>
        <p className="text-base md:text-xl tracking-[-.03em]" data-tid="hero-tag">Technology for the <RotatingWord words={['systems','businesses','the planet','people']}/> that matter.</p>
        <p className="eyebrow hidden md:block">Software · AI · Research · Hardware</p>
        <span className="md:hidden text-[#d2fa75]"><ArrowDown size={16}/></span>
      </motion.div>
      <motion.div className="mt-8 hidden md:flex items-center gap-3 text-white/45" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.8,delay:1.1,ease:EASE}} aria-hidden="true">
        <span className="eyebrow">Scroll</span>
        <motion.span className="h-px w-16 bg-white/30" animate={{scaleX:[0.3,1,0.3],opacity:[0.3,1,0.3]}} transition={{duration:2.4,repeat:Infinity,ease:'easeInOut'}} style={{transformOrigin:'left'}}/>
      </motion.div>
    </div>
  </section>
}
