'use client';
import { useEffect, useState } from 'react';
export function CustomCursor(){ const [pos,setPos]=useState({x:-100,y:-100}); useEffect(()=>{const m=(e:MouseEvent)=>setPos({x:e.clientX,y:e.clientY}); window.addEventListener('mousemove',m); return()=>window.removeEventListener('mousemove',m)},[]); return <div className="hidden lg:block fixed z-50 pointer-events-none w-3 h-3 rounded-full bg-[#d2fa75] mix-blend-difference" style={{left:pos.x-6,top:pos.y-6}}/> }
