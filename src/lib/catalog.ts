import { books } from "@/data/books";
import { organizations } from "@/data/organizations";
import type { Book, Organization, Review } from "@/lib/types";

export function getBooks(): Book[] {
  return books;
}

export function getBook(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

export function getOrgs(): Organization[] {
  return organizations;
}

export function getOrg(slug: string): Organization | undefined {
  return organizations.find((o) => o.slug === slug);
}

export function booksByOrg(slug: string): Book[] {
  return books.filter((b) => b.org === slug);
}

export function trendingBooks(limit = 10): Book[] {
  return books
    .filter((b) => typeof b.trending === "number")
    .sort((a, b) => (a.trending ?? 99) - (b.trending ?? 99))
    .slice(0, limit);
}

export function allGenres(): string[] {
  return Array.from(new Set(books.map((b) => b.genre))).sort();
}

export function allLanguages(): string[] {
  return Array.from(new Set(books.map((b) => b.language)));
}

export function allAgeGroups(): string[] {
  const order = ["3+", "6+", "8+", "10+", "12+", "14+", "16+", "All ages"];
  return order.filter((a) => books.some((b) => b.ageGroup === a));
}

export function similarBooks(book: Book, limit = 6): Book[] {
  return books
    .filter((b) => b.slug !== book.slug && b.genre === book.genre)
    .slice(0, limit);
}

export function moreFromOrg(book: Book, limit = 6): Book[] {
  return books.filter((b) => b.slug !== book.slug && b.org === book.org).slice(0, limit);
}

export function youMightAlsoLike(book: Book, limit = 6): Book[] {
  const scored = books
    .filter((b) => b.slug !== book.slug && b.genre !== book.genre)
    .map((b) => {
      let score = 0;
      if (b.ageGroup === book.ageGroup) score += 3;
      if (b.language === book.language) score += 2;
      score += b.tags.filter((t) => book.tags.includes(t)).length * 2;
      score += (b.rating - 4) * 2;
      return { b, score };
    })
    .sort((x, y) => y.score - x.score);
  return scored.slice(0, limit).map((s) => s.b);
}

export function pdfPath(book: Book): string {
  return `/pdfs/${book.slug}.pdf`;
}

export function fileSizeLabel(book: Book): string {
  const kb = Math.round(180 + book.pages * 46);
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

export function ratingBreakdown(book: Book): number[] {
  // Returns counts for 5,4,3,2,1 stars derived from the average rating.
  const r = book.rating;
  const n = book.ratingsCount;
  const five = Math.min(0.92, Math.max(0.3, (r - 3.6) / 1.4));
  const four = Math.max(0.05, (1 - five) * 0.62);
  const three = Math.max(0.02, (1 - five - four) * 0.6);
  const two = Math.max(0.01, (1 - five - four - three) * 0.5);
  const one = Math.max(0.005, 1 - five - four - three - two);
  return [five, four, three, two, one].map((p) => Math.round(p * n));
}

export function chapterPages(book: Book): { title: string; page: number }[] {
  const total = pdfPageCount(book);
  const n = book.chapters.length;
  return book.chapters.map((title, i) => ({
    title,
    page: i === 0 ? 2 : Math.min(total, 2 + Math.round((i * (total - 2)) / n)),
  }));
}

/** Page count of the generated sample PDF (capped to keep files small). */
export function pdfPageCount(book: Book): number {
  return Math.min(book.pages, 48);
}

const genericReviews: Record<string, Review[]> = {
  default: [
    {
      author: "Lakshmi Gowda",
      role: "Librarian, Tumakuru",
      rating: 5,
      title: "Children keep asking for it",
      text: "We read this one during the Saturday session and three children borrowed the printed copy the same week. The language is simple and the pictures carry the story.",
      when: "2w ago",
    },
    {
      author: "Prakash R",
      role: "Parent",
      rating: 4,
      title: "Good, wish there were more pages",
      text: "My daughter finished it in one sitting and wanted the next part. The audio version helped her follow along while reading.",
      when: "1mo ago",
    },
  ],
  study: [
    {
      author: "Sandeep K",
      role: "Student, Class 10",
      rating: 5,
      title: "Finally understood the diagrams",
      text: "The worked examples go step by step. I used the quiz at the end to check myself before the unit test and it matched what came in the exam.",
      when: "3w ago",
    },
    {
      author: "Mallika Shetty",
      role: "Teacher",
      rating: 4,
      title: "Useful for revision",
      text: "Clear explanations. I would like a few more practice sets at the end of each chapter, but as a revision book it works well.",
      when: "1mo ago",
    },
  ],
};

export function reviewsFor(book: Book): Review[] {
  if (book.reviews && book.reviews.length) return book.reviews;
  const studyGenres = ["Science", "Mathematics", "Open Schooling", "Exam Preparation", "Digital Literacy", "Language"];
  return studyGenres.includes(book.genre) ? genericReviews.study : genericReviews.default;
}

export function searchBooks(query: string): Book[] {
  const q = query.trim().toLowerCase();
  if (!q) return books;
  return books.filter((b) => {
    const org = getOrg(b.org);
    const hay = [b.title, b.titleLatin ?? "", b.subtitle ?? "", b.author, b.genre, b.language, org?.name ?? "", ...b.tags]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}
