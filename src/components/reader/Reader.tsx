"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  Download,
  Highlighter,
  List,
  Minus,
  Pause,
  Play,
  Plus,
  Square,
  SunMedium,
  Volume2,
  X,
  ZoomIn,
  Copy,
  Trash2,
  BookMarked,
} from "lucide-react";
import { loadPdfjs } from "@/lib/pdfjs";
import { PageView } from "@/components/reader/PageView";
import { lookupWord, wordAtPoint, type Lookup } from "@/components/reader/dictionary";
import { useReadAloud } from "@/components/reader/useReadAloud";

export type Tool = "none" | "highlight" | "magnify" | "define";
export type Theme = "paper" | "white" | "sepia" | "night";
export interface HRect {
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface Highlight {
  id: string;
  page: number;
  color: string;
  text: string;
  rects: HRect[];
  created: number;
}

export const HIGHLIGHT_COLORS: { name: string; value: string }[] = [
  { name: "Yellow", value: "#f5d547" },
  { name: "Green", value: "#9be09b" },
  { name: "Pink", value: "#f8a5c2" },
  { name: "Blue", value: "#9ec9f5" },
];

export const THEME_FILTER: Record<Theme, string> = {
  paper: "sepia(0.22) saturate(0.95) brightness(0.99)",
  white: "none",
  sepia: "sepia(0.55) saturate(0.9)",
  night: "invert(0.92) hue-rotate(180deg) contrast(0.95)",
};

const THEME_BG: Record<Theme, string> = {
  paper: "#efe8db",
  white: "#e9e9e9",
  sepia: "#e8dcc4",
  night: "#15130f",
};

interface Props {
  slug: string;
  title: string;
  titleLatin?: string;
  author: string;
  orgName: string;
  language: string;
  pdfUrl: string;
  chapters: { title: string; page: number }[];
  bookHref: string;
}

export function Reader(props: Props) {
  const params = useSearchParams();
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageSize, setPageSize] = useState<{ w: number; h: number } | null>(null);
  const [scale, setScale] = useState(1.25);
  const [page, setPage] = useState(1);
  const [tool, setTool] = useState<Tool>("none");
  const [color, setColor] = useState(HIGHLIGHT_COLORS[0].value);
  const [theme, setTheme] = useState<Theme>("paper");
  const [panel, setPanel] = useState<"none" | "contents" | "highlights">("none");
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selection, setSelection] = useState<{ x: number; y: number; text: string; page: number; rects: HRect[] } | null>(null);
  const [lookup, setLookup] = useState<Lookup | null>(null);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const [themeMenu, setThemeMenu] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState("1");

  const toggleTool = useCallback((name: Tool) => {
    setTool((t) => (t === name ? "none" : name));
    setLens(null);
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const pageEls = useRef<Map<number, HTMLDivElement>>(new Map());
  const lensCanvas = useRef<HTMLCanvasElement>(null);
  const storageKey = `arivu:highlights:${props.slug}`;
  const initialPage = Number(params.get("page") ?? "1") || 1;
  const autoListen = params.get("listen") === "1";

  const readAloud = useReadAloud({ doc, numPages, language: props.language, onPage: (n) => scrollToPage(n, "smooth") });

  // ── Load the document ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await loadPdfjs();
        const d = await pdfjs.getDocument({ url: props.pdfUrl }).promise;
        if (cancelled) return;
        const first = await d.getPage(1);
        const vp = first.getViewport({ scale: 1 });
        setPageSize({ w: vp.width, h: vp.height });
        setNumPages(d.numPages);
        setDoc(d);
        try {
          const raw = localStorage.getItem(storageKey);
          if (raw) setHighlights(JSON.parse(raw));
        } catch {
          /* ignore */
        }
        const container = scrollRef.current;
        if (container) {
          const avail = Math.min(container.clientWidth - 48, 820);
          setScale(Math.max(0.6, Math.min(1.8, avail / vp.width)));
        }
      } catch (e) {
        console.error(e);
        setError("The book could not be opened. Please try again.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [props.pdfUrl, storageKey]);

  // ── Highlights persistence ──
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(highlights));
    } catch {
      /* ignore */
    }
  }, [highlights, storageKey]);

  // ── Jump to initial page / auto listen ──
  const jumped = useRef(false);
  useEffect(() => {
    if (!doc || !pageSize || jumped.current) return;
    jumped.current = true;
    requestAnimationFrame(() => {
      if (initialPage > 1) scrollToPage(initialPage, "auto");
      if (autoListen) {
        readAloud.open();
        setTimeout(() => readAloud.play(initialPage), 400);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, pageSize]);

  // ── Track current page while scrolling ──
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || !numPages) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = root.scrollTop + root.clientHeight * 0.4;
        let best = 1;
        let bestDist = Infinity;
        pageEls.current.forEach((el, n) => {
          const d = Math.abs(el.offsetTop + el.offsetHeight / 2 - mid);
          if (d < bestDist) {
            bestDist = d;
            best = n;
          }
        });
        setPage(best);
        setPageInput(String(best));
      });
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      root.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [numPages, scale]);

  const scrollToPage = useCallback((n: number, behavior: ScrollBehavior = "smooth") => {
    const el = pageEls.current.get(n);
    const root = scrollRef.current;
    if (!el || !root) return;
    root.scrollTo({ top: el.offsetTop - 16, behavior });
  }, []);

  const registerPage = useCallback((n: number, el: HTMLDivElement | null) => {
    if (el) pageEls.current.set(n, el);
    else pageEls.current.delete(n);
  }, []);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          scrollToPage(Math.min(numPages, page + 1));
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          scrollToPage(Math.max(1, page - 1));
          break;
        case "+":
        case "=":
          setScale((s) => Math.min(4, +(s + 0.15).toFixed(2)));
          break;
        case "-":
          setScale((s) => Math.max(0.5, +(s - 0.15).toFixed(2)));
          break;
        case "h":
          toggleTool("highlight");
          break;
        case "m":
          toggleTool("magnify");
          break;
        case "d":
          toggleTool("define");
          break;
        case "Escape":
          setTool("none");
          setLens(null);
          setLookup(null);
          setSelection(null);
          setThemeMenu(false);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, numPages, scrollToPage, toggleTool]);

  // ── Selection → toolbar or instant highlight ──
  const onMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (tool === "magnify") return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) {
        if (!(e.target as HTMLElement).closest("[data-toolbar]")) setSelection(null);
        return;
      }
      const text = sel.toString().replace(/\s+/g, " ").trim();
      if (!text) return;
      const range = sel.getRangeAt(0);
      const anchor = (range.commonAncestorContainer.nodeType === 1 ? (range.commonAncestorContainer as Element) : range.commonAncestorContainer.parentElement) as HTMLElement | null;
      const pageEl = anchor?.closest("[data-page]") as HTMLElement | null;
      if (!pageEl) return;
      const n = Number(pageEl.dataset.page);
      const pr = pageEl.getBoundingClientRect();
      const rects = Array.from(range.getClientRects())
        .filter((r) => r.width > 1 && r.height > 1)
        .map((r) => ({ x: (r.left - pr.left) / pr.width, y: (r.top - pr.top) / pr.height, w: r.width / pr.width, h: r.height / pr.height }));
      if (!rects.length) return;
      if (tool === "highlight") {
        addHighlight(n, text, rects, color);
        sel.removeAllRanges();
        return;
      }
      const b = range.getBoundingClientRect();
      setSelection({ x: b.left + b.width / 2, y: b.top, text, page: n, rects });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tool, color],
  );

  function addHighlight(n: number, text: string, rects: HRect[], c: string) {
    setHighlights((h) => [...h, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, page: n, color: c, text, rects, created: Date.now() }]);
  }

  // ── Dictionary ──
  const define = useCallback(async (word: string, x: number, y: number) => {
    const clean = word.toLowerCase().replace(/[^a-z'’-]/g, "");
    if (!clean) return;
    setLookup({ word: clean, x, y, status: "loading" });
    const result = await lookupWord(clean);
    setLookup({ ...result, x, y });
  }, []);

  const onPageClick = useCallback(
    (e: React.MouseEvent) => {
      if (tool !== "define") return;
      const word = wordAtPoint(e.clientX, e.clientY);
      if (word) define(word, e.clientX, e.clientY);
    },
    [tool, define],
  );

  // ── Magnifier ──
  const onMagnify = useCallback(
    (canvas: HTMLCanvasElement, clientX: number, clientY: number) => {
      const lensEl = lensCanvas.current;
      if (!lensEl) return;
      const L = 220;
      const zoom = 2.6;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      const ratio = canvas.width / r.width;
      const px = (clientX - r.left) * ratio;
      const py = (clientY - r.top) * ratio;
      const sw = (L / zoom) * ratio;
      const sh = sw;
      lensEl.width = L * dpr;
      lensEl.height = L * dpr;
      const ctx = lensEl.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, lensEl.width, lensEl.height);
      ctx.drawImage(canvas, px - sw / 2, py - sh / 2, sw, sh, 0, 0, lensEl.width, lensEl.height);
      setLens({ x: clientX, y: clientY });
    },
    [],
  );

  const chaptersForPage = useMemo(() => {
    const current = [...props.chapters].reverse().find((c) => c.page <= page);
    return current?.title;
  }, [page, props.chapters]);

  const pages = useMemo(() => Array.from({ length: numPages }, (_, i) => i + 1), [numPages]);
  const night = theme === "night";

  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ background: THEME_BG[theme] }}>
      {/* ───────── Top bar ───────── */}
      <header className={`z-30 flex h-14 shrink-0 items-center gap-2 border-b px-3 ${night ? "border-white/10 bg-[#1c1915] text-paper" : "border-line bg-paper text-ink"}`}>
        <a href={props.bookHref} className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${night ? "hover:bg-white/10" : "hover:bg-paper-deep"}`} aria-label="Back to book page" title="Back to book">
          <ChevronLeft className="h-5 w-5" />
        </a>
        <div className="min-w-0 flex-1 sm:flex-none sm:w-72">
          <div className={`${props.language === "Kannada" ? "font-kannada" : "display"} truncate text-[15px] font-semibold leading-tight`}>{props.title}</div>
          <div className={`truncate text-[11px] ${night ? "text-paper/60" : "text-ink-faint"}`}>
            {props.author}
            {chaptersForPage ? ` · ${chaptersForPage}` : ""}
          </div>
        </div>

        <div className="mx-auto hidden items-center gap-1 sm:flex">
          <IconBtn label="Previous page" night={night} onClick={() => scrollToPage(Math.max(1, page - 1))} disabled={page <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </IconBtn>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = Math.max(1, Math.min(numPages, Number(pageInput) || 1));
              scrollToPage(n);
            }}
            className="flex items-center gap-1 text-sm"
          >
            <input
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className={`w-11 rounded-md border px-1.5 py-1 text-center text-sm ${night ? "border-white/15 bg-white/5" : "border-line bg-paper-card"}`}
              aria-label="Page number"
              inputMode="numeric"
            />
            <span className={night ? "text-paper/60" : "text-ink-faint"}>/ {numPages || "…"}</span>
          </form>
          <IconBtn label="Next page" night={night} onClick={() => scrollToPage(Math.min(numPages, page + 1))} disabled={page >= numPages}>
            <ChevronRight className="h-4 w-4" />
          </IconBtn>
        </div>

        {/* Tools */}
        <div className={`flex items-center gap-1 rounded-full border p-1 ${night ? "border-white/10 bg-white/5" : "border-line bg-paper-card shadow-card"}`} role="toolbar" aria-label="Reading tools">
          <ToolBtn active={tool === "highlight"} night={night} label="Highlighter (H)" onClick={() => toggleTool("highlight")}>
            <Highlighter className="h-4 w-4" />
            <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full ring-1 ring-black/10" style={{ background: color }} />
          </ToolBtn>
          <ToolBtn active={tool === "magnify"} night={night} label="Magnifier (M)" onClick={() => toggleTool("magnify")}>
            <ZoomIn className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn active={tool === "define"} night={night} label="Dictionary (D)" onClick={() => toggleTool("define")}>
            <BookOpenText className="h-4 w-4" />
          </ToolBtn>
          <ToolBtn active={readAloud.state.open} night={night} label="Read aloud" onClick={() => (readAloud.state.open ? readAloud.close() : readAloud.open())}>
            <Volume2 className="h-4 w-4" />
          </ToolBtn>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <IconBtn label="Zoom out (−)" night={night} onClick={() => setScale((s) => Math.max(0.5, +(s - 0.15).toFixed(2)))}>
            <Minus className="h-4 w-4" />
          </IconBtn>
          <span className={`w-12 text-center text-xs tabular-nums ${night ? "text-paper/70" : "text-ink-soft"}`}>{Math.round(scale * 100)}%</span>
          <IconBtn label="Zoom in (+)" night={night} onClick={() => setScale((s) => Math.min(4, +(s + 0.15).toFixed(2)))}>
            <Plus className="h-4 w-4" />
          </IconBtn>
        </div>

        <div className="relative">
          <IconBtn label="Page colour" night={night} onClick={() => setThemeMenu((v) => !v)}>
            <SunMedium className="h-4 w-4" />
          </IconBtn>
          {themeMenu && (
            <div className={`absolute right-0 top-11 z-40 w-44 rounded-xl border p-1.5 shadow-lift ${night ? "border-white/10 bg-[#1c1915]" : "border-line bg-paper-card"}`} role="menu">
              {(["paper", "white", "sepia", "night"] as Theme[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="menuitemradio"
                  aria-checked={theme === t}
                  onClick={() => {
                    setTheme(t);
                    setThemeMenu(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm capitalize ${theme === t ? (night ? "bg-white/10" : "bg-paper-deep") : night ? "hover:bg-white/5" : "hover:bg-paper-deep/60"}`}
                >
                  <span className="h-4 w-4 rounded-full border border-black/10" style={{ background: THEME_BG[t] }} />
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
        <IconBtn label="Contents" night={night} active={panel === "contents"} onClick={() => setPanel((p) => (p === "contents" ? "none" : "contents"))}>
          <List className="h-4 w-4" />
        </IconBtn>
        <IconBtn label="Highlights" night={night} active={panel === "highlights"} onClick={() => setPanel((p) => (p === "highlights" ? "none" : "highlights"))}>
          <BookMarked className="h-4 w-4" />
          {highlights.length > 0 && <span className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold ${night ? "bg-paper text-ink" : "bg-ink text-paper"}`}>{highlights.length}</span>}
        </IconBtn>
        <a href={props.pdfUrl} download className={`hidden h-9 w-9 items-center justify-center rounded-full sm:inline-flex ${night ? "hover:bg-white/10" : "hover:bg-paper-deep"}`} aria-label="Download PDF" title="Download PDF">
          <Download className="h-4 w-4" />
        </a>
      </header>

      {/* ───────── Body ───────── */}
      <div className="relative flex min-h-0 flex-1">
        {panel !== "none" && (
          <aside className={`z-20 w-72 shrink-0 overflow-y-auto border-r ${night ? "border-white/10 bg-[#1c1915] text-paper" : "border-line bg-paper text-ink"}`} aria-label={panel === "contents" ? "Contents" : "Highlights"}>
            <div className="flex items-center justify-between px-4 pb-2 pt-4">
              <h2 className="display text-base font-semibold">{panel === "contents" ? "Contents" : "Your highlights"}</h2>
              <button type="button" onClick={() => setPanel("none")} className="rounded-full p-1 hover:bg-black/5" aria-label="Close panel">
                <X className="h-4 w-4" />
              </button>
            </div>
            {panel === "contents" ? (
              <ol className="px-2 pb-6">
                {props.chapters.map((c, i) => {
                  const next = props.chapters[i + 1]?.page ?? numPages + 1;
                  const active = page >= c.page && page < next;
                  return (
                    <li key={c.title + i}>
                      <button
                        type="button"
                        onClick={() => scrollToPage(c.page)}
                        className={`flex w-full items-start justify-between gap-3 rounded-lg px-2 py-2 text-left text-sm ${active ? (night ? "bg-white/10" : "bg-paper-deep") : night ? "hover:bg-white/5" : "hover:bg-paper-deep/60"}`}
                      >
                        <span className={props.language === "Kannada" ? "font-kannada" : ""}>
                          <span className={`mr-2 ${night ? "text-paper/50" : "text-ink-faint"}`}>{i + 1}.</span>
                          {c.title}
                        </span>
                        <span className={`shrink-0 text-xs ${night ? "text-paper/50" : "text-ink-faint"}`}>{c.page}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            ) : highlights.length ? (
              <ol className="space-y-2 px-3 pb-6">
                {[...highlights]
                  .sort((a, b) => a.page - b.page || a.created - b.created)
                  .map((h) => (
                    <li key={h.id} className={`group rounded-lg border p-3 text-sm ${night ? "border-white/10" : "border-line bg-paper-card"}`}>
                      <button type="button" onClick={() => scrollToPage(h.page)} className="block w-full text-left">
                        <span className="rounded px-1 leading-relaxed" style={{ background: h.color, color: "#1c1915" }}>
                          {h.text.length > 140 ? h.text.slice(0, 140) + "…" : h.text}
                        </span>
                        <span className={`mt-1.5 block text-[11px] ${night ? "text-paper/50" : "text-ink-faint"}`}>Page {h.page}</span>
                      </button>
                      <button type="button" onClick={() => setHighlights((hs) => hs.filter((x) => x.id !== h.id))} className="mt-1 inline-flex items-center gap-1 text-[11px] text-ink-soft underline-offset-2 opacity-0 transition hover:underline group-hover:opacity-100 focus:opacity-100">
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </li>
                  ))}
              </ol>
            ) : (
              <p className={`px-4 text-sm ${night ? "text-paper/60" : "text-ink-soft"}`}>No highlights yet. Select some text, or press H and drag across a passage.</p>
            )}
          </aside>
        )}

        <div
          ref={scrollRef}
          className={`relative flex-1 overflow-y-auto overscroll-contain ${tool === "magnify" ? "cursor-none" : tool === "define" ? "cursor-help" : tool === "highlight" ? "cursor-text" : ""}`}
          onMouseUp={onMouseUp}
          onClick={onPageClick}
          onMouseLeave={() => setLens(null)}
        >
          {error && (
            <div className="mx-auto mt-24 max-w-md rounded-xl3 border border-line bg-paper-card p-6 text-center text-ink-soft">{error}</div>
          )}
          {!doc && !error && (
            <div className="mx-auto mt-24 flex max-w-md flex-col items-center gap-3 text-ink-soft">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-line border-t-ink" />
              Opening the book…
            </div>
          )}
          {doc && pageSize && (
            <div className="mx-auto flex flex-col items-center gap-5 px-4 py-6">
              {pages.map((n) => (
                <PageView
                  key={n}
                  doc={doc}
                  pageNumber={n}
                  scale={scale}
                  baseSize={pageSize}
                  filter={THEME_FILTER[theme]}
                  night={night}
                  highlights={highlights.filter((h) => h.page === n)}
                  register={registerPage}
                  magnify={tool === "magnify" ? onMagnify : undefined}
                  reading={readAloud.state.playing && readAloud.state.page === n}
                  root={scrollRef}
                />
              ))}
              <div className={`py-10 text-center text-sm ${night ? "text-paper/50" : "text-ink-faint"}`}>
                End of {props.titleLatin ?? props.title} · {props.orgName}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ───────── Selection toolbar ───────── */}
      {selection && tool !== "highlight" && (
        <div
          data-toolbar
          className="fixed z-40 -translate-x-1/2 -translate-y-full"
          style={{ left: Math.max(140, Math.min(window.innerWidth - 140, selection.x)), top: Math.max(70, selection.y - 10) }}
          role="toolbar"
          aria-label="Selection actions"
        >
          <div className="flex items-center gap-1 rounded-full bg-ink p-1.5 text-paper shadow-lift">
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                title={`Highlight ${c.name.toLowerCase()}`}
                aria-label={`Highlight ${c.name.toLowerCase()}`}
                onClick={() => {
                  addHighlight(selection.page, selection.text, selection.rects, c.value);
                  setColor(c.value);
                  window.getSelection()?.removeAllRanges();
                  setSelection(null);
                }}
                className="h-6 w-6 rounded-full ring-2 ring-transparent transition hover:scale-110 hover:ring-white/40"
                style={{ background: c.value }}
              />
            ))}
            <span className="mx-1 h-5 w-px bg-white/20" />
            <button
              type="button"
              onClick={() => {
                const w = selection.text.split(/\s+/)[0];
                define(w, selection.x, selection.y + 8);
                setSelection(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium hover:bg-white/10"
            >
              <BookOpenText className="h-3.5 w-3.5" /> Define
            </button>
            <button
              type="button"
              onClick={() => {
                readAloud.open();
                readAloud.play(selection.page, selection.text);
                setSelection(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium hover:bg-white/10"
            >
              <Volume2 className="h-3.5 w-3.5" /> Read from here
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(selection.text);
                setSelection(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium hover:bg-white/10"
            >
              <Copy className="h-3.5 w-3.5" /> Copy
            </button>
          </div>
        </div>
      )}

      {/* ───────── Dictionary popover ───────── */}
      {lookup && (
        <div
          className="fixed z-40 w-80 -translate-x-1/2 rounded-xl3 border border-line bg-paper-card p-4 text-ink shadow-lift"
          style={{ left: Math.max(170, Math.min(window.innerWidth - 170, lookup.x)), top: Math.min(window.innerHeight - 260, lookup.y + 14) }}
          role="dialog"
          aria-label={`Definition of ${lookup.word}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="display text-xl font-semibold">{lookup.word}</div>
              {lookup.phonetic && <div className="text-xs text-ink-faint">{lookup.phonetic}</div>}
            </div>
            <button type="button" onClick={() => setLookup(null)} className="rounded-full p-1 hover:bg-paper-deep" aria-label="Close definition">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 space-y-3 text-sm">
            {lookup.status === "loading" && <p className="text-ink-faint">Looking it up…</p>}
            {lookup.status === "none" && <p className="text-ink-soft">No entry found. The dictionary covers English words; Kannada and Hindi lookups are coming.</p>}
            {lookup.status === "error" && <p className="text-ink-soft">The dictionary service could not be reached. Check the connection and try again.</p>}
            {lookup.status === "ok" &&
              lookup.meanings?.map((m, i) => (
                <div key={i}>
                  <div className="display-italic text-ink-soft">{m.pos}</div>
                  <ol className="mt-1 list-decimal space-y-1 pl-4 leading-relaxed">
                    {m.defs.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ol>
                </div>
              ))}
          </div>
          {lookup.status === "ok" && <div className="mt-3 text-[10px] text-ink-faint">Source: Free Dictionary API</div>}
        </div>
      )}

      {/* ───────── Magnifier lens ───────── */}
      <canvas
        ref={lensCanvas}
        className="pointer-events-none fixed z-40 h-[220px] w-[220px] rounded-full border-4 border-white shadow-lift"
        style={{ left: (lens?.x ?? -999) - 110, top: (lens?.y ?? -999) - 110, opacity: lens ? 1 : 0, visibility: lens ? "visible" : "hidden", filter: THEME_FILTER[theme] }}
        aria-hidden="true"
      />

      {/* ───────── Read-aloud bar ───────── */}
      {readAloud.state.open && (
        <div className={`z-30 shrink-0 border-t px-4 py-3 ${night ? "border-white/10 bg-[#1c1915] text-paper" : "border-line bg-paper text-ink"}`} role="region" aria-label="Read aloud">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => (readAloud.state.playing ? readAloud.pause() : readAloud.play(readAloud.state.page || page))}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${night ? "bg-paper text-ink hover:bg-white" : "bg-ink text-paper hover:bg-ink-mid"}`}
              aria-label={readAloud.state.playing ? "Pause" : "Play"}
            >
              {readAloud.state.playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
            </button>
            <button type="button" onClick={() => readAloud.stop()} className={`flex h-9 w-9 items-center justify-center rounded-full ${night ? "hover:bg-white/10" : "hover:bg-paper-deep"}`} aria-label="Stop">
              <Square className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <div className={`text-[11px] ${night ? "text-paper/60" : "text-ink-faint"}`}>
                {readAloud.state.playing ? `Reading page ${readAloud.state.page}` : readAloud.state.supported ? "Ready to read aloud" : "Read aloud is not supported in this browser"}
                {readAloud.state.word && readAloud.state.playing ? ` · ${readAloud.state.word}` : ""}
              </div>
              <div className="truncate font-serif text-[15px]">{readAloud.state.sentence || "Press play to hear this page. The text being read is shown here."}</div>
            </div>
            <label className="flex items-center gap-2 text-xs">
              <span className={night ? "text-paper/60" : "text-ink-faint"}>Speed</span>
              <select
                value={readAloud.state.rate}
                onChange={(e) => readAloud.setRate(Number(e.target.value))}
                className={`rounded-md border px-2 py-1 text-xs ${night ? "border-white/15 bg-white/5" : "border-line bg-paper-card"}`}
              >
                {[0.8, 0.9, 1, 1.15, 1.3, 1.5].map((r) => (
                  <option key={r} value={r}>
                    {r}×
                  </option>
                ))}
              </select>
            </label>
            {readAloud.voices.length > 0 && (
              <label className="flex items-center gap-2 text-xs">
                <span className={night ? "text-paper/60" : "text-ink-faint"}>Voice</span>
                <select
                  value={readAloud.state.voice ?? ""}
                  onChange={(e) => readAloud.setVoice(e.target.value)}
                  className={`max-w-[160px] rounded-md border px-2 py-1 text-xs ${night ? "border-white/15 bg-white/5" : "border-line bg-paper-card"}`}
                >
                  {readAloud.voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <button type="button" onClick={() => readAloud.close()} className={`flex h-9 w-9 items-center justify-center rounded-full ${night ? "hover:bg-white/10" : "hover:bg-paper-deep"}`} aria-label="Close read aloud">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tool hint */}
      {tool !== "none" && (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-30 -translate-x-1/2 rounded-full bg-ink/90 px-4 py-2 text-xs font-medium text-paper shadow-lift">
          {tool === "highlight" && "Highlighter on · drag across text to highlight · Esc to exit"}
          {tool === "magnify" && "Magnifier on · move over the page · Esc to exit"}
          {tool === "define" && "Dictionary on · click any word · Esc to exit"}
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, label, onClick, night, active = false, disabled = false }: { children: React.ReactNode; label: string; onClick: () => void; night: boolean; active?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full transition disabled:opacity-30 ${
        active ? (night ? "bg-white/15" : "bg-ink text-paper") : night ? "hover:bg-white/10" : "hover:bg-paper-deep"
      }`}
    >
      {children}
    </button>
  );
}

function ToolBtn({ children, label, onClick, night, active }: { children: React.ReactNode; label: string; onClick: () => void; night: boolean; active: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full transition ${
        active ? (night ? "bg-paper text-ink shadow-card" : "bg-ink text-paper shadow-card") : night ? "text-paper/80 hover:bg-white/10" : "text-ink-soft hover:bg-paper-deep hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

