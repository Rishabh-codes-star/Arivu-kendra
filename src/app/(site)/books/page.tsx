import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/Section";
import { Catalogue } from "@/components/Catalogue";
import { allAgeGroups, allGenres, allLanguages, getBooks, getOrgs } from "@/lib/catalog";

export const metadata: Metadata = { title: "Library" };

export default function BooksPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Suspense fallback={<div className="h-96" />}>
        <Catalogue
          books={getBooks()}
          orgs={getOrgs().filter((o) => !o.placeholder)}
          genres={allGenres()}
          languages={allLanguages()}
          ages={allAgeGroups()}
        />
      </Suspense>
    </Container>
  );
}
