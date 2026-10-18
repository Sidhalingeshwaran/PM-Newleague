'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { cx } from '../lib/format';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Max vertical travel in px. */
  strength?: number;
}

/**
 * Image that drifts slightly against the scroll. Uses one passive scroll
 * listener per instance, throttled with rAF, active only while on screen.
 * Disabled under reduced motion via CSS (`.nl-parallax`).
 */
export default function ParallaxImage({
  src,
  alt,
  className,
  imageClassName,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority,
  strength = 28,
}: ParallaxImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let raf = 0;
    let active = false;

    const update = () => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress =
        (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      frame.style.setProperty(
        '--nl-parallax',
        `${(-progress * strength).toFixed(1)}px`
      );
    };
    const onScroll = () => {
      if (active && !raf) raf = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) onScroll();
    });
    observer.observe(frame);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <div ref={frameRef} className={cx('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cx('nl-parallax object-cover', imageClassName)}
      />
    </div>
  );
}
