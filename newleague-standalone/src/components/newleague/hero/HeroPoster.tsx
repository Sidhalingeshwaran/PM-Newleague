import { posterGeometry } from './courtScene';

/**
 * Static, server-rendered frame of the 3D arena. Visible before the canvas
 * mounts, when JavaScript is disabled, or if canvas rendering is unavailable.
 * Uses the same projection as the live scene so the hand-off is seamless.
 */
export default function HeroPoster() {
  const g = posterGeometry(1600, 900);

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${g.width} ${g.height}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="nl-poster-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#030B17" />
          <stop offset="0.55" stopColor="#061426" />
          <stop offset="1" stopColor="#0A1D35" />
        </linearGradient>
        <radialGradient id="nl-poster-halo">
          <stop offset="0" stopColor="#168BFF" stopOpacity="0.3" />
          <stop offset="1" stopColor="#168BFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={g.width} height={g.height} fill="url(#nl-poster-bg)" />
      <g
        stroke="#168BFF"
        strokeOpacity="0.35"
        strokeWidth="5"
        strokeLinecap="round"
      >
        {g.court.map(([x1, y1, x2, y2], i) => (
          <line key={`glow-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <g
        stroke="#EBF4FF"
        strokeOpacity="0.85"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        {g.court.map(([x1, y1, x2, y2], i) => (
          <line key={`line-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      {g.netTape && (
        <line
          x1={g.netTape[0]}
          y1={g.netTape[1]}
          x2={g.netTape[2]}
          y2={g.netTape[3]}
          stroke="#FFFFFF"
          strokeWidth="3"
        />
      )}
      <circle
        cx={g.width * 0.74}
        cy={g.height * 0.42}
        r={300}
        fill="url(#nl-poster-halo)"
      />
      <g strokeLinejoin="round">
        {g.shuttle.map((p, i) =>
          p.type === 'poly' ? (
            <polygon
              key={i}
              points={p.pts.map((q) => `${q.x},${q.y}`).join(' ')}
              fill={p.fill}
              stroke={p.stroke}
              strokeWidth={p.lineWidth}
            />
          ) : (
            <line
              key={i}
              x1={p.a.x}
              y1={p.a.y}
              x2={p.b.x}
              y2={p.b.y}
              stroke={p.stroke}
              strokeWidth={p.lineWidth}
            />
          )
        )}
      </g>
    </svg>
  );
}
