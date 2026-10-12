/** Small three-book illustration used in the hero pill. */
export function ThreeBooks({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 36" className={className} aria-hidden="true">
      <rect x="6" y="10" width="9" height="22" rx="1.5" fill="#2f4d8a" />
      <rect x="17" y="4" width="9" height="28" rx="1.5" fill="#3c6b4a" />
      <rect x="28" y="12" width="9" height="20" rx="1.5" fill="#c99a2e" transform="rotate(-10 32.5 22)" />
      <rect x="8" y="14" width="5" height="1.5" fill="#f7f2e9" opacity="0.7" />
      <rect x="19" y="8" width="5" height="1.5" fill="#f7f2e9" opacity="0.7" />
      <rect x="2" y="32" width="44" height="2.5" rx="1" fill="#1c1915" />
    </svg>
  );
}

/** Placeholder hero backdrop: a long reading-room shelf drawn in soft lines. Replaced by a generated image when available. */
export function HeroIllustration({ className = "" }: { className?: string }) {
  const palette = ["#b9471f", "#3c6b4a", "#c99a2e", "#2f4d8a", "#7a2e3b", "#1f6f78", "#d9674a", "#1e2a5a", "#b86e12", "#c2413f"];
  const rows = [0, 1, 2];
  return (
    <svg viewBox="0 0 1600 700" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7f2e9" stopOpacity="0" />
          <stop offset="1" stopColor="#f7f2e9" stopOpacity="1" />
        </linearGradient>
      </defs>
      {rows.map((r) => {
        const y = 140 + r * 190;
        let x = 40;
        const items: React.ReactNode[] = [];
        let i = 0;
        while (x < 1560) {
          const w = 18 + ((i * 13 + r * 7) % 26);
          const h = 90 + ((i * 29 + r * 11) % 70);
          const c = palette[(i + r * 3) % palette.length];
          items.push(
            <rect key={`${r}-${i}`} x={x} y={y + 150 - h} width={w} height={h} rx="2" fill={c} opacity={0.75} />,
            <rect key={`${r}-${i}-l`} x={x + 3} y={y + 150 - h + 8} width={w - 6} height="2" fill="#f7f2e9" opacity="0.5" />,
          );
          x += w + 3;
          i++;
          if (i % 9 === 0) x += 24;
        }
        return (
          <g key={r}>
            {items}
            <rect x="0" y={y + 150} width="1600" height="12" fill="#8a5a33" />
            <rect x="0" y={y + 162} width="1600" height="6" fill="#6b4323" opacity="0.6" />
          </g>
        );
      })}
      <rect x="0" y="0" width="1600" height="700" fill="url(#fade)" />
    </svg>
  );
}
