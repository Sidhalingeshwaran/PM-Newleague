'use client';

import { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface CountUpProps {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

/**
 * Animated counter for demo statistics. Renders the final value on the
 * server (and for reduced motion) so the number is always correct and
 * readable; animates from zero only once it scrolls into view.
 */
export default function CountUp({
  value,
  duration = 1100,
  suffix = '',
  className,
}: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState<number | null>(null);

  useEffect(() => {
    if (!inView || reduced) return;
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value, duration]);

  const shown = display ?? value;
  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        {shown}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}
