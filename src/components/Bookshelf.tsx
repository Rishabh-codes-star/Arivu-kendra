import Link from "next/link";
import type { Book } from "@/lib/types";

/**
 * A shelf of book spines. Spine width and height come from page count so the
 * shelf reads like a real one. Hover lifts the book; click opens it.
 */
export function Bookshelf({ books, rows = 2 }: { books: Book[]; rows?: number }) {
  const perRow = Math.ceil(books.length / rows);
  const shelves = Array.from({ length: rows }, (_, i) => books.slice(i * perRow, (i + 1) * perRow));
  return (
    <div className="space-y-2">
      {shelves.map((shelf, i) => (
        <Shelf key={i} books={shelf} />
      ))}
    </div>
  );
}

function Shelf({ books }: { books: Book[] }) {
  return (
    <div className="relative">
      <div className="scroll-row flex items-end gap-[3px] overflow-x-auto px-6 pt-10 sm:justify-center sm:px-10">
        {books.map((b, i) => (
          <Spine key={b.slug} book={b} index={i} />
        ))}
      </div>
      {/* shelf plank */}
      <div className="relative h-4 rounded-sm bg-gradient-to-b from-[#9a6a3c] via-[#7d5330] to-[#5e3c20] shadow-[0_10px_18px_-8px_rgba(28,25,21,0.6)]">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-white/20" />
      </div>
      <div className="h-6 bg-gradient-to-b from-black/10 to-transparent" />
    </div>
  );
}

function Spine({ book, index }: { book: Book; index: number }) {
  const { bg, fg, accent } = book.cover;
  const width = Math.max(26, Math.min(58, 22 + book.pages / 6));
  const height = Math.max(150, Math.min(220, 140 + book.pages / 3 + ((index * 37) % 23)));
  const lean = index % 7 === 3 ? "-rotate-3 origin-bottom-left" : index % 11 === 6 ? "rotate-2 origin-bottom-right" : "";
  return (
    <Link
      href={`/books/${book.slug}`}
      className={`group relative block shrink-0 rounded-[3px] spine transition-transform duration-300 ease-out-soft hover:-translate-y-4 hover:rotate-0 focus-visible:-translate-y-4 ${lean}`}
      style={{ width, height, background: bg, color: fg }}
      title={`${book.titleLatin ?? book.title} · ${book.author}`}
      aria-label={`${book.titleLatin ?? book.title} by ${book.author}`}
    >
      <div className="absolute inset-x-0 top-0 h-[6px] rounded-t-[3px]" style={{ background: accent }} />
      <div className="absolute inset-x-0 bottom-0 h-[6px] rounded-b-[3px]" style={{ background: accent }} />
      <div className="absolute inset-x-0 top-3 h-px bg-white/25" />
      <div className="absolute inset-x-0 bottom-3 h-px bg-white/25" />
      <div
        className={`absolute inset-0 flex items-center justify-center px-1 ${book.language === "Kannada" ? "font-kannada" : "font-display"} text-[11px] font-semibold leading-none`}
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        <span className="line-clamp-1 max-h-[80%] overflow-hidden text-ellipsis">{book.title}</span>
      </div>
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[30%] bg-gradient-to-r from-white/20 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-[25%] bg-gradient-to-l from-black/25 to-transparent" />
      <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-medium text-paper opacity-0 shadow-card transition group-hover:opacity-100">
        {book.titleLatin ?? book.title}
      </span>
    </Link>
  );
}
