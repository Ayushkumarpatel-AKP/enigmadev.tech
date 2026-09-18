import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { CustomCursor } from '@/components/CustomCursor';

export const metadata: Metadata = { title:'Enigma Devs — Technology for Businesses, Earth & People', description:'Enigma Devs is a technology studio building AI-native software, custom digital systems, research platforms and hardware solutions for businesses, the Earth and people.', icons:{ icon:'/images/enigma-logo.svg', shortcut:'/images/enigma-logo.svg', apple:'/images/enigma-logo.svg' }, openGraph:{ title:'Enigma Devs', description:'Building technology with a reason.' } };
export default function RootLayout({ children }:{children:React.ReactNode}) { return <html lang="en"><body><div className="noise"/><Navbar/><CustomCursor/>{children}</body></html>; }
