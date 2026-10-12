"use client";

import { useEffect, useRef, useState } from "react";
import { Headphones, Pause, Play } from "lucide-react";
import type { Book } from "@/lib/types";

/** Audio edition card. Plays a short sample of the description with the browser's speech engine. */
export function AudioCard({ book }: { book: Book }) {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const utter = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const ok = typeof window !== "undefined" && "speechSynthesis" in window;
    const t = ok ? undefined : setTimeout(() => setSupported(false), 0);
    return () => {
      if (t) clearTimeout(t);
      if (ok) window.speechSynthesis.cancel();
    };
  }, []);

  function toggle() {
    if (!supported) return;
    const synth = window.speechSynthesis;
    if (playing) {
      synth.cancel();
      setPlaying(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(`${book.titleLatin ?? book.title}, by ${book.author}. ${book.description}`);
    const lang = book.language === "Kannada" ? "kn" : book.language === "Hindi" ? "hi" : "en";
    const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang) && (lang !== "en" || v.lang.toLowerCase().includes("in"))) ?? synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang));
    if (voice) u.voice = voice;
    u.rate = 0.95;
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    utter.current = u;
    synth.cancel();
    synth.speak(u);
    setPlaying(true);
  }

  const minutes = Math.max(3, Math.round(book.readingTime * 1.15));
  return (
    <div className="rounded-xl3 border border-line bg-paper-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="display flex items-center gap-2 text-lg font-semibold">
            <Headphones className="h-4 w-4 text-ink-soft" aria-hidden="true" /> {book.hasAudio ? "Audio edition" : "Read aloud"}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            {book.hasAudio ? `Narrated edition · about ${minutes} min` : "Spoken by your device's voice, with the text highlighted as it reads."}
          </p>
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={!supported}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition hover:bg-ink-mid disabled:opacity-40"
          aria-label={playing ? "Stop sample" : "Play sample"}
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
        </button>
      </div>
      <div className="mt-4 flex items-center gap-1 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 42 }).map((_, i) => (
          <span
            key={i}
            className={`w-1 shrink-0 rounded-full ${playing ? "animate-pulse bg-ink" : "bg-line-strong"}`}
            style={{ height: 6 + ((i * 7919) % 18), animationDelay: `${(i % 7) * 90}ms` }}
          />
        ))}
      </div>
      <a href={`/read/${book.slug}?listen=1`} target="_blank" rel="noopener" className="mt-4 inline-block text-sm font-medium text-accent hover:text-accent-deep">
        Open the full book with read-aloud →
      </a>
    </div>
  );
}
