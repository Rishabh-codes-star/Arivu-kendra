import Link from "next/link";
import { Headphones } from "lucide-react";
import type { Book } from "@/lib/types";
import { BookCover } from "@/components/BookCover";
import { Rating } from "@/components/Rating";
import { getOrg } from "@/lib/catalog";

export function BookCard({ book, size = "md", showOrg = true, rank }: { book: Book; size?: "sm" | "md" | "lg"; showOrg?: boolean; rank?: number }) {
  const org = getOrg(book.org);
  const width = { sm: "w-32", md: "w-40", lg: "w-full" }[size];
  return (
    <Link
      href={`/books/${book.slug}`}
      className={`group block ${size === "lg" ? "" : width} shrink-0 snap-start`}
      aria-label={`${book.titleLatin ?? book.title} by ${book.author}`}
    >
      <div className="relative transition-transform duration-500 ease-out-soft group-hover:-translate-y-1.5 group-hover:[transform:perspective(900px)_rotateY(-6deg)_translateY(-6px)]">
        <BookCover book={book} sizes={size === "sm" ? "sm" : "md"} className="transition-shadow duration-500 group-hover:shadow-lift" />
        {rank && (
          <span className="display absolute -left-2 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-semibold text-paper shadow-card">
            {rank}
          </span>
        )}
        {book.hasAudio && (
          <span className="absolute bottom-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-paper/90 text-ink shadow-card" title="Audio edition available">
            <Headphones className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="mt-3 space-y-0.5">
        <h3 className={`${book.language === "Kannada" ? "font-kannada" : "font-display"} line-clamp-2 text-[15px] font-semibold leading-snug text-ink`}>{book.title}</h3>
        <p className="line-clamp-1 text-xs text-ink-soft">{book.author}</p>
        <p className="line-clamp-1 text-[11px] text-ink-faint">
          {book.genre} · {book.ageGroup}
          {showOrg && org ? ` · ${org.shortName}` : ""}
        </p>
        <Rating value={book.rating} />
      </div>
    </Link>
  );
}

export function BookListItem({ book, rank }: { book: Book; rank?: number }) {
  const org = getOrg(book.org);
  return (
    <Link
      href={`/books/${book.slug}`}
      className="group flex items-start gap-4 rounded-xl2 p-3 transition hover:bg-paper-card hover:shadow-card"
    >
      {rank && <span className="display w-6 shrink-0 pt-1 text-right text-lg font-semibold text-ink-faint">{rank}</span>}
      <div className="w-16 shrink-0 transition-transform duration-500 ease-out-soft group-hover:-translate-y-1">
        <BookCover book={book} sizes="xs" />
      </div>
      <div className="min-w-0 flex-1 py-0.5">
        <h3 className={`${book.language === "Kannada" ? "font-kannada" : "font-display"} line-clamp-2 text-base font-semibold leading-snug`}>{book.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-ink-soft">{book.author}</p>
        <p className="mt-1 line-clamp-1 text-xs text-ink-faint">
          {book.genre} · {book.language} · {book.ageGroup}
          {org ? ` · ${org.shortName}` : ""}
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          <Rating value={book.rating} />
          {book.hasAudio && (
            <span className="inline-flex items-center gap-1 text-[11px] text-ink-faint">
              <Headphones className="h-3 w-3" aria-hidden="true" /> Audio
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
