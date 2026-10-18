/**
 * Re-mounts on every league navigation, giving each page a short entrance
 * transition (disabled for reduced motion in newleague.css).
 */
export default function NewLeagueTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="nl-page-enter">{children}</div>;
}
