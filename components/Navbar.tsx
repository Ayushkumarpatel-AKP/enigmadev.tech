'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export function Navbar(){ const [open,setOpen]=useState(false); return <header className="fixed top-0 left-0 right-0 z-30 px-5 md:px-8 py-5 mix-blend-difference"><nav className="flex items-center justify-between text-xs tracking-[.12em] uppercase"><Link href="/" className="flex items-center gap-3 font-semibold tracking-[.2em]"><Image src="/images/enigma-logo.svg" alt="Enigma Devs logo" width={26} height={26} className="rounded-sm object-cover" priority/><span>Enigma Devs</span></Link><div className="hidden md:flex items-center gap-8"><Link href="/#work">Work</Link><Link href="/#capabilities">Capabilities</Link><Link href="/about">About</Link><Link href="/#contact">Contact</Link></div><button aria-label="Toggle menu" onClick={()=>setOpen(!open)} className="md:hidden"><Menu size={18}/></button></nav>{open&&<div className="absolute right-4 top-14 w-48 border border-white/20 bg-black p-5 flex flex-col gap-5 text-xs uppercase tracking-[.12em]"><Link href="/#work" onClick={()=>setOpen(false)}>Work</Link><Link href="/#capabilities" onClick={()=>setOpen(false)}>Capabilities</Link><Link href="/about" onClick={()=>setOpen(false)}>About</Link><Link href="/#contact" onClick={()=>setOpen(false)}>Contact</Link></div>}</header> }
