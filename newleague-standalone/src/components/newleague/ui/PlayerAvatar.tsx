import type { Player } from '../data/players';
import type { Team } from '../data/teams';
import { initials, cx } from '../lib/format';

interface PlayerAvatarProps {
  player: Player;
  team: Team;
  className?: string;
}

/**
 * Designed avatar used instead of photos (no real athlete imagery is used for
 * sample players). Team colours + half-court markings + initials.
 */
export default function PlayerAvatar({
  player,
  team,
  className,
}: PlayerAvatarProps) {
  const { primary, secondary } = team.colors;
  return (
    <div
      className={cx('relative overflow-hidden', className)}
      style={{
        background: `linear-gradient(160deg, ${secondary} 0%, #061426 85%)`,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <g fill="none" stroke={primary} strokeOpacity="0.28" strokeWidth="0.6">
          <rect x="8" y="8" width="84" height="120" />
          <line x1="8" y1="34" x2="92" y2="34" />
          <line x1="50" y1="34" x2="50" y2="100" />
          <line x1="16" y1="8" x2="16" y2="100" />
          <line x1="84" y1="8" x2="84" y2="100" />
        </g>
      </svg>
      <div
        className="absolute -right-6 -top-10 h-40 w-40 rounded-full blur-2xl"
        style={{ background: primary, opacity: 0.28 }}
      />
      <span
        className="nl-display absolute bottom-[6%] left-[8%] font-black leading-none"
        style={{ color: primary, fontSize: 'clamp(3rem, 9vw, 5.5rem)' }}
      >
        {initials(player.name)}
      </span>
    </div>
  );
}
