import Link from "next/link";
import { LogoMark } from "@/components/Logo";

const COPYRIGHT_YEAR = 2026;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-deep/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-start gap-3">
            <LogoMark className="mt-0.5 h-9 w-9 shrink-0" />
            <div className="display text-xl font-semibold leading-tight">
              Arivu Kendra
              <br />
              Digital Platform
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft">
            An open library for the 6,000 Gram Panchayat libraries renovated under Oduva Belaku, the Right of Reading programme. Every
            book here is free to read, listen to and share.
          </p>
          <p className="mt-4 font-kannada text-sm text-ink-soft">ಓದುವ ಬೆಳಕು · ಜ್ಞಾನ ಎಲ್ಲರಿಗೂ, ಎಲ್ಲೆಡೆ</p>
        </div>
        <FooterCol
          title="Library"
          links={[
            ["All books", "/books"],
            ["Trending this week", "/#trending"],
            ["Picture books", "/books?genre=Picture%20Books"],
            ["Astronomy", "/books?genre=Astronomy"],
            ["Open schooling", "/books?genre=Open%20Schooling"],
          ]}
        />
        <FooterCol
          title="Organizations"
          links={[
            ["All partners", "/organizations"],
            ["Pratham Books", "/organizations/pratham-books"],
            ["Indian Institute of Astrophysics", "/organizations/iia"],
            ["Sikshana Foundation", "/organizations/sikshana"],
            ["NIOS", "/organizations/nios"],
          ]}
        />
        <FooterCol
          title="Platform"
          links={[
            ["Accessibility", "/#accessibility"],
            ["Languages: ಕನ್ನಡ · हिन्दी · English", "/books"],
            ["Content providers", "/organizations"],
            ["Centre for Smart Governance", "https://csg.karnataka.gov.in"],
          ]}
        />
      </div>
      <div className="border-t border-line/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>© {COPYRIGHT_YEAR} Department of Rural Development and Panchayat Raj, Government of Karnataka · Built by the Centre for Smart Governance</span>
          <span>Public preview · Content licences are shown on each book</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="eyebrow text-ink-faint">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map(([label, href]) => (
          <li key={href + label}>
            <Link href={href} className="text-ink-soft transition hover:text-ink">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
