import Link from "next/link";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="4" y="9" width="6" height="19" rx="1.2" fill="#2f4d8a" />
      <rect x="11.5" y="5" width="6" height="23" rx="1.2" fill="#3c6b4a" />
      <rect x="19" y="10" width="6" height="18" rx="1.2" fill="#c99a2e" transform="rotate(-9 22 19)" />
      <rect x="2" y="28" width="28" height="2" rx="1" fill="#1c1915" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Arivu home">
      <LogoMark />
      <span className="flex flex-col">
        <span className="display text-[1.35rem] font-semibold leading-none tracking-tight">Arivu</span>
        <span className="font-kannada mt-1.5 text-[0.72rem] leading-none text-ink-soft">ಅರಿವು · ಜ್ಞಾನ ಎಲ್ಲರಿಗೂ</span>
      </span>
    </Link>
  );
}
