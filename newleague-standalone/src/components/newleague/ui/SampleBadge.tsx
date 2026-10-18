import { cx } from '../lib/format';

interface SampleBadgeProps {
  children?: React.ReactNode;
  className?: string;
}

/** Marks fictional/demo content so it is never mistaken for official data. */
export default function SampleBadge({
  children = 'Sample data',
  className,
}: SampleBadgeProps) {
  return (
    <span className={cx('nl-sample', className)}>
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <circle
          cx="5"
          cy="5"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeDasharray="2 1.5"
        />
      </svg>
      {children}
    </span>
  );
}
