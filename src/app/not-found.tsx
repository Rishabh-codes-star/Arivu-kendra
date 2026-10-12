import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 pt-20 text-center">
        <div className="eyebrow text-accent">404</div>
        <h1 className="display mt-3 text-4xl font-semibold sm:text-5xl">This shelf is empty</h1>
        <p className="mt-3 max-w-md text-ink-soft">The page you were looking for has been moved or never existed. The library is still open.</p>
        <Link href="/books" className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper hover:bg-accent">
          Browse all books
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
