import { ArrowDown } from 'lucide-react';

export function Hero(){
  return <section className="hero min-h-[100svh] flex flex-col justify-end px-5 md:px-8 pb-8 md:pb-10 pt-32">
    <img className="hero-image" src="/images/starry-sky.png" alt="The Milky Way over a dark mountain and forest" />
    <div className="hero-shade" aria-hidden="true" />
    <div className="hero-content">
      <div className="max-w-[1100px]"><p className="eyebrow mb-8">Independent technology studio / 2026</p><h1 className="display">ENIGMA<br/>DEVS</h1></div>
      <div className="mt-20 flex items-end justify-between border-t hairline pt-4"><p className="text-base md:text-xl tracking-[-.03em]">Technology for the systems that matter.</p><p className="eyebrow hidden md:block">Software · AI · Research · Hardware</p><span className="md:hidden text-[#d2fa75]"><ArrowDown size={16}/></span></div>
    </div>
  </section>
}
