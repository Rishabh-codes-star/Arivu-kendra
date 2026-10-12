"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Book, Organization } from "@/lib/types";
import { BookCard } from "@/components/BookCard";

type Sort = "trending" | "title" | "newest" | "rating";

export function Catalogue({
  books,
  orgs,
  genres,
  languages,
  ages,
}: {
  books: Book[];
  orgs: Organization[];
  genres: string[];
  languages: string[];
  ages: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const org = params.get("org") ?? "";
  const genre = params.get("genre") ?? "";
  const language = params.get("lang") ?? "";
  const age = params.get("age") ?? "";
  const sort = (params.get("sort") as Sort) ?? "trending";

  function set(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const orgName = (slug: string) => orgs.find((o) => o.slug === slug)?.name ?? "";
    let list = books.filter((b) => {
      if (org && b.org !== org) return false;
      if (genre && b.genre !== genre) return false;
      if (language && b.language !== language) return false;
      if (age && b.ageGroup !== age) return false;
      if (needle) {
        const hay = [b.title, b.titleLatin ?? "", b.subtitle ?? "", b.author, b.genre, b.language, orgName(b.org), ...b.tags].join(" ").toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    list = [...list];
    switch (sort) {
      case "title":
        list.sort((a, b) => (a.titleLatin ?? a.title).localeCompare(b.titleLatin ?? b.title));
        break;
      case "newest":
        list.sort((a, b) => b.year - a.year);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating || b.ratingsCount - a.ratingsCount);
        break;
      default:
        list.sort((a, b) => (a.trending ?? 99) - (b.trending ?? 99) || b.ratingsCount - a.ratingsCount);
    }
    return list;
  }, [books, orgs, q, org, genre, language, age, sort]);

  const activeCount = [org, genre, language, age].filter(Boolean).length;

  return (
    <div>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="eyebrow mb-2 text-accent">The library</div>
          <h1 className="display text-4xl font-semibold sm:text-5xl">All books</h1>
          <p className="mt-2 text-ink-soft">
            {results.length} of {books.length} books{q ? ` matching “${q}”` : ""}
          </p>
        </div>
        <form
          role="search"
          className="flex w-full items-center gap-2 rounded-full border border-line bg-paper-card p-1 pl-4 shadow-card md:w-96"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            set("q", String(fd.get("q") ?? ""));
          }}
        >
          <Search className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
          <input
            key={q}
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search titles, authors, tags"
            aria-label="Search books"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm placeholder:text-ink-faint focus:outline-none"
          />
          <button type="submit" className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper hover:bg-accent">
            Search
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-medium text-ink-faint">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" /> Filter
          </span>
          <Select label="Organization" value={org} onChange={(v) => set("org", v)} options={orgs.map((o) => [o.slug, o.shortName])} />
          <Select label="Genre" value={genre} onChange={(v) => set("genre", v)} options={genres.map((g) => [g, g])} />
          <Select label="Language" value={language} onChange={(v) => set("lang", v)} options={languages.map((l) => [l, l])} />
          <Select label="Age" value={age} onChange={(v) => set("age", v)} options={ages.map((a) => [a, a])} />
          {(activeCount > 0 || q) && (
            <button
              type="button"
              onClick={() => router.replace(pathname, { scroll: false })}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent-soft"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" /> Clear
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-ink-faint">Sort</span>
          {(
            [
              ["trending", "Trending"],
              ["rating", "Top rated"],
              ["newest", "Newest"],
              ["title", "A–Z"],
            ] as [Sort, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => set("sort", key === "trending" ? "" : key)}
              className={`rounded-full px-3 py-1.5 font-medium transition ${sort === key ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper-deep"}`}
              aria-pressed={sort === key}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {results.length ? (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {results.map((b) => (
            <BookCard key={b.slug} book={b} size="lg" />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-xl3 border-2 border-dashed border-line-strong p-16 text-center">
          <p className="display text-2xl font-semibold">Nothing on this shelf yet</p>
          <p className="mt-2 text-ink-soft">Try a different word, or clear the filters to see every book.</p>
        </div>
      )}
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${value ? "border-ink bg-ink text-paper" : "border-line bg-paper-card text-ink-soft hover:border-line-strong"}`}>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none bg-transparent pr-1 focus:outline-none" aria-label={label}>
        <option value="" className="text-ink">
          {label}
        </option>
        {options.map(([v, l]) => (
          <option key={v} value={v} className="text-ink">
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
