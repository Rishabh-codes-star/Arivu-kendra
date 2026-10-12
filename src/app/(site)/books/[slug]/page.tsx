import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Download, Headphones, ChevronRight, Accessibility, FileText } from "lucide-react";
import { Container, Chip } from "@/components/Section";
import { BookCover } from "@/components/BookCover";
import { BookRow } from "@/components/BookRow";
import { InfoStrip } from "@/components/InfoStrip";
import { Rating } from "@/components/Rating";
import { Quiz } from "@/components/Quiz";
import { Discussion } from "@/components/Discussion";
import { AudioCard } from "@/components/AudioCard";
import { PdfPreview } from "@/components/PdfPreview";
import { Expandable } from "@/components/Expandable";
import { PageSkeleton } from "@/components/PageSkeleton";
import {
  chapterPages,
  fileSizeLabel,
  getBook,
  getBooks,
  getOrg,
  moreFromOrg,
  pdfPath,
  ratingBreakdown,
  reviewsFor,
  similarBooks,
  youMightAlsoLike,
} from "@/lib/catalog";

export function generateStaticParams() {
  return getBooks().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/books/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  return { title: book ? book.titleLatin ?? book.title : "Book", description: book?.description };
}

export default function BookPage({ params }: PageProps<"/books/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <BookContent params={params} />
    </Suspense>
  );
}

