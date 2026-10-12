import type { ReactNode } from "react";

export interface InfoItem {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
}

/** App Store style stat strip: label above, large value, small caption below. */
export function InfoStrip({ items }: { items: InfoItem[] }) {
  return (
    <div className="scroll-row -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <dl className="flex min-w-max divide-x divide-line border-y border-line sm:min-w-0 sm:justify-between">
        {items.map((it) => (
          <div key={it.label} className="flex min-w-[120px] flex-1 flex-col items-center px-4 py-4 text-center sm:min-w-0">
            <dt className="eyebrow text-ink-faint">{it.label}</dt>
            <dd className="display mt-1.5 text-xl font-semibold leading-none text-ink-soft sm:text-2xl">{it.value}</dd>
            {it.sub && <dd className="mt-1.5 text-xs text-ink-faint">{it.sub}</dd>}
          </div>
        ))}
      </dl>
    </div>
  );
}
