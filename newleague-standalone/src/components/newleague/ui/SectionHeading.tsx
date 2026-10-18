import { cx } from '../lib/format';

interface SectionHeadingProps {
  id?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  as?: 'h2' | 'h3';
}

export default function SectionHeading({
  id,
  title,
  intro,
  action,
  className,
  as: Tag = 'h2',
}: SectionHeadingProps) {
  return (
    <div
      className={cx(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className="max-w-2xl">
        <Tag id={id} className="text-[clamp(2.4rem,6vw,4.5rem)] font-black">
          {title}
        </Tag>
        {intro && (
          <div className="mt-4 max-w-xl text-base leading-relaxed text-[#AAB8CA]">
            {intro}
          </div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
