"use client";

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

export interface ReadAloudState {
  open: boolean;
  playing: boolean;
  supported: boolean;
  page: number;
  sentence: string;
  word: string;
  rate: number;
  voice: string | null;
}

const initial: ReadAloudState = { open: false, playing: false, supported: true, page: 0, sentence: "", word: "", rate: 1, voice: null };

/**
 * Imperative speech engine kept outside React state. It reads a PDF one sentence
 * at a time (long utterances stall in some browsers) and reports progress through setState.
 */
class ReadAloudEngine {
  doc: PDFDocumentProxy | null = null;
  numPages = 0;
  lang: "en" | "kn" | "hi" = "en";
  onPage: (n: number) => void = () => {};
  rate = 1;
  voice: SpeechSynthesisVoice | null = null;
  private queue: { page: number; sentences: string[]; index: number } | null = null;
  private stopped = true;
  private cache = new Map<number, string>();

  constructor(private set: Dispatch<SetStateAction<ReadAloudState>>) {}

  private get synth() {
    return typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;
  }

  private async pageText(n: number) {
    if (!this.doc) return "";
    const cached = this.cache.get(n);
    if (cached !== undefined) return cached;
    const page = await this.doc.getPage(n);
    const tc = await page.getTextContent();
    let text = "";
    for (const item of tc.items) {
      if ("str" in item) {
        text += item.str;
        text += item.hasEOL || !item.str.endsWith(" ") ? " " : "";
      }
    }
    text = text.replace(/\s+/g, " ").trim();
    this.cache.set(n, text);
    return text;
  }

  private finish() {
    this.stopped = true;
    this.queue = null;
    this.set((s) => ({ ...s, playing: false, sentence: "", word: "" }));
  }

  private speakNext() {
    const q = this.queue;
    const synth = this.synth;
    if (!q || this.stopped || !synth) return;
    if (q.index >= q.sentences.length) {
      if (q.page < this.numPages) void this.startPage(q.page + 1);
      else this.finish();
      return;
    }
    const sentence = q.sentences[q.index];
    const u = new SpeechSynthesisUtterance(sentence);
    u.rate = this.rate;
    u.lang = this.lang === "en" ? "en-IN" : this.lang === "kn" ? "kn-IN" : "hi-IN";
    if (this.voice) u.voice = this.voice;
    u.onboundary = (ev) => {
      if (ev.name !== "word") return;
      const rest = sentence.slice(ev.charIndex);
      const len = (ev as SpeechSynthesisEvent & { charLength?: number }).charLength ?? Math.max(1, rest.search(/\s|$/));
      this.set((s) => ({ ...s, word: rest.slice(0, Math.max(1, len)) }));
    };
    u.onend = () => {
      if (this.stopped || this.queue !== q) return;
      q.index += 1;
      this.speakNext();
    };
    u.onerror = (e) => {
      if (e.error === "interrupted" || e.error === "canceled") return;
      this.finish();
    };
    this.set((s) => ({ ...s, playing: true, page: q.page, sentence, word: "" }));
    synth.speak(u);
  }

  private async startPage(n: number, fromText?: string): Promise<void> {
    const text = await this.pageText(n);
    if (this.stopped) return;
    let sentences = text.match(/[^.!?।]+[.!?।]+["’”)]?|[^.!?।]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? [];
    if (!sentences.length && text) sentences = [text];
    if (!sentences.length) {
      if (n < this.numPages) return this.startPage(n + 1);
      return this.finish();
    }
    let index = 0;
    if (fromText) {
      const needle = fromText.slice(0, 40).toLowerCase();
      const i = sentences.findIndex((s) => s.toLowerCase().includes(needle));
      if (i >= 0) index = i;
    }
    this.queue = { page: n, sentences, index };
    this.onPage(n);
    this.speakNext();
  }

  play(n: number, fromText?: string) {
    const synth = this.synth;
    if (!synth) return;
    if (synth.paused && this.queue && this.queue.page === n && !fromText) {
      this.stopped = false;
      synth.resume();
      this.set((s) => ({ ...s, playing: true }));
      return;
    }
    synth.cancel();
    this.stopped = false;
    void this.startPage(n, fromText);
  }

  pause() {
    this.synth?.pause();
    this.set((s) => ({ ...s, playing: false }));
  }

  stop() {
    this.synth?.cancel();
    this.finish();
  }

  restartSentence() {
    if (this.queue && !this.stopped) {
      this.synth?.cancel();
      this.speakNext();
    }
  }
}

export function useReadAloud({ doc, numPages, language, onPage }: { doc: PDFDocumentProxy | null; numPages: number; language: string; onPage: (n: number) => void }) {
  const [state, setState] = useState<ReadAloudState>(initial);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const engineRef = useRef<ReadAloudEngine | null>(null);
  const langCode = language === "Kannada" ? "kn" : language === "Hindi" ? "hi" : "en";

  const engine = useCallback(() => {
    if (!engineRef.current) engineRef.current = new ReadAloudEngine(setState);
    return engineRef.current;
  }, []);

  useEffect(() => {
    const e = engine();
    e.doc = doc;
    e.numPages = numPages;
    e.onPage = onPage;
    e.lang = langCode;
  }, [engine, doc, numPages, onPage, langCode]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      const t = setTimeout(() => setState((s) => ({ ...s, supported: false })), 0);
      return () => clearTimeout(t);
    }
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      const preferred = all.filter((v) => v.lang.toLowerCase().startsWith(langCode));
      const list = preferred.length ? preferred : all.filter((v) => v.lang.toLowerCase().startsWith("en"));
      setVoices(list);
      const e = engine();
      if (!e.voice && list.length) {
        e.voice = list.find((v) => /-in\b|india/i.test(v.lang + " " + v.name)) ?? list[0];
        const name = e.voice.name;
        setState((s) => ({ ...s, voice: name }));
      }
    };
    const t = setTimeout(load, 0);
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      clearTimeout(t);
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, [engine, langCode]);

  const play = useCallback((n: number, fromText?: string) => engine().play(n, fromText), [engine]);
  const pause = useCallback(() => engine().pause(), [engine]);
  const stop = useCallback(() => engine().stop(), [engine]);
  const open = useCallback(() => setState((s) => ({ ...s, open: true })), []);
  const close = useCallback(() => {
    engine().stop();
    setState((s) => ({ ...s, open: false }));
  }, [engine]);
  const setRate = useCallback(
    (r: number) => {
      const e = engine();
      e.rate = r;
      setState((s) => ({ ...s, rate: r }));
      e.restartSentence();
    },
    [engine],
  );
  const setVoice = useCallback(
    (name: string) => {
      const e = engine();
      e.voice = voices.find((v) => v.name === name) ?? null;
      setState((s) => ({ ...s, voice: name }));
      e.restartSentence();
    },
    [engine, voices],
  );

  return { state, voices, play, pause, stop, open, close, setRate, setVoice };
}
