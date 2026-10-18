import type { Team, TeamEmblem } from '../data/teams';

function starPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  points = 5
): string {
  const parts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / points) * i - Math.PI / 2;
    parts.push(
      `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(
        1
      )}`
    );
  }
  return `M${parts.join(' L')} Z`;
}

const EMBLEMS: Record<Exclude<TeamEmblem, 'eclipse'>, string> = {
  bolt: 'M56 16 L34 48 H49 L42 76 L68 40 H53 L60 16 Z',
  crown:
    'M26 64 L22 30 L38 44 L50 24 L62 44 L78 30 L74 64 Z M28 70 H72 V76 H28 Z',
  flame:
    'M50 14 C60 30 72 38 68 56 C66 68 58 76 50 76 C40 76 32 68 32 56 C32 44 40 40 42 28 C47 38 52 41 52 48 C57 41 57 30 50 14 Z',
  shuriken: 'M50 14 L57 40 L84 46 L57 53 L50 80 L43 53 L16 46 L43 40 Z',
  wing: 'M18 60 C28 34 52 20 84 20 C76 28 72 32 66 37 C73 37 78 37 84 35 C76 47 64 52 54 52 C61 54 66 57 69 60 C54 68 34 68 18 60 Z',
  wave: 'M16 54 C24 38 38 36 46 46 C51 53 59 52 62 44 C65 36 58 28 49 31 C61 20 82 28 80 47 C78 66 56 73 42 66 C33 62 28 55 16 54 Z',
  star: starPath(50, 47, 30, 13),
};

interface TeamCrestProps {
  team: Team;
  size?: number;
  className?: string;
  /** Decorative by default; pass a label when the crest is the only identifier. */
  label?: string;
}

/** Custom shield monogram built from each team's colours and emblem. */
export default function TeamCrest({
  team,
  size = 64,
  className,
  label,
}: TeamCrestProps) {
  const { primary, secondary } = team.colors;
  const id = `crest-${team.id}`;
  return (
    <svg
      viewBox="0 0 100 120"
      width={size}
      height={(size * 120) / 100}
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={secondary} />
          <stop offset="1" stopColor="#061426" />
        </linearGradient>
      </defs>
      <path
        d="M50 4 L94 17 V62 C94 88 73 106 50 116 C27 106 6 88 6 62 V17 Z"
        fill={`url(#${id}-fill)`}
        stroke={primary}
        strokeWidth="3"
      />
      <path
        d="M50 12 L86 23 V62 C86 83 69 98 50 107 C31 98 14 83 14 62 V23 Z"
        fill="none"
        stroke={primary}
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      {team.emblem === 'eclipse' ? (
        <g>
          <circle cx="50" cy="47" r="24" fill={primary} />
          <circle cx="60" cy="40" r="20" fill={secondary} />
        </g>
      ) : (
        <path
          d={EMBLEMS[team.emblem]}
          fill={primary}
          transform="translate(9 3) scale(0.82)"
        />
      )}
      <text
        x="50"
        y="95"
        textAnchor="middle"
        fill="#FFFFFF"
        style={{
          fontFamily: 'var(--nl-font-display), sans-serif',
          fontWeight: 900,
          fontSize: 19,
          letterSpacing: 1,
        }}
      >
        {team.code}
      </text>
    </svg>
  );
}
