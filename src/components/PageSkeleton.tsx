import { Container } from "@/components/Section";

/** Static-shell placeholder shown while a dynamic route's content streams in. */
export function PageSkeleton({ hero = false }: { hero?: boolean }) {
  return (
    <div aria-busy="true" aria-live="polite">
      {hero && <div className="h-64 animate-pulse bg-paper-deep sm:h-80" />}
      <Container className="py-12">
        <div className="h-4 w-40 animate-pulse rounded bg-paper-deep" />
        <div className="mt-6 h-10 w-2/3 animate-pulse rounded bg-paper-deep" />
        <div className="mt-4 h-5 w-1/2 animate-pulse rounded bg-paper-deep" />
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] animate-pulse rounded-md bg-paper-deep" />
          ))}
        </div>
      </Container>
    </div>
  );
}
