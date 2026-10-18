'use client';

import { useInView } from '../hooks/useInView';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms, for staggering a small group. */
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article';
}

/**
 * Fades content in once when it enters the viewport. Content is only hidden
 * when scripting is on and the visitor has not asked for reduced motion
 * (see `[data-reveal]` in newleague.css), so it is never lost.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      data-reveal={inView ? 'shown' : 'pending'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
