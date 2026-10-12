"use client";

import { useEffect, useRef, useState } from "react";
import { loadPdfjs } from "@/lib/pdfjs";

/** Renders the first few pages of a PDF as thumbnails, App Store "preview" style. */
export function PdfPreview({ src, readHref, count = 4 }: { src: string; readHref: string; count?: number }) {
  const [urls, setUrls] = useState<string[]>([]);
  const [failed, setFailed] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        const pdfjs = await loadPdfjs();
        const doc = await pdfjs.getDocument({ url: src }).promise;
        const n = Math.min(count, doc.numPages);
        const out: string[] = [];
        for (let i = 1; i <= n; i++) {
          const page = await doc.getPage(i);
          const viewport = page.getViewport({ scale: 0.9 });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const ctx = canvas.getContext("2d")!;
          await page.render({ canvas, canvasContext: ctx, viewport }).promise;
          out.push(canvas.toDataURL("image/jpeg", 0.85));
          if (mounted.current) setUrls([...out]);
        }
      } catch (err) {
        console.warn("Preview failed", err);
        if (mounted.current) setFailed(true);
      }
    })();
    return () => {
      mounted.current = false;
    };
  }, [src, count]);

  const slots = Array.from({ length: count });
  return (
    <div className="scroll-row -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      {slots.map((_, i) => (
        <a
          key={i}
          href={`${readHref}?page=${i + 1}`}
          target="_blank"
          rel="noopener"
          className="group relative aspect-[1/1.414] w-56 shrink-0 snap-start overflow-hidden rounded-xl border border-line bg-paper-card shadow-card transition hover:-translate-y-1 hover:shadow-lift sm:w-64"
          aria-label={`Open page ${i + 1} in the reader`}
        >
          {urls[i] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={urls[i]} alt={`Page ${i + 1}`} className="h-full w-full object-cover" />
          ) : (
            <div className={`h-full w-full ${failed ? "" : "animate-pulse"} bg-paper-deep`} />
          )}
          <span className="absolute bottom-2 right-2 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-medium text-paper">p. {i + 1}</span>
        </a>
      ))}
    </div>
  );
}
