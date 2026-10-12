"use client";

import { useState, type ReactNode } from "react";

export function Expandable({ children, className = "", collapsedLines = 4 }: { children: ReactNode; className?: string; collapsedLines?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className={className} style={open ? undefined : { display: "-webkit-box", WebkitLineClamp: collapsedLines, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {children}
      </div>
      <button type="button" onClick={() => setOpen((v) => !v)} className="mt-2 text-sm font-medium text-accent hover:text-accent-deep">
        {open ? "less" : "more"}
      </button>
    </div>
  );
}
