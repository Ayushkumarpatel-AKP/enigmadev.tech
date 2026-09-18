import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const worlds=[
 {label:'FOR BUSINESSES', href:'/businesses', image:'/images/for-companies.svg', desc:'Intelligent software systems designed to turn complex operations, information and workflows into something people can actually use.', accent:'#d2fa75'},
 {label:'FOR EARTH', href:'/earth', image:'/images/for-earth.svg', desc:'Technology that observes, understands and helps protect the systems our planet depends on.', accent:'#d1a77b'},
 {label:'FOR THE PEOPLE', href:'/people', image:'/images/for-people.svg', desc:'Technology should become more accessible, more inclusive and more useful to the people who depend on it.', accent:'#c7b6f5'},
];
export function WorldExperience(){ return <section id="work" className="world-stack">{worlds.map((world,i)=><article className="world-panel" key={world.label}><Image className="world-image" src={world.image} alt={`${world.label} visual`} fill sizes="100vw" priority={i===0}/><div className="world-copy"><div className="flex justify-between"><p className="eyebrow">World 0{i+1}</p><p className="eyebrow">Enigma / 2026</p></div><Link href={world.href} className="group block"><h2 className="world-title whitespace-pre-line">{world.label.replace('FOR ','FOR\n')}</h2></Link><div className="world-bottom"><p className="world-description">{world.desc}</p><div className="flex flex-col items-start md:items-end gap-4"><span className="eyebrow">0{i+1} / 03</span><Link href={world.href} className="link-arrow text-sm uppercase tracking-[.14em]" style={{color:world.accent}}>Explore our work <ArrowUpRight size={16}/></Link></div></div></div></article>)}</section> }
