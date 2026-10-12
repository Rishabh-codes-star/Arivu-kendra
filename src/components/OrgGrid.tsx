import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Organization } from "@/lib/types";
import { Motif } from "@/components/Motif";

type Variant = "hero" | "half" | "wide" | "twothird" | "third" | "placeholder";

const layout: Variant[] = ["hero", "half", "half", "wide", "twothird", "third", "third", "twothird"];

const span: Record<Variant, string> = {
  hero: "md:col-span-6 min-h-[320px] md:min-h-[380px]",
  half: "md:col-span-3 min-h-[260px] md:min-h-[300px]",
  wide: "md:col-span-6 min-h-[200px] md:min-h-[220px]",
  twothird: "md:col-span-4 min-h-[260px] md:min-h-[280px]",
  third: "md:col-span-2 min-h-[260px] md:min-h-[280px]",
  placeholder: "md:col-span-3 min-h-[160px]",
};

export function OrgGrid({ orgs, images, counts }: { orgs: Organization[]; images: Record<string, string | null>; counts: Record<string, number> }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
      {orgs.map((org, i) => (
        <OrgBanner key={org.slug} org={org} variant={org.placeholder ? "placeholder" : layout[i] ?? "half"} image={images[org.slug]} count={counts[org.slug] ?? 0} />
      ))}
    </div>
  );
}

export function OrgBanner({ org, variant, image, count }: { org: Organization; variant: Variant; image: string | null | undefined; count: number }) {
  // Over an illustration the banner always carries a dark gradient, so text is always light.
  const light = !!image || org.ink === "light";
  const text = light ? "text-white" : "text-ink";
  const sub = light ? "text-white/80" : "text-ink-soft";
  const isHero = variant === "hero";
  const isWide = variant === "wide";

  return (
    <Link
      href={`/organizations/${org.slug}`}
      className={`group relative isolate flex overflow-hidden rounded-xl3 shadow-card transition duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-lift ${span[variant]} ${
        isWide ? "flex-row items-center" : "flex-col justify-end"
      }`}
      style={{ background: `linear-gradient(135deg, ${org.color} 0%, ${org.color2} 100%)` }}
    >
      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className={`absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-[1200ms] ease-out-soft group-hover:scale-[1.04] ${isWide ? "object-right" : ""}`}
          />
          <div
            className={`absolute inset-0 -z-10 ${isWide ? "bg-gradient-to-r from-black/75 via-black/40 to-black/5" : "bg-gradient-to-t from-black/80 via-black/35 to-black/5"}`}
          />
        </>
      ) : (
        <>
          <Motif
            motif={org.motif}
            color={light ? "rgba(255,255,255,0.9)" : "rgba(28,25,21,0.8)"}
            className={`absolute -z-10 opacity-60 transition-transform duration-700 ease-out-soft group-hover:scale-105 ${
              isWide ? "right-6 top-1/2 h-[150%] w-auto -translate-y-1/2" : isHero ? "right-6 top-6 h-[70%] w-auto" : "right-2 top-2 h-[55%] w-auto"
            }`}
          />
          <div className="paper-grain absolute inset-0 -z-10" />
        </>
      )}
      <div className={`relative ${isHero ? "p-7 sm:p-10" : "p-6"} ${isWide ? "max-w-xl" : ""}`}>
        <div className={`eyebrow ${sub}`}>{org.focus[0]}</div>
        <h3
          className={`display mt-2 font-semibold ${text} ${isHero ? "text-3xl sm:text-5xl" : isWide ? "text-2xl sm:text-3xl" : "text-2xl"}`}
          style={{ textWrap: "balance" }}
        >
          {org.name}
        </h3>
        <p className={`mt-2 max-w-md ${isHero ? "text-base sm:text-lg" : "text-sm"} ${sub}`}>{org.tagline}</p>
        <div className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium backdrop-blur ${light ? "bg-white/15 text-white" : "bg-ink/10 text-ink"}`}>
          {count} {count === 1 ? "book" : "books"}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
