import { NextResponse, type NextRequest } from "next/server";

interface DictEntry {
  phonetic?: string;
  phonetics?: { text?: string }[];
  meanings: { partOfSpeech: string; definitions: { definition: string }[] }[];
}

/**
 * Dictionary lookup proxy. Keeps the browser off third-party domains and gives
 * us one place to swap in a Kannada/Hindi dictionary later.
 */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("word") ?? "";
  const word = raw.toLowerCase().replace(/[^a-z'’-]/g, "").slice(0, 40);
  if (!word) return NextResponse.json({ word: raw, status: "none" }, { status: 400 });
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      signal: ctrl.signal,
      headers: { accept: "application/json" },
    });
    clearTimeout(timer);
    if (!res.ok) return NextResponse.json({ word, status: "none" }, { headers: { "Cache-Control": "public, max-age=3600" } });
    const json = (await res.json()) as DictEntry[];
    const entry = json[0];
    return NextResponse.json(
      {
        word,
        status: "ok",
        phonetic: entry.phonetic ?? entry.phonetics?.find((p) => p.text)?.text,
        meanings: entry.meanings.slice(0, 2).map((m) => ({ pos: m.partOfSpeech, defs: m.definitions.slice(0, 2).map((d) => d.definition) })),
      },
      { headers: { "Cache-Control": "public, max-age=86400" } },
    );
  } catch {
    return NextResponse.json({ word, status: "error" }, { status: 502 });
  }
}
