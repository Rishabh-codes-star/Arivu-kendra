"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchBar({
  size = "lg",
  defaultValue = "",
  placeholder = "Search by title, author, genre or organization",
  buttonLabel = "Search",
  autoFocus = false,
}: {
  size?: "lg" | "md";
  defaultValue?: string;
  placeholder?: string;
  buttonLabel?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const lg = size === "lg";
  return (
    <form
      role="search"
      className={`flex w-full items-center gap-2 rounded-full border border-line bg-paper-card shadow-card ${lg ? "p-1.5 pl-5" : "p-1 pl-4"}`}
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        router.push(q ? `/books?q=${encodeURIComponent(q)}` : "/books");
      }}
    >
      <Search className={`${lg ? "h-5 w-5" : "h-4 w-4"} shrink-0 text-ink-faint`} aria-hidden="true" />
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search the library"
        className={`min-w-0 flex-1 bg-transparent ${lg ? "py-2.5 text-base" : "py-1.5 text-sm"} text-ink placeholder:text-ink-faint focus:outline-none`}
      />
      <button
        type="submit"
        className={`shrink-0 rounded-full bg-ink font-medium text-paper transition hover:bg-ink-mid ${lg ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-xs"}`}
      >
        {buttonLabel}
      </button>
    </form>
  );
}
