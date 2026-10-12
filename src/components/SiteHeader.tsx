"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLang, type Key } from "@/components/LanguageProvider";

const nav: { href: string; key: Key }[] = [
  { href: "/books", key: "nav.library" },
  { href: "/organizations", key: "nav.organizations" },
  { href: "/#trending", key: "nav.trending" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { t, lang } = useLang();
  const kn = lang === "kn";
  const overlay = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const solid = !overlay || scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        solid ? "bg-paper/85 backdrop-blur-md border-b border-line/70" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/#trending" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-paper-deep ${kn ? "font-kannada" : ""} ${
                  active ? "text-ink bg-paper-deep/70" : "text-ink-soft hover:text-ink"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/books"
            className="hidden items-center gap-2 rounded-full border border-line bg-paper-card/80 px-4 py-2 text-sm text-ink-soft shadow-card transition hover:border-line-strong hover:text-ink sm:inline-flex"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className={kn ? "font-kannada" : ""}>{t("nav.search")}</span>
            <kbd className="ml-1 rounded border border-line bg-paper px-1.5 text-[10px] text-ink-faint">/</kbd>
          </Link>
          <LanguageToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper-card/80 md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line bg-paper px-4 py-3 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`rounded-lg px-3 py-3 text-base font-medium hover:bg-paper-deep ${kn ? "font-kannada" : ""}`}>
                {t(item.key)}
              </Link>
            ))}
            <Link href="/books" onClick={() => setOpen(false)} className={`mt-1 inline-flex items-center gap-2 rounded-lg px-3 py-3 text-base text-ink-soft ${kn ? "font-kannada" : ""}`}>
              <Search className="h-4 w-4" /> {t("nav.search")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
