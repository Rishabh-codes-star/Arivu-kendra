import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { Container, Chip } from "@/components/Section";
import { Motif } from "@/components/Motif";
import { BookCard } from "@/components/BookCard";
import { PageSkeleton } from "@/components/PageSkeleton";
import { booksByOrg, getOrg, getOrgs } from "@/lib/catalog";
import { orgImage } from "@/lib/images";

export function generateStaticParams() {
  return getOrgs().map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: PageProps<"/organizations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const org = getOrg(slug);
  return { title: org ? org.name : "Organization" };
}

export default function OrganizationPage({ params }: PageProps<"/organizations/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton hero />}>
      <OrganizationContent params={params} />
    </Suspense>
  );
}

async function OrganizationContent({ params }: { params: PageProps<"/organizations/[slug]">["params"] }) {
  const { slug } = await params;
  const org = getOrg(slug);
  if (!org) notFound();
  const books = booksByOrg(org.slug);
  const image = orgImage(org.slug);
  const light = !!image || org.ink === "light";
  const genres = Array.from(new Set(books.map((b) => b.genre)));

  return (
    <>
      <section
        className="relative isolate overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${org.color} 0%, ${org.color2} 100%)` }}
      >
        {image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
          </>
        ) : (
          <>
            <Motif motif={org.motif} color={light ? "rgba(255,255,255,0.85)" : "rgba(28,25,21,0.75)"} className="absolute right-0 top-1/2 -z-10 h-[140%] w-auto -translate-y-1/2 opacity-50" />
            <div className="paper-grain absolute inset-0 -z-10" />
          </>
        )}
        <Container className={`py-16 sm:py-24 ${light ? "text-white" : "text-ink"}`}>
          <div className="max-w-2xl">
            <div className={`eyebrow ${light ? "text-white/80" : "text-ink-soft"}`}>{org.placeholder ? "Reserved slot" : "Partner organization"}</div>
            <h1 className="display mt-3 text-4xl font-semibold sm:text-6xl" style={{ textWrap: "balance" }}>
              {org.name}
            </h1>
            <p className={`mt-4 text-lg sm:text-xl ${light ? "text-white/85" : "text-ink-soft"}`}>{org.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {org.focus.map((f) => (
                <span key={f} className={`rounded-full px-3 py-1 text-xs font-medium backdrop-blur ${light ? "bg-white/15 text-white" : "bg-ink/10 text-ink"}`}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="display text-2xl font-semibold">About</h2>
            <p className="mt-3 max-w-2xl font-serif text-[17px] leading-relaxed text-ink-soft">{org.description}</p>
            {org.noApprovalRequired && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-paper-deep px-3 py-1.5 text-xs font-medium text-ink-soft">
                <BadgeCheck className="h-4 w-4" aria-hidden="true" /> Government provider · publishes directly to the platform
              </p>
            )}
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-xl3 border border-line bg-paper-card p-6 text-sm">
            <div>
              <dt className="eyebrow text-ink-faint">Books</dt>
              <dd className="display mt-1 text-2xl font-semibold">{books.length}</dd>
            </div>
            <div>
              <dt className="eyebrow text-ink-faint">Languages</dt>
              <dd className="mt-1 text-ink-soft">{org.languages.join(" · ")}</dd>
            </div>
            <div>
              <dt className="eyebrow text-ink-faint">Genres</dt>
              <dd className="mt-1 text-ink-soft">{genres.length ? genres.join(", ") : "To be announced"}</dd>
            </div>
            {org.website && (
              <div>
                <dt className="eyebrow text-ink-faint">Website</dt>
                <dd className="mt-1">
                  <a href={org.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:text-accent-deep">
                    {org.website.replace(/^https?:\/\//, "")} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="mt-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 className="display text-2xl font-semibold sm:text-3xl">Books from {org.shortName}</h2>
            {genres.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <Link key={g} href={`/books?org=${org.slug}&genre=${encodeURIComponent(g)}`}>
                    <Chip>{g}</Chip>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {books.length ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {books.map((b) => (
                <BookCard key={b.slug} book={b} size="lg" showOrg={false} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl3 border-2 border-dashed border-line-strong p-12 text-center text-ink-faint">
              This organization&apos;s collection has not been published yet.
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
