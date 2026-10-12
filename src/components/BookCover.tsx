import type { Book } from "@/lib/types";
import { getOrg } from "@/lib/catalog";

/**
 * Procedural book cover. Every book gets a flat, designed cover from its palette
 * and style so the library looks like a shelf of real editions without any image assets.
 */
export function BookCover({ book, className = "", sizes = "md" }: { book: Book; className?: string; sizes?: "xs" | "sm" | "md" | "lg" | "xl" }) {
  const { bg, fg, accent, style } = book.cover;
  const org = getOrg(book.org);
  const titleScale = { xs: "text-[9px]", sm: "text-[11px]", md: "text-[15px]", lg: "text-[22px]", xl: "text-[30px]" }[sizes];
  const authorScale = { xs: "text-[6px]", sm: "text-[7px]", md: "text-[9px]", lg: "text-[12px]", xl: "text-[14px]" }[sizes];
  const pad = { xs: "p-1.5", sm: "p-2", md: "p-3", lg: "p-4", xl: "p-6" }[sizes];
  const isKannada = book.language === "Kannada";
  const titleFont = isKannada ? "font-kannada font-semibold" : "font-display font-semibold";
  // Styles with a large accent shape in the lower half keep all text at the top for contrast.
  const topStack = style === "arch" || style === "sun" || style === "block";
  const bottomStack = style === "circle";
  const authorAtBottom = !topStack;

  return (
    <div
      className={`relative aspect-[2/3] w-full overflow-hidden rounded-r-md rounded-l-[3px] spine ${className}`}
      style={{ background: bg, color: fg }}
      role="img"
      aria-label={`Cover of ${book.titleLatin ?? book.title}`}
    >
      {/* spine shading */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-black/25 via-black/5 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-[7%] w-px bg-white/15" />
      <CoverArt style={style} accent={accent} fg={fg} />
      <div className={`relative z-10 flex h-full flex-col ${pad} pl-[12%]`}>
        <div className={`${bottomStack ? "mt-auto" : ""}`}>
          <div className={`${titleFont} ${titleScale} leading-[1.05] tracking-tight`} style={{ textWrap: "balance" }}>
            {book.title}
          </div>
          {book.subtitle && sizes !== "xs" && sizes !== "sm" && (
            <div className={`${authorScale} mt-1 leading-snug opacity-80`}>{book.subtitle}</div>
          )}
          {!authorAtBottom && (
            <div className={`${authorScale} mt-2 leading-tight`}>
              <div className="opacity-90">{book.author}</div>
              {org && sizes !== "xs" && <div className="mt-0.5 uppercase tracking-[0.14em] opacity-60">{org.shortName}</div>}
            </div>
          )}
        </div>
        {authorAtBottom && (
          <div className={`${bottomStack ? "mt-2" : "mt-auto"} ${authorScale} leading-tight`}>
            <div className="opacity-90">{book.author}</div>
            {org && sizes !== "xs" && <div className="mt-0.5 uppercase tracking-[0.14em] opacity-60">{org.shortName}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function CoverArt({ style, accent, fg }: { style: Book["cover"]["style"]; accent: string; fg: string }) {
  const cls = "pointer-events-none absolute inset-0 h-full w-full";
  switch (style) {
    case "band":
      return (
        <svg className={cls} viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden="true">
          <rect x="0" y="178" width="200" height="54" fill={accent} opacity="0.92" />
          <rect x="0" y="236" width="200" height="4" fill={fg} opacity="0.25" />
        </svg>
      );
    case "block":
      return (
        <svg className={cls} viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden="true">
          <rect x="24" y="150" width="176" height="150" fill={accent} opacity="0.9" />
          <rect x="24" y="150" width="176" height="3" fill={fg} opacity="0.3" />
        </svg>
      );
    case "circle":
      return (
        <svg className={cls} viewBox="0 0 200 300" aria-hidden="true">
          <circle cx="150" cy="95" r="74" fill={accent} opacity="0.95" />
          <circle cx="150" cy="95" r="74" fill="none" stroke={fg} strokeOpacity="0.18" strokeWidth="2" />
        </svg>
      );
    case "stripe":
      return (
        <svg className={cls} viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden="true">
          <rect x="14" y="0" width="22" height="300" fill={accent} opacity="0.9" />
          <rect x="40" y="0" width="4" height="300" fill={accent} opacity="0.5" />
        </svg>
      );
    case "frame":
      return (
        <svg className={cls} viewBox="0 0 200 300" aria-hidden="true">
          <rect x="24" y="14" width="162" height="272" fill="none" stroke={accent} strokeWidth="2" />
          <rect x="31" y="21" width="148" height="258" fill="none" stroke={accent} strokeWidth="1" opacity="0.6" />
          <path d="M60 150 h90" stroke={accent} strokeWidth="1.5" opacity="0.8" />
        </svg>
      );
    case "sun":
      return (
        <svg className={cls} viewBox="0 0 200 300" aria-hidden="true">
          <circle cx="110" cy="300" r="110" fill={accent} opacity="0.95" />
          <circle cx="110" cy="300" r="84" fill="none" stroke={fg} strokeOpacity="0.2" strokeWidth="2" />
          <circle cx="110" cy="300" r="58" fill="none" stroke={fg} strokeOpacity="0.2" strokeWidth="2" />
        </svg>
      );
    case "stars":
      return (
        <svg className={cls} viewBox="0 0 200 300" aria-hidden="true">
          {[[40, 40, 2.2], [80, 24, 1.3], [130, 52, 2.8], [170, 30, 1.5], [60, 90, 1.2], [150, 110, 1.8], [100, 140, 1.1], [180, 160, 2.2], [50, 200, 1.4], [120, 230, 2.6], [160, 262, 1.3], [70, 270, 1.8]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={accent} />
          ))}
          <circle cx="100" cy="150" r="42" fill="none" stroke={accent} strokeWidth="1" opacity="0.6" />
          <circle cx="100" cy="150" r="56" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.35" />
        </svg>
      );
    case "grid":
      return (
        <svg className={cls} viewBox="0 0 200 300" aria-hidden="true">
          <defs>
            <pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0 H0 V20" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.4" />
            </pattern>
          </defs>
          <rect x="14" y="0" width="186" height="300" fill="url(#g)" />
          <rect x="120" y="190" width="60" height="60" fill={accent} opacity="0.9" />
        </svg>
      );
    case "arch":
      return (
        <svg className={cls} viewBox="0 0 200 300" aria-hidden="true">
          <path d="M40 300 V150 a60 60 0 0 1 120 0 V300 Z" fill={accent} opacity="0.92" />
          <path d="M52 300 V152 a48 48 0 0 1 96 0 V300" fill="none" stroke={fg} strokeOpacity="0.2" strokeWidth="2" />
        </svg>
      );
    default:
      return null;
  }
}
