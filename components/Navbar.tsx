'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLenis } from '@/lib/lenis-store';

const LINKS = [
  { n: '01', label: 'Work', href: '/#work' },
  { n: '02', label: 'Capabilities', href: '/#capabilities' },
  { n: '03', label: 'About', href: '/about' },
  { n: '04', label: 'Contact', href: '/#contact' },
];

export function Navbar(){
  const [open,setOpen]=useState(false);

  // menu khula ho to peeche scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) getLenis()?.stop();
    else getLenis()?.start();
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return <>
    <header className="site-nav fixed top-0 left-0 right-0 z-30 px-5 md:px-8 py-5 mix-blend-difference">
      <nav className="flex items-center justify-between text-xs tracking-[.12em] uppercase">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-[.2em]">
          <Image src="/images/enigma-logo.svg" alt="Enigma Devs logo" width={26} height={26} className="rounded-sm object-cover" priority/>
          <span>Enigma Devs</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#work" className="transition-colors hover:text-[#82c8ff]">Work</Link>
          <Link href="/#capabilities" className="transition-colors hover:text-[#82c8ff]">Capabilities</Link>
          <Link href="/about" className="transition-colors hover:text-[#82c8ff]">About</Link>
          <Link href="/#contact" className="transition-colors hover:text-[#82c8ff]">Contact</Link>
        </div>
        <button aria-label="Open menu" onClick={()=>setOpen(true)} className="md:hidden flex h-11 w-11 items-center justify-center rounded-full border border-[#82c8ff]/60 text-[#82c8ff] shadow-[0_0_18px_rgba(130,200,255,.35)] transition hover:bg-[#82c8ff] hover:text-black hover:shadow-[0_0_28px_rgba(130,200,255,.65)]">
          <Menu size={17}/>
        </button>
      </nav>
    </header>

    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="site-menu fixed inset-0 z-40 flex flex-col bg-[#0a0a0a]/95 px-5 pb-8 pt-5 backdrop-blur-2xl md:hidden"
        >
          {/* top bar */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[.2em]">
              <Image src="/images/enigma-logo.svg" alt="Enigma Devs logo" width={26} height={26} className="rounded-sm object-cover"/>
              Enigma Devs
            </span>
            <button
              aria-label="Close menu"
              onClick={()=>setOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#82c8ff] text-[#82c8ff] shadow-[0_0_20px_rgba(130,200,255,.45)] transition hover:bg-[#82c8ff] hover:text-black hover:shadow-[0_0_32px_rgba(130,200,255,.75)]"
            >
              <X size={17}/>
            </button>
          </div>

          <p className="eyebrow mb-2 mt-10">Menu</p>

          {/* big links */}
          <nav className="flex flex-1 flex-col justify-center">
            {LINKS.map((l, i) => (
              <motion.div
                key={l.href + l.label}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.07, duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <Link
                  href={l.href}
                  onClick={()=>setOpen(false)}
                  className="group flex items-center gap-4 border-b hairline py-4"
                >
                  <span className="eyebrow !text-[#82c8ff]">{l.n}</span>
                  <span className="text-4xl font-medium tracking-[-.04em] text-white transition duration-300 group-hover:translate-x-1 group-hover:text-[#82c8ff] group-hover:[text-shadow:0_0_24px_rgba(130,200,255,.55)]">
                    {l.label}
                  </span>
                  <ArrowUpRight size={20} className="ml-auto text-white/25 transition duration-300 group-hover:text-[#82c8ff]" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* bottom contrast strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="border border-[#82c8ff]/25 bg-[#82c8ff]/[.06] p-4"
          >
            <p className="eyebrow mb-2">Start a conversation</p>
            <a href="mailto:enigma.devs22@gmail.com" className="text-sm normal-case tracking-normal text-white/85">
              enigma.devs22@gmail.com
            </a>
            <div className="mt-3 flex gap-5 border-t hairline pt-3 text-[11px] uppercase tracking-[.14em] text-white/55">
              <a href="https://www.linkedin.com/company/enigma-devs" target="_blank" rel="noreferrer" className="transition hover:text-[#82c8ff]">LinkedIn ↗</a>
              <a href="https://www.instagram.com/enigma.devs" target="_blank" rel="noreferrer" className="transition hover:text-[#82c8ff]">Instagram ↗</a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </>;
}
