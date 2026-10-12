"use client";

import { Languages } from "lucide-react";
import { useLang } from "@/components/LanguageProvider";

/** Circular icon-only toggle between the English and Kannada interface. */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, toggle, t } = useLang();
  const kannada = lang === "kn";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("nav.switch")}
      title={t("nav.switch")}
      aria-pressed={kannada}
      className={`group relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper-card/80 text-ink-soft shadow-card transition hover:border-line-strong hover:text-ink ${className}`}
    >
      <Languages className="h-[18px] w-[18px] transition-transform duration-500 ease-out-soft group-active:scale-90" aria-hidden="true" />
      <span
        aria-hidden="true"
        className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[9px] font-semibold leading-none text-paper ${kannada ? "" : "font-kannada"}`}
      >
        {kannada ? "A" : "ಕ"}
      </span>
    </button>
  );
}
