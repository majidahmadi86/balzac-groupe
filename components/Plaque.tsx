type PlaqueProps = {
  className?: string;
  label?: string;
};

// Groupe Balzac plaque lockup, typeset as inline SVG: navy field,
// double gold border with notched corners, GROUPE / Balzac / tagline.
export function Plaque({ className, label = "Groupe Balzac" }: PlaqueProps) {
  const w = 300;
  const h = 104;
  const i = 7; // inner frame inset
  const r = 5; // corner notch radius

  const frame = [
    `M${i + r},${i}`,
    `H${w - i - r}`,
    `A${r},${r} 0 0 0 ${w - i},${i + r}`,
    `V${h - i - r}`,
    `A${r},${r} 0 0 0 ${w - i - r},${h - i}`,
    `H${i + r}`,
    `A${r},${r} 0 0 0 ${i},${h - i - r}`,
    `V${i + r}`,
    `A${r},${r} 0 0 0 ${i + r},${i}`,
    "Z",
  ].join(" ");

  const corners: Array<[number, number]> = [
    [i, i],
    [w - i, i],
    [w - i, h - i],
    [i, h - i],
  ];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={label}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={w} height={h} className="fill-navy" />
      <rect
        x="2"
        y="2"
        width={w - 4}
        height={h - 4}
        fill="none"
        strokeWidth="1.6"
        className="stroke-gold"
      />
      <path d={frame} fill="none" strokeWidth="0.9" className="stroke-gold" />
      {corners.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" fill="none" strokeWidth="0.8" className="stroke-gold" />
      ))}
      <g aria-hidden="true" textAnchor="middle" className="fill-cream-50">
        <text x={w / 2} y="29" fontSize="12.5" letterSpacing="3.8" fontWeight="500" className="font-serif">
          GROUPE
        </text>
        <text x={w / 2} y="72" fontSize="57" fontWeight="600" className="font-display">
          Balzac
        </text>
        <text
          x={w / 2}
          y="88.5"
          fontSize="7.8"
          fontWeight="500"
          textLength="236"
          lengthAdjust="spacing"
          className="font-serif"
        >
          CULTURE · PATRIMOINE · ART DE VIVRE
        </text>
      </g>
    </svg>
  );
}
