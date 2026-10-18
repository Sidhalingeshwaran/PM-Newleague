/** League mark: a gold shuttlecock in a court-line square. */
export default function LeagueMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect
        x="1.5"
        y="1.5"
        width="45"
        height="45"
        fill="#0A1D35"
        stroke="#F5C65D"
        strokeWidth="1.5"
      />
      <line
        x1="1.5"
        y1="14"
        x2="46.5"
        y2="14"
        stroke="#F5C65D"
        strokeOpacity="0.35"
      />
      <line
        x1="24"
        y1="14"
        x2="24"
        y2="46.5"
        stroke="#F5C65D"
        strokeOpacity="0.35"
      />
      <g transform="rotate(-35 24 24)">
        <path d="M17 10 L31 10 L27.5 27 L20.5 27 Z" fill="#FFFFFF" />
        <path
          d="M19.5 10 L21.4 27 M24 10 L24 27 M28.5 10 L26.6 27"
          stroke="#0A1D35"
          strokeWidth="0.8"
        />
        <rect x="20.2" y="26.2" width="7.6" height="2.6" fill="#F5C65D" />
        <path
          d="M20.2 28.8 H27.8 C27.8 33 20.2 33 20.2 28.8 Z"
          fill="#F5C65D"
        />
      </g>
    </svg>
  );
}