async function BookContent({ params }: { params: PageProps<"/books/[slug]">["params"] }) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();
  const org = getOrg(book.org)!;
  const pdf = pdfPath(book);
  const breakdown = ratingBreakdown(book);
  const reviews = reviewsFor(book);
  const chapters = chapterPages(book);
  const titleFont = book.language === "Kannada" ? "font-kannada" : "display";

  return (
    <>
      {/* ───────── Masthead ───────── */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: `linear-gradient(180deg, ${book.cover.bg}22 0%, transparent 70%)` }} />
        <Container className="py-10 sm:py-14">
          <nav className="mb-8 flex items-center gap-1 text-xs text-ink-faint" aria-label="Breadcrumb">
            <Link href="/books" className="hover:text-ink">Library</Link>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <Link href={`/organizations/${org.slug}`} className="hover:text-ink">{org.shortName}</Link>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <span className="text-ink-soft">{book.genre}</span>
          </nav>
          <div className="grid gap-10 md:grid-cols-[220px_1fr] md:gap-14 lg:grid-cols-[280px_1fr]">
            <div className="mx-auto w-56 md:mx-0 md:w-full">
              <div className="[transform:perspective(1200px)_rotateY(14deg)] transition-transform duration-700 ease-out-soft hover:[transform:perspective(1200px)_rotateY(4deg)]">
                <BookCover book={book} sizes="xl" className="shadow-lift" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/organizations/${org.slug}`}>
                  <Chip>
                    <span className="inline-block h-2 w-2 rounded-full" style={{ background: org.color }} /> {org.name}
                  </Chip>
                </Link>
                <Link href={`/books?genre=${encodeURIComponent(book.genre)}`}>
                  <Chip>{book.genre}</Chip>
                </Link>
                {book.trending && <Chip active>#{book.trending} trending</Chip>}
              </div>
              <h1 className={`${titleFont} mt-5 text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl`} style={{ textWrap: "balance" }}>
                {book.title}
              </h1>
              {book.titleLatin && <p className="mt-2 text-lg text-ink-soft">{book.titleLatin}</p>}
              {book.subtitle && <p className="display-italic mt-2 text-xl text-ink-soft sm:text-2xl">{book.subtitle}</p>}
              <p className="mt-4 text-base text-ink-soft">
                By <span className="font-medium text-ink">{book.author}</span>
                {book.illustrator && (
                  <>
                    {" "}· Illustrated by <span className="font-medium text-ink">{book.illustrator}</span>
                  </>
                )}
                {" "}· {book.year}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={`/read/${book.slug}`}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper shadow-card transition hover:bg-ink-mid"
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" /> Read now
                </a>
                <a
                  href={`/read/${book.slug}?listen=1`}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-card px-5 py-3 text-sm font-medium text-ink shadow-card transition hover:border-line-strong"
                >
                  <Headphones className="h-4 w-4" aria-hidden="true" /> {book.hasAudio ? "Listen" : "Read aloud"}
                </a>
                <a
                  href={pdf}
                  download
                  className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-ink-soft transition hover:bg-paper-deep hover:text-ink"
                >
                  <Download className="h-4 w-4" aria-hidden="true" /> PDF · {fileSizeLabel(book)}
                </a>
              </div>
              <p className="mt-3 text-xs text-ink-faint">Opens in a new tab · {book.license} · Free to read and share</p>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        {/* ───────── Info strip ───────── */}
        <InfoStrip
          items={[
            { label: `${book.ratingsCount.toLocaleString()} ratings`, value: book.rating.toFixed(1), sub: <Rating value={book.rating} showValue={false} /> },
            { label: "Age", value: book.ageGroup, sub: book.ageGroup === "All ages" ? "Everyone" : "Years" },
            { label: "Language", value: book.language === "Kannada" ? <span className="font-kannada">ಕನ್ನಡ</span> : book.language === "Hindi" ? "हिन्दी" : "EN", sub: book.language },
            { label: "Length", value: book.pages, sub: `pages · ${formatMinutes(book.readingTime)}` },
            { label: "Organization", value: org.shortName, sub: org.focus[0] },
            { label: "Format", value: book.hasAudio ? "PDF + Audio" : "PDF", sub: fileSizeLabel(book) },
          ]}
        />

        {/* ───────── Preview ───────── */}
        <section className="py-12">
          <h2 className="display mb-6 text-2xl font-semibold sm:text-3xl">Look inside</h2>
          <PdfPreview src={pdf} readHref={`/read/${book.slug}`} />
        </section>

        {/* ───────── About + details ───────── */}
        <section className="grid gap-10 border-t border-line py-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="min-w-0">
            <Expandable className="font-serif text-[17px] leading-relaxed text-ink-soft" collapsedLines={4}>
              <p>{book.description}</p>
            </Expandable>
            {book.editorsNote && (
              <div className="mt-8 rounded-xl3 bg-paper-deep/70 p-6">
                <div className="eyebrow text-ink-faint">Librarians&apos; note</div>
                <p className="mt-2 font-serif text-[16px] leading-relaxed">{book.editorsNote}</p>
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              {book.tags.map((t) => (
                <Link key={t} href={`/books?q=${encodeURIComponent(t)}`}>
                  <Chip>#{t}</Chip>
                </Link>
              ))}
            </div>
          </div>
          <div className="min-w-0 space-y-6">
            <AudioCard book={book} />
            <div className="rounded-xl3 border border-line bg-paper-card p-6">
              <h3 className="display text-lg font-semibold">Contents</h3>
              <ol className="mt-4 divide-y divide-line text-sm">
                {chapters.map((c, i) => (
                  <li key={c.title + i}>
                    <a href={`/read/${book.slug}?page=${c.page}`} target="_blank" rel="noopener" className="flex items-center justify-between gap-4 py-2.5 hover:text-accent">
                      <span className={`${book.language === "Kannada" ? "font-kannada" : ""} line-clamp-1`}>
                        <span className="mr-2 text-ink-faint">{i + 1}.</span>
                        {c.title}
                      </span>
                      <span className="shrink-0 text-xs text-ink-faint">p. {c.page}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ───────── Ratings ───────── */}
        <section className="border-t border-line py-12">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="display text-2xl font-semibold sm:text-3xl">Ratings &amp; reviews</h2>
            <span className="text-sm text-ink-faint">{book.ratingsCount.toLocaleString()} ratings</span>
          </div>
          <div className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-14">
            <div className="flex items-end gap-6">
              <div>
                <div className="display text-7xl font-semibold leading-none">{book.rating.toFixed(1)}</div>
                <div className="mt-1 text-sm text-ink-faint">out of 5</div>
              </div>
              <dl className="w-48 space-y-1.5">
                {breakdown.map((n, i) => {
                  const stars = 5 - i;
                  const pct = Math.round((n / book.ratingsCount) * 100);
                  return (
                    <div key={stars} className="flex items-center gap-2 text-[11px] text-ink-faint">
                      <dt className="w-8 text-right">{"★".repeat(stars)}</dt>
                      <dd className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-dark">
                        <div className="h-full rounded-full bg-ink-soft" style={{ width: `${pct}%` }} />
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {reviews.map((r) => (
                <article key={r.author + r.title} className="rounded-xl3 bg-paper-deep/60 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold">{r.title}</h3>
                    <span className="shrink-0 text-xs text-ink-faint">{r.when}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <Rating value={r.rating} showValue={false} />
                    <span className="text-xs text-ink-faint">{r.author} · {r.role}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{r.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── Quiz ───────── */}
        <section id="quiz" className="scroll-mt-28 border-t border-line py-12">
          <div className="mb-6">
            <div className="eyebrow mb-1 text-accent">After reading</div>
            <h2 className="display text-2xl font-semibold sm:text-3xl">Did it stick? A short quiz</h2>
            <p className="mt-1 text-sm text-ink-soft">Three questions, no marks kept. Just a way to check what you remember.</p>
          </div>
          <Quiz questions={book.quiz} />
        </section>

        {/* ───────── Discussion ───────── */}
        <section id="discussion" className="scroll-mt-28 border-t border-line py-12">
          <div className="mb-6">
            <div className="eyebrow mb-1 text-accent">Discussion</div>
            <h2 className="display text-2xl font-semibold sm:text-3xl">Readers on this book</h2>
            <p className="mt-1 text-sm text-ink-soft">Librarians, teachers, students and parents across Karnataka. Be kind, be specific.</p>
          </div>
          <Discussion posts={book.discussion} bookSlug={book.slug} />
        </section>

        {/* ───────── Accessibility + information ───────── */}
        <section className="grid gap-8 border-t border-line py-12 lg:grid-cols-2">
          <div className="rounded-xl3 border border-line bg-paper-card p-6">
            <h2 className="display flex items-center gap-2 text-xl font-semibold">
              <Accessibility className="h-5 w-5 text-ink-soft" aria-hidden="true" /> Accessibility
            </h2>
            <ul className="mt-4 grid gap-3 text-sm text-ink-soft sm:grid-cols-2">
              <li className="flex gap-2"><span className="text-ink-soft">✓</span> Screen reader friendly text layer</li>
              <li className="flex gap-2"><span className="text-ink-soft">✓</span> Read aloud with adjustable speed</li>
              <li className="flex gap-2"><span className="text-ink-soft">✓</span> Magnifier and zoom up to 400%</li>
              <li className="flex gap-2"><span className="text-ink-soft">✓</span> Keyboard navigation in the reader</li>
              <li className="flex gap-2"><span className="text-ink-soft">✓</span> Dictionary lookup on any word</li>
              <li className="flex gap-2"><span className="text-ink-soft">✓</span> Downloadable for offline reading</li>
            </ul>
          </div>
          <div className="rounded-xl3 border border-line bg-paper-card p-6">
            <h2 className="display flex items-center gap-2 text-xl font-semibold">
              <FileText className="h-5 w-5 text-ink-soft" aria-hidden="true" /> Information
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
              <Info label="Provider" value={org.name} />
              <Info label="Published" value={String(book.year)} />
              <Info label="Category" value={book.genre} />
              <Info label="Language" value={book.language} />
              <Info label="Age rating" value={book.ageGroup} />
              <Info label="Size" value={fileSizeLabel(book)} />
              <Info label="Licence" value={book.license} />
              {book.isbn && <Info label="ISBN" value={book.isbn} />}
              <Info label="Formats" value={book.hasAudio ? "PDF, Audio" : "PDF"} />
            </dl>
          </div>
        </section>

        {/* ───────── Related ───────── */}
        <div className="border-t border-line">
          <BookRow title={`More in ${book.genre}`} books={similarBooks(book)} href={`/books?genre=${encodeURIComponent(book.genre)}`} />
          <BookRow title={`More from ${org.shortName}`} books={moreFromOrg(book)} href={`/organizations/${org.slug}`} showOrg={false} />
          <BookRow title="You might also like" books={youMightAlsoLike(book)} />
        </div>
      </Container>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow text-ink-faint">{label}</dt>
      <dd className="mt-1 text-ink">{value}</dd>
    </div>
  );
}

function formatMinutes(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
