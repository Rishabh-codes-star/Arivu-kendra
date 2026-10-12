export interface Lookup {
  word: string;
  x: number;
  y: number;
  status: "loading" | "ok" | "none" | "error";
  phonetic?: string;
  meanings?: { pos: string; defs: string[] }[];
}

const cache = new Map<string, Omit<Lookup, "x" | "y">>();

/** Looks a word up through the platform dictionary route (backed by the Free Dictionary API, English only). */
export async function lookupWord(word: string): Promise<Omit<Lookup, "x" | "y">> {
  const hit = cache.get(word);
  if (hit) return hit;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`/api/define?word=${encodeURIComponent(word)}`, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error("no entry");
    const result = (await res.json()) as Omit<Lookup, "x" | "y">;
    cache.set(word, result);
    return result;
  } catch {
    return { word, status: "error" };
  }
}

/** Returns the word under a screen point inside the pdf.js text layer, or null. */
export function wordAtPoint(x: number, y: number): string | null {
  type CaretDoc = Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
  };
  const d = document as CaretDoc;
  let node: Node | null = null;
  let offset = 0;
  if (d.caretRangeFromPoint) {
    const r = d.caretRangeFromPoint(x, y);
    if (r) {
      node = r.startContainer;
      offset = r.startOffset;
    }
  } else if (d.caretPositionFromPoint) {
    const p = d.caretPositionFromPoint(x, y);
    if (p) {
      node = p.offsetNode;
      offset = p.offset;
    }
  }
  if (!node || node.nodeType !== Node.TEXT_NODE) return null;
  if (!(node.parentElement && node.parentElement.closest(".textLayer"))) return null;
  const text = node.textContent ?? "";
  const isWord = (c: string) => /[\p{L}\p{M}'’-]/u.test(c);
  let start = offset;
  let end = offset;
  while (start > 0 && isWord(text[start - 1])) start--;
  while (end < text.length && isWord(text[end])) end++;
  const word = text.slice(start, end).trim();
  return word || null;
}
