"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "kn";

const dictionary = {
  en: {
    "nav.library": "Library",
    "nav.organizations": "Organizations",
    "nav.trending": "Trending",
    "nav.search": "Search the library",
    "nav.switch": "Switch to Kannada",
    "hero.pill": "Books trending this week",
    "hero.title1": "The village library,",
    "hero.title2": "now everywhere.",
    "hero.subtitle": "Read or listen to books from Karnataka's partner organizations. Free, open to everyone, in Kannada, Hindi and English.",
    "hero.placeholder": "Search by title, author, genre or organization",
    "hero.search": "Search",
    "hero.books": "{books} books from {orgs} organizations",
    "hero.readAloud": "Read aloud on every book",
    "skip": "Skip to content",
  },
  kn: {
    "nav.library": "ಗ್ರಂಥಾಲಯ",
    "nav.organizations": "ಸಂಸ್ಥೆಗಳು",
    "nav.trending": "ಜನಪ್ರಿಯ",
    "nav.search": "ಗ್ರಂಥಾಲಯದಲ್ಲಿ ಹುಡುಕಿ",
    "nav.switch": "Switch to English",
    "hero.pill": "ಈ ವಾರದ ಜನಪ್ರಿಯ ಪುಸ್ತಕಗಳು",
    "hero.title1": "ಹಳ್ಳಿಯ ಗ್ರಂಥಾಲಯ,",
    "hero.title2": "ಈಗ ಎಲ್ಲೆಡೆ.",
    "hero.subtitle": "ಕರ್ನಾಟಕದ ಸಹಭಾಗಿ ಸಂಸ್ಥೆಗಳ ಪುಸ್ತಕಗಳನ್ನು ಓದಿ ಅಥವಾ ಕೇಳಿ. ಉಚಿತ, ಎಲ್ಲರಿಗೂ ಮುಕ್ತ, ಕನ್ನಡ, ಹಿಂದಿ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ.",
    "hero.placeholder": "ಶೀರ್ಷಿಕೆ, ಲೇಖಕ, ಪ್ರಕಾರ ಅಥವಾ ಸಂಸ್ಥೆಯ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ",
    "hero.search": "ಹುಡುಕಿ",
    "hero.books": "{orgs} ಸಂಸ್ಥೆಗಳ {books} ಪುಸ್ತಕಗಳು",
    "hero.readAloud": "ಪ್ರತಿ ಪುಸ್ತಕವನ್ನೂ ಓದಿ ಕೇಳಿಸಲಾಗುತ್ತದೆ",
    "skip": "ವಿಷಯಕ್ಕೆ ಹೋಗಿ",
  },
} as const;

export type Key = keyof (typeof dictionary)["en"];

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: Key, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "arivu:lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Restore the saved choice after hydration so server and client markup match on first paint.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "kn" || saved === "en") setLangState(saved);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(() => setLangState((l) => (l === "en" ? "kn" : "en")), []);
  const t = useCallback(
    (key: Key, vars?: Record<string, string | number>) => {
      let out: string = dictionary[lang][key] ?? dictionary.en[key];
      if (vars) for (const [k, v] of Object.entries(vars)) out = out.replace(`{${k}}`, String(v));
      return out;
    },
    [lang],
  );

  return <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>{children}</LanguageContext.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
