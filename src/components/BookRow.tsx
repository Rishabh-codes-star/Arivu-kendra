import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Book } from "@/lib/types";
import { BookCard } from "@/components/BookCard";

export function BookRow({
  title,
  subtitle,
  books,
  href,
  hrefLabel = "See all",
  showOrg = true,
}: {
  title: string;
  subtitle?: string;
  books: Book[];
  href?: string;
  hrefLabel?: string;
  showOrg?: boolean;
}) {
  if (!books.length) return null;
  return (
    <section className="py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="display text-2xl font-semibold sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
        </div>
        {href && (
          <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:text-accent-deep">
            {hrefLabel} <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className="scroll-row -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 pt-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {books.map((b) => (
          <BookCard key={b.slug} book={b} showOrg={showOrg} />
        ))}
      </div>
    </section>
  );
}
