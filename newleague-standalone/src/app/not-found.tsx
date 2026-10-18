import NewLeagueLayout from './(league)/layout';
import NewLeagueNotFound from './(league)/not-found';

/**
 * Unmatched URLs (e.g. /does-not-exist) render outside the (league) route
 * group, so this reuses the original league layout and not-found page to keep
 * the league header, footer and "Out of bounds" message.
 */
export default function RootNotFound() {
  return (
    <NewLeagueLayout>
      <NewLeagueNotFound />
    </NewLeagueLayout>
  );
}
