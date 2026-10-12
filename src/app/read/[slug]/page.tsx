import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Reader } from "@/components/reader/Reader";
import { chapterPages, getBook, getBooks, getOrg, pdfPath } from "@/lib/catalog";

export function generateStaticParams() {
  return getBooks().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/read/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  return { title: book ? `Reading · ${book.titleLatin ?? book.title}` : "Reader" };
}

export default function ReadPage({ params }: PageProps<"/read/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <ReadContent params={params} />
    </Suspense>
  );
}

async function ReadContent({ params }: { params: PageProps<"/read/[slug]">["params"] }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  const org = getOrg(book.org);
  return (
    <Reader
        slug={book.slug}
        title={book.title}
        titleLatin={book.titleLatin}
        author={book.author}
        orgName={org?.name ?? ""}
        language={book.language}
        pdfUrl={pdfPath(book)}
        chapters={chapterPages(book)}
        bookHref={`/books/${book.slug}`}
      />
  );
}
