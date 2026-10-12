# Arivu · public library site

Public-facing side of the **Arivu Kendra Digital Platform** (Department of Rural Development and Panchayat Raj, Government of Karnataka). An open library where books from partner organizations can be read, listened to and discussed by anyone.

## Run it

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build (all routes prerender statically)
pnpm pdfs       # regenerate the sample PDFs in public/pdfs
pnpm lint
```

Stack: Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4, pdf.js, lucide icons. No backend yet; all content is local mock data.

## Where things live

| Path | What |
| --- | --- |
| `src/data/organizations.ts` | The ten partner slots (8 from the FRS + 2 reserved placeholders), with colours, motifs and image prompts |
| `src/data/books.ts` | 33 sample books with metadata, chapters, quiz questions and discussion threads |
| `src/lib/catalog.ts` | Read helpers: trending, similar books, ratings breakdown, chapter page map |
| `src/lib/images.ts` | Picks up `public/images/hero.*` and `public/images/orgs/<slug>.*` if they exist |
| `src/app/(site)/` | Home, `/books` catalogue, `/books/[slug]`, `/organizations`, `/organizations/[slug]` |
| `src/app/read/[slug]` | Full-screen reader (opens in a new tab) |
| `src/components/reader/` | pdf.js reader: highlighter, magnifier, dictionary, read-aloud, contents, themes |
| `src/app/api/define` | Dictionary proxy (Free Dictionary API, English only for now) |
| `scripts/make-pdfs.ts` | Generates a readable placeholder PDF per book (title page, contents, chapters) |
| `public/images/` | AI-generated hero and organization banners. Replace any file to change the artwork; filenames are the contract |

## What is real and what is mocked

- **Books, PDFs, covers**: sample data. Covers are drawn procedurally from each book's palette and style; PDFs are generated placeholder prose so previews, search-in-text, highlighting and read-aloud work end to end.
- **Quiz**: client-side only, no scores stored.
- **Discussion**: seeded threads; new posts live in the page until refresh (no auth yet; FRS asks for Mobile OTP).
- **Read aloud / Listen**: uses the browser's speech engine (Web Speech API) on the PDF's text layer. Narrated audio files can replace this per book later.
- **Dictionary**: proxied through `/api/define`; swap in a Kannada/Hindi source there.
- **Highlights**: saved in the browser's localStorage per book.

## Reader shortcuts

`←` `→` pages · `+` `−` zoom · `H` highlighter · `M` magnifier · `D` dictionary · `Esc` exit tool. Select any text for the floating highlight / define / read-from-here / copy bar.

## Next steps (not in this pass)

Backend and content-provider upload flow, Mobile OTP sign-in, Kannada and Hindi UI strings, events calendar (FRS §6), real narrated audio, analytics/telemetry events.
