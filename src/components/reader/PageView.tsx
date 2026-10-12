"use client";

import { memo, useEffect, useRef, useState, type RefObject } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { loadPdfjs } from "@/lib/pdfjs";
import type { Highlight } from "@/components/reader/Reader";

interface Props {
  doc: PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  baseSize: { w: number; h: number };
  filter: string;
  night: boolean;
  highlights: Highlight[];
  register: (n: number, el: HTMLDivElement | null) => void;
  magnify?: (canvas: HTMLCanvasElement, x: number, y: number) => void;
  reading: boolean;
  root: RefObject<HTMLDivElement | null>;
}

/** One page of the PDF: canvas + selectable text layer + highlight layer. Renders lazily when near the viewport. */
export const PageView = memo(function PageView({ doc, pageNumber, scale, baseSize, filter, night, highlights, register, magnify, reading, root }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);

  const width = Math.round(baseSize.w * scale);
  const height = Math.round(baseSize.h * scale);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    register(pageNumber, el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setVisible(e.isIntersecting);
      },
      { root: root.current, rootMargin: "900px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      register(pageNumber, null);
    };
  }, [pageNumber, register, root]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const textDiv = textRef.current;
    if (!canvas || !textDiv) return;
    if (!visible) {
      canvas.width = 0;
      canvas.height = 0;
      textDiv.replaceChildren();
      setRendered(false);
      return;
    }
    let cancelled = false;
    let task: RenderTask | null = null;
    (async () => {
      try {
        const page = await doc.getPage(pageNumber);
        if (cancelled) return;
        const viewport = page.getViewport({ scale });
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        const ctx = canvas.getContext("2d")!;
        task = page.render({ canvas, canvasContext: ctx, viewport, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined });
        await task.promise;
        if (cancelled) return;
        setRendered(true);
        const pdfjs = await loadPdfjs();
        textDiv.replaceChildren();
        const tl = new pdfjs.TextLayer({ textContentSource: page.streamTextContent(), container: textDiv, viewport });
        await tl.render();
      } catch (err) {
        if (!(err instanceof Error && err.name === "RenderingCancelledException")) console.warn("Page render failed", err);
      }
    })();
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [doc, pageNumber, scale, visible]);

  return (
    <div
      ref={wrap}
      data-page={pageNumber}
      className={`relative isolate shrink-0 overflow-hidden rounded-[3px] bg-white transition-shadow ${reading ? "ring-4 ring-ink/35" : ""} ${night ? "shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)]" : "shadow-[0_18px_40px_-18px_rgba(28,25,21,0.45)]"}`}
      style={{ width, height, ["--scale-factor" as string]: String(scale) }}
      onMouseMove={
        magnify
          ? (e) => {
              if (canvasRef.current) magnify(canvasRef.current, e.clientX, e.clientY);
            }
          : undefined
      }
      aria-label={`Page ${pageNumber}`}
    >
      {!rendered && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#fbf8f2] text-xs text-ink-faint" style={{ filter }}>
          Page {pageNumber}
        </div>
      )}
      <canvas ref={canvasRef} className="block h-full w-full" style={{ filter }} aria-hidden="true" />
      {/* highlights */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {highlights.map((h) =>
          h.rects.map((r, i) => (
            <span
              key={h.id + i}
              className="absolute rounded-[2px]"
              style={{
                left: `${r.x * 100}%`,
                top: `${r.y * 100}%`,
                width: `${r.w * 100}%`,
                height: `${r.h * 100}%`,
                background: h.color,
                mixBlendMode: night ? "screen" : "multiply",
                opacity: night ? 0.45 : 0.85,
              }}
            />
          )),
        )}
      </div>
      <div ref={textRef} className="textLayer" />
    </div>
  );
});
