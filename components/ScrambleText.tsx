'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}=+*#%@$&';

type ScrambleTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  trigger?: 'mount' | 'inView';
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div';
};

export function ScrambleText({
  text,
  className = '',
  delay = 0,
  duration = 900,
  trigger = 'mount',
  as = 'span',
}: ScrambleTextProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = as as any;
  const chars = text.split('');
  const [out, setOut] = useState(text);
  const ref = useRef<HTMLElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(text);
      return;
    }

    let raf = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let startTime = 0;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const reveal = Math.floor(progress * chars.length);
      setOut(
        chars
          .map((c, i) => {
            if (c === ' ' || c === '\n') return c;
            return i < reveal ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setOut(text);
    };

    const begin = () => {
      timeout = setTimeout(() => {
        raf = requestAnimationFrame(tick);
      }, delay);
    };

    if (trigger === 'inView') {
      const el = ref.current;
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !started.current) {
              started.current = true;
              begin();
              io.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      io.observe(el);
      return () => {
        io.disconnect();
        if (timeout) clearTimeout(timeout);
        cancelAnimationFrame(raf);
      };
    }

    begin();
    return () => {
      if (timeout) clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, delay, duration, trigger]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ position: 'relative', display: 'inline-block', whiteSpace: 'pre' }}
    >
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {out}
      </span>
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
