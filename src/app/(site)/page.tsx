import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/Section";
import { OrgGrid } from "@/components/OrgGrid";
import { BookListItem } from "@/components/BookCard";
import { Bookshelf } from "@/components/Bookshelf";
import { HeroIllustration } from "@/components/HeroArt";
import { HeroCopy } from "@/components/HeroCopy";

const numberWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
import { booksByOrg, getBooks, getOrgs, trendingBooks } from "@/lib/catalog";
import { heroImage, orgImage } from "@/lib/images";

export default function HomePage() {
  const orgs = getOrgs();
  const trending = trendingBooks(10);
  const all = getBooks();
  const hero = heroImage();
  const images = Object.fromEntries(orgs.map((o) => [o.slug, orgImage(o.slug)]));
  const counts = Object.fromEntries(orgs.map((o) => [o.slug, booksByOrg(o.slug).length]));
  const providers = orgs.filter((o) => !o.placeholder).length;

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="relative -mt-20 overflow-hidden pt-20">
        <div className="absolute inset-0 -z-10">
          {hero ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hero} alt="" className="h-full w-full object-cover object-center" />
              {/* Soft paper wash so the headline, subtitle and search bar always sit on a calm surface */}
              <div className="absolute inset-0 bg-[radial-gradient(62%_58%_at_50%_56%,rgba(247,242,233,0.96)_0%,rgba(247,242,233,0.82)_45%,rgba(247,242,233,0.35)_75%,rgba(247,242,233,0)_100%)]" />
              <div className="absolute inset-0 bg-gradient-to-b from-paper/70 via-transparent to-paper" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#f5e7c4_0%,#f7f2e9_55%,#ede5d6_100%)]" />
              <HeroIllustration className="absolute bottom-0 left-1/2 h-[70%] w-[160%] max-w-none -translate-x-1/2 opacity-70 sm:w-[120%] lg:w-full" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper" />
            </>
          )}
        </div>
        <Container className="relative flex min-h-[78vh] flex-col items-center justify-center py-20 text-center">
          <HeroCopy books={all.length} orgs={providers} />
        </Container>
      </section>

      {/* ───────── Organizations ───────── */}
      <section className="py-10 sm:py-14">
        <Container>
          <SectionHeading
            id="organizations"
            eyebrow="Partner organizations"
            title={`${numberWords[providers] ? numberWords[providers][0].toUpperCase() + numberWords[providers].slice(1) : providers} doors into the library`}
            subtitle="Each partner brings its own collection, from picture books to open-schooling courses. Pick a door and start reading."
            href="/organizations"
            hrefLabel="All organizations"
          />
          <OrgGrid orgs={orgs} images={images} counts={counts} />
        </Container>
      </section>

      {/* ───────── Trending ───────── */}
      <section className="py-10 sm:py-14">
        <Container>
          <SectionHeading
            id="trending"
            eyebrow="This week"
            title="Trending across Arivu Kendras"
            subtitle="The ten most opened books across Gram Panchayat libraries this week."
            href="/books?sort=trending"
            hrefLabel="Browse by popularity"
          />
          <ol className="grid gap-x-8 gap-y-2 md:grid-cols-2">
            {trending.map((b, i) => (
              <li key={b.slug}>
                <BookListItem book={b} rank={i + 1} />
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ───────── Accessibility ───────── */}
      <section id="accessibility" className="scroll-mt-28 py-10 sm:py-14">
        <Container>
          <div className="grid gap-5 rounded-xl3 border border-line bg-paper-card p-6 sm:grid-cols-3 sm:p-8">
            <Feature title="Read aloud" text="Every book can be read to you. Choose the voice and speed, and follow the highlighted text." />
            <Feature title="Reading tools" text="Highlight passages, magnify small print and look up a word in the dictionary without leaving the page." />
            <Feature title="Learn and discuss" text="Take a short quiz after reading and join the discussion with librarians, teachers and other readers." />
          </div>
        </Container>
      </section>

      {/* ───────── Whole library ───────── */}
      <section className="py-10 sm:py-14">
        <Container>
          <div className="flex flex-col items-center text-center">
            <div className="eyebrow mb-2 text-accent">The whole collection</div>
            <h2 className="display text-3xl font-semibold sm:text-4xl">Explore the whole library</h2>
            <p className="mt-2 max-w-xl text-ink-soft">Every book on one shelf. Hover to see a title, click to take it down.</p>
            <Link
              href="/books"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper shadow-card transition hover:bg-accent"
            >
              Browse all {all.length} books <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
        <div className="mx-auto mt-12 max-w-7xl px-2 sm:px-6 lg:px-8">
          <Bookshelf books={all} rows={2} />
        </div>
      </section>
    </>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
    </div>
  );
}
