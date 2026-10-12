"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Ear, Languages } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { ThreeBooks } from "@/components/HeroArt";
import { useLang } from "@/components/LanguageProvider";

/** Hero headline block. Client-side so the language toggle can switch its copy. */
export function HeroCopy({ books, orgs }: { books: number; orgs: number }) {
  const { t, lang } = useLang();
  const kn = lang === "kn";
  return (
    <>
      <Link
        href="#trending"
        className="group inline-flex items-center gap-3 rounded-full border border-line bg-paper-card/80 px-4 py-2 text-sm font-medium text-ink shadow-card backdrop-blur transition hover:border-line-strong"
      >
        <ThreeBooks className="h-7 w-9" />
        <span className={kn ? "font-kannada" : ""}>{t("hero.pill")}</span>
        <ArrowRight className="h-4 w-4 text-ink-soft transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
      <h1
        className={`mt-7 max-w-4xl font-semibold ${kn ? "font-kannada text-4xl leading-tight sm:text-5xl lg:text-6xl" : "display text-5xl sm:text-6xl lg:text-7xl"}`}
        style={{ textWrap: "balance" }}
      >
        {t("hero.title1")} <span className={kn ? "text-ink-soft" : "display-italic text-accent"}>{t("hero.title2")}</span>
      </h1>
      <p className={`mt-6 max-w-2xl text-lg text-ink-soft sm:text-xl ${kn ? "font-kannada" : ""}`}>{t("hero.subtitle")}</p>
      <div className="mt-9 w-full max-w-2xl">
        <SearchBar placeholder={t("hero.placeholder")} buttonLabel={t("hero.search")} />
      </div>
      <div className={`mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-soft ${kn ? "font-kannada" : ""}`}>
        <span className="inline-flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-ink-soft" aria-hidden="true" /> {t("hero.books", { books, orgs })}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Ear className="h-4 w-4 text-ink-soft" aria-hidden="true" /> {t("hero.readAloud")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Languages className="h-4 w-4 text-ink-soft" aria-hidden="true" /> <span className="font-kannada">ಕನ್ನಡ</span> · हिन्दी · English
        </span>
      </div>
    </>
  );
}
