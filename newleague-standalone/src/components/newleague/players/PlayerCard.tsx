import type { Player } from '../data/players';
import type { Team } from '../data/teams';
import { cx, winRate } from '../lib/format';
import PlayerAvatar from '../ui/PlayerAvatar';

interface PlayerCardProps {
  player: Player;
  team: Team;
  /** Renders the action as a button (opens a profile) or a link. */
  action: React.ReactNode;
  headingLevel?: 'h2' | 'h3';
}

export default function PlayerCard({
  player,
  team,
  action,
  headingLevel = 'h3',
}: PlayerCardProps) {
  const Heading = headingLevel;
  const { matchesPlayed, wins } = player.stats;
  return (
    <article
      className={cx(
        'group relative flex h-full flex-col border bg-[#0A1D35]/80 transition-colors',
        player.isMvp
          ? 'border-[#F5C65D]/60'
          : 'border-white/10 hover:border-white/25'
      )}
      aria-labelledby={`player-${player.id}`}
    >
      <div className="relative">
        <PlayerAvatar
          player={player}
          team={team}
          className="aspect-[2/1] w-full sm:aspect-[5/4]"
        />
        {player.isMvp && (
          <span className="nl-display absolute right-3 top-3 bg-[#F5C65D] px-2 py-1 text-sm font-black text-[#061426]">
            Team MVP
          </span>
        )}
        <span
          className="absolute inset-x-0 bottom-0 h-1"
          style={{ background: team.colors.primary }}
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Heading
          id={`player-${player.id}`}
          className="text-[1.75rem] font-black"
        >
          {player.name}
        </Heading>
        <p className="mt-1 text-sm">
          <span
            className="font-semibold"
            style={{ color: team.colors.primary }}
          >
            {team.name}
          </span>
          <span className="text-[#AAB8CA]"> — {player.category}</span>
        </p>
        <dl className="mt-4 grid grid-cols-3 border-t border-white/10 pt-4 text-center">
          <div>
            <dt className="text-[11px] text-[#AAB8CA]">Played</dt>
            <dd className="nl-numeral text-2xl font-extrabold">
              {matchesPlayed}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] text-[#AAB8CA]">Won</dt>
            <dd className="nl-numeral text-2xl font-extrabold">{wins}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-[#AAB8CA]">Win rate</dt>
            <dd className="nl-numeral text-2xl font-extrabold">
              {winRate(wins, matchesPlayed)}%
            </dd>
          </div>
        </dl>
        <div className="mt-auto pt-5">{action}</div>
      </div>
    </article>
  );
}
