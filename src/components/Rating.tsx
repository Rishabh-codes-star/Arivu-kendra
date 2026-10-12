import { Star } from "lucide-react";

export function Rating({ value, size = "sm", showValue = true, className = "" }: { value: number; size?: "sm" | "md"; showValue?: boolean; className?: string }) {
  const dim = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`${value.toFixed(1)} out of 5`}>
      <span className="inline-flex items-center gap-px" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${dim} ${i <= Math.round(value) ? "fill-ink-soft text-ink-soft" : "fill-line text-line"}`}
            strokeWidth={0}
          />
        ))}
      </span>
      {showValue && <span className={`${size === "sm" ? "text-xs" : "text-sm"} font-medium text-ink-soft`}>{value.toFixed(1)}</span>}
    </span>
  );
}
