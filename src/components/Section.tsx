import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function SectionHeading({
  title,
  eyebrow,
  subtitle,
  href,
  hrefLabel = "See all",
  id,
  align = "left",
}: {
  title: ReactNode;
  eyebrow?: string;
  subtitle?: ReactNode;
  href?: string;
  hrefLabel?: string;
  id?: string;
  align?: "left" | "center";
}) {
  return (
    <div id={id} className={`mb-8 flex scroll-mt-28 items-end justify-between gap-6 ${align === "center" ? "flex-col items-center text-center" : ""}`}>
      <div>
        {eyebrow && <div className="eyebrow mb-2 text-accent">{eyebrow}</div>}
        <h2 className="display text-3xl font-semibold sm:text-4xl" style={{ textWrap: "balance" }}>
          {title}
        </h2>
        {subtitle && <p className="mt-2 max-w-2xl text-base text-ink-soft">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:text-accent-deep">
          {hrefLabel} <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export function Chip({ children, active = false, className = "" }: { children: ReactNode; active?: boolean; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
        active ? "border-ink bg-ink text-paper" : "border-line bg-paper-card text-ink-soft"
      } ${className}`}
    >
      {children}
    </span>
  );
}
