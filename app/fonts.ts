import localFont from 'next/font/local';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';

export const sans = localFont({
  src: [
    { path: '../public/fonts/Inter-Medium.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/Inter-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/Inter-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
});

export const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
});

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});
