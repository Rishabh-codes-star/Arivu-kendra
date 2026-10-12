import type { Motif as MotifKind } from "@/lib/types";

/** Decorative SVG motifs used on organization banners until illustrations are generated. */
export function Motif({ motif, color, className = "" }: { motif: MotifKind; color: string; className?: string }) {
  const common = { className, "aria-hidden": true as const, fill: "none", stroke: color, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (motif) {
    case "stars":
      return (
        <svg viewBox="0 0 320 200" {...common}>
          {[
            [20, 30, 2], [60, 80, 1.4], [110, 25, 2.6], [150, 70, 1.2], [200, 40, 2], [240, 95, 1.6], [290, 30, 2.4], [40, 150, 1.5], [95, 170, 2.2], [170, 140, 1.3], [230, 160, 2.6], [300, 120, 1.4], [270, 185, 1.2], [135, 110, 1],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={color} stroke="none" />
          ))}
          <path d="M20 30 L60 80 L110 25 L150 70 L200 40" opacity="0.5" />
          <path d="M230 160 L300 120 L290 30" opacity="0.5" />
          <path d="M250 60 l6 0 m-3 -3 l0 6" />
          <circle cx="70" cy="130" r="14" opacity="0.6" />
          <path d="M56 130 a14 6 0 0 0 28 0" opacity="0.6" />
        </svg>
      );
    case "books":
      return (
        <svg viewBox="0 0 320 200" {...common}>
          <rect x="30" y="80" width="34" height="100" rx="3" />
          <rect x="70" y="60" width="30" height="120" rx="3" />
          <rect x="106" y="95" width="38" height="85" rx="3" transform="rotate(-10 125 137)" />
          <rect x="160" y="70" width="30" height="110" rx="3" />
          <rect x="196" y="90" width="34" height="90" rx="3" />
          <rect x="236" y="55" width="30" height="125" rx="3" />
          <line x1="20" y1="182" x2="300" y2="182" strokeWidth="3" />
          <line x1="85" y1="75" x2="85" y2="165" opacity="0.5" />
          <line x1="251" y1="70" x2="251" y2="165" opacity="0.5" />
        </svg>
      );
    case "leaves":
      return (
        <svg viewBox="0 0 320 200" {...common}>
          <path d="M40 180 C 80 100, 160 60, 280 40" />
          {[[90, 120], [130, 92], [175, 72], [220, 56]].map(([x, y], i) => (
            <g key={i}>
              <path d={`M${x} ${y} c -30 -5 -45 -30 -40 -55 c 25 5 45 25 40 55 z`} />
              <path d={`M${x} ${y} c 30 -5 45 -30 40 -55 c -25 5 -45 25 -40 55 z`} />
            </g>
          ))}
          <circle cx="270" cy="150" r="26" opacity="0.6" />
          <path d="M270 124 v52 M244 150 h52" opacity="0.4" />
        </svg>
      );
    case "kites":
      return (
        <svg viewBox="0 0 320 200" {...common}>
          <path d="M80 40 l40 40 l-40 60 l-40 -60 z" fill={color} fillOpacity="0.18" />
          <path d="M80 40 v100 M40 80 h80" opacity="0.6" />
          <path d="M80 140 c -10 20 10 30 -5 50" />
          <path d="M230 30 l34 34 l-34 50 l-34 -50 z" fill={color} fillOpacity="0.18" />
          <path d="M230 30 v84 M196 64 h68" opacity="0.6" />
          <path d="M230 114 c 10 20 -10 30 5 50" />
          <path d="M150 170 q 40 -20 80 0" opacity="0.5" />
          <circle cx="290" cy="150" r="3" fill={color} stroke="none" />
          <circle cx="20" cy="170" r="3" fill={color} stroke="none" />
        </svg>
      );
    case "pencil":
      return (
        <svg viewBox="0 0 320 200" {...common}>
          <path d="M40 160 L200 40 l24 24 L64 184 z" fill={color} fillOpacity="0.15" />
          <path d="M40 160 l-6 30 l30 -6" />
          <path d="M184 56 l24 24" />
          <rect x="230" y="40" width="60" height="80" rx="4" opacity="0.7" />
          <path d="M240 60 h40 M240 76 h40 M240 92 h26" opacity="0.7" />
          <circle cx="260" cy="160" r="18" opacity="0.6" />
          <path d="M248 160 l8 8 l16 -18" />
        </svg>
      );
    case "map":
      return (
        <svg viewBox="0 0 320 200" {...common}>
          <path d="M30 60 l80 -20 l80 20 l90 -20 v120 l-90 20 l-80 -20 l-80 20 z" fill={color} fillOpacity="0.12" />
          <path d="M110 40 v120 M190 60 v120" opacity="0.5" />
          <path d="M60 110 q 40 -40 80 0 t 80 0 t 60 -10" strokeDasharray="4 6" />
          <path d="M150 70 a12 12 0 1 1 24 0 c0 10 -12 22 -12 22 s-12 -12 -12 -22 z" fill={color} fillOpacity="0.5" />
          <path d="M240 120 a10 10 0 1 1 20 0 c0 8 -10 18 -10 18 s-10 -10 -10 -18 z" fill={color} fillOpacity="0.5" />
        </svg>
      );
    case "bridge":
      return (
        <svg viewBox="0 0 320 200" {...common}>
          <path d="M20 150 h280" strokeWidth="3" />
          <path d="M40 150 q 120 -130 240 0" />
          <path d="M70 150 q 90 -90 180 0" opacity="0.6" />
          {[70, 110, 150, 190, 230, 270].map((x) => (
            <line key={x} x1={x} y1="150" x2={x} y2={150 - (60 - Math.abs(160 - x) * 0.45)} opacity="0.7" />
          ))}
          <circle cx="60" cy="60" r="16" opacity="0.6" />
          <circle cx="270" cy="50" r="10" opacity="0.6" />
        </svg>
      );
    case "lantern":
      return (
        <svg viewBox="0 0 320 200" {...common}>
          <path d="M160 20 v20" />
          <path d="M130 40 h60 l10 14 h-80 z" fill={color} fillOpacity="0.2" />
          <path d="M126 54 h68 l-8 90 h-52 z" fill={color} fillOpacity="0.12" />
          <path d="M160 54 v90 M140 54 l4 90 M180 54 l-4 90" opacity="0.5" />
          <path d="M134 144 h52 l6 14 h-64 z" />
          <path d="M60 180 q 100 -40 200 0" opacity="0.5" />
          <circle cx="60" cy="90" r="3" fill={color} stroke="none" />
          <circle cx="260" cy="80" r="3" fill={color} stroke="none" />
          <circle cx="240" cy="130" r="2" fill={color} stroke="none" />
          <circle cx="90" cy="140" r="2" fill={color} stroke="none" />
        </svg>
      );
    case "rockets":
      return (
        <svg viewBox="0 0 320 200" {...common}>
          <path d="M160 20 c 30 40 30 90 0 130 c -30 -40 -30 -90 0 -130 z" />
          <circle cx="160" cy="80" r="12" />
          <path d="M140 110 l-20 30 l30 -10 M180 110 l20 30 l-30 -10" />
          <path d="M160 150 q 10 20 0 40 q -10 -20 0 -40" opacity="0.6" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 320 200" {...common}>
          <rect x="30" y="30" width="260" height="140" rx="16" strokeDasharray="8 8" opacity="0.7" />
          <path d="M120 100 h80 M160 60 v80" opacity="0.6" />
        </svg>
      );
  }
}
