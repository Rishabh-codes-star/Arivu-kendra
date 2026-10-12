/**
 * Generates a readable sample PDF for every book in the catalogue so the reader,
 * previews and downloads work end to end. Run: pnpm pdfs
 */
import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";
import { books } from "../src/data/books";
import { organizations } from "../src/data/organizations";

const OUT = path.join(process.cwd(), "public", "pdfs");
fs.mkdirSync(OUT, { recursive: true });

const KANNADA_FONT = "/System/Library/Fonts/Supplemental/Kannada MN.ttc";
const DEVANAGARI_FONT = "/System/Library/Fonts/Supplemental/DevanagariMT.ttc";

const bank: Record<string, string[]> = {
  story: [
    "The morning began the way most mornings in the village did: with the temple bell carried across the fields, the smell of woodsmoke from the first kitchen fires, and the crows arguing on the tamarind tree about who had slept where. Nobody paid the crows much attention, except for one small person who was already awake and already wondering.",
    "Ajji said that stories were like water. You could not hold them in your hands, but you could carry them in a pot, and if you were careful you could pour a little for everyone who came to the door. She said this while shelling peas, which was how she said most of the important things.",
    "There is a road that goes out of the village past the pump house and the broken cart, and if you follow it far enough it turns into a path, and the path turns into a track between two fields, and the track ends at a stone where the hill begins. Everyone knows the stone. Not everyone has sat on it.",
    "The rain, when it came, did not come all at once. First the dust lifted, then the leaves turned their pale sides up, then a single drop landed on the tin roof of the ration shop with a sound like a struck bell. After that, nobody could count.",
    "“You cannot keep it,” said the old woman, not unkindly. “But you can remember it. That is what people are for.” And she handed back the pot, which was empty, and which was somehow heavier than before.",
    "By evening the whole village had heard. The postman told the tailor, the tailor told the women at the well, and the women at the well told the children, who had known since the morning but were polite enough to act surprised.",
  ],
  science: [
    "Before you look for anything in the night sky, give your eyes twenty minutes. In that time the pupils widen and a chemical in the retina rebuilds itself, and stars that were invisible when you stepped outside will simply appear, as if someone had switched them on. Keep your phone in your pocket; one bright screen undoes the whole twenty minutes.",
    "A shadow is only ever as long as the angle of the light allows. At sunrise and sunset the Sun is low and shadows stretch across the whole field. At noon the Sun is high and the shadow shrinks to a small patch at your feet. On two days of the year, at places between the tropics, it shrinks to nothing at all.",
    "Try this: hold your arm straight out and make a fist. The width of your fist against the sky is about ten degrees. Three fists stacked from the horizon is thirty degrees, which on a December evening in Karnataka is roughly where you will find Jupiter. Astronomers have used this trick for thousands of years, and it still works.",
    "Record what you see, even when it seems like nothing. Date, time, where you stood, how clear the sky was, what you noticed. A single observation is a story; a hundred observations from a hundred villages is data, and data is how we learn things nobody has learned before.",
    "The light from a lamp falls off quickly as you walk away from it. Double the distance and the light on your page is a quarter as bright. This is the inverse square law, and it is why a candle across the room is dim while the Sun, which is a hundred and fifty million kilometres away, can still burn your skin.",
    "A lens does one thing: it bends light. A convex lens bends rays together to a point we call the focus. A concave lens spreads them apart. Everything else, the spectacles, the microscope, the camera, the telescope on the roof of the library, is a careful arrangement of this one idea.",
  ],
  study: [
    "Read the question twice before you write anything. Most marks are lost not because the student did not know the answer, but because they answered a slightly different question. Underline what is being asked. Then, and only then, begin.",
    "Work through the example in the margin with a pencil, covering the solution with your hand and checking one line at a time. If you can predict the next line, you understand the method. If you cannot, read the explanation again; it is written to be read more than once.",
    "Practice is not the same as repetition. Repetition is doing the same sum ten times. Practice is doing ten different sums that use the same idea, until the idea is yours and the sums no longer matter.",
    "At the end of each section there is a short set of exercises. Do them without looking back at the text. Mark your own work honestly using the key at the back. A wrong answer that you understand is worth more than a right answer that you guessed.",
    "Keep a page at the back of your notebook for mistakes. Write the question, what you did, and what you should have done. Before any test, read that page instead of the whole book. It is the shortest and most useful chapter you will ever write.",
    "When you are ready, close the book, set a timer for forty minutes and attempt the practice paper as if it were the real one. Then open the book again. The purpose of the paper is not to score; it is to find out what to read next.",
  ],
  civic: [
    "A right is a promise that the country makes to every person in it, written down so that it cannot be forgotten. The Constitution of India makes these promises in a section called the Fundamental Rights, and it makes them to children as much as to adults.",
    "In this activity, draw the person before you turn the page. Do not think too long about it. When everyone has drawn, hold the pictures up together and look at what the group imagined. Then turn the page, and talk about what you see.",
    "The Gram Sabha is the one meeting where every adult in the village has a vote and a voice. It is where the Panchayat explains what it spent and asks what to do next. A question asked here, politely and in public, is one of the most powerful things an ordinary person can do.",
    "Equality does not mean that everyone is the same. It means that the same rules apply to everyone, and that nobody is kept away from a school, a well or a job because of who their parents are, what they believe or whether they are a girl or a boy.",
    "Reflection question: think of a time when you were treated unfairly. What would have made it fair? Now think of a time when you treated someone else unfairly, even by accident. What would you do differently today? You do not have to say your answer aloud. You only have to think it honestly.",
    "The librarian's note: this activity works best in groups of five or six. Let the children lead. Your job is to ask “why?” one more time than feels comfortable, and then to be quiet.",
  ],
  practice: [
    "Begin with the room. Move one table, open one window, put the best book face-out on the lowest shelf. Children notice a room that has been arranged for them before they notice anything you say.",
    "Write the date, the amount and the name every single time, in the same place on the page. A ledger is not a story; it is a habit. The habit is what protects the group when memory fails or when someone new takes over.",
    "A one-page résumé has four parts: who you are, what you have studied, what you can do, and how to reach you. Everything else is decoration. If you are not sure whether to include something, leave it out and be ready to talk about it instead.",
    "Ask the student what they like doing on a Sunday. Not what they are good at, not what their parents want, what they actually choose when nobody is choosing for them. The answer is usually the beginning of a career, if you follow it far enough.",
    "The first session will be small. Read anyway. Read as if the room were full, sitting where you can be seen from the door. Children are curious creatures; by the third week they will have found you.",
    "Keep a list of every scholarship with four columns: who can apply, how much, what papers, and the last date. Pin it where everyone can see it. Half the scholarships in Karnataka go unclaimed because nobody knew the date.",
  ],
};

function family(genre: string): string[] {
  if (["Picture Books", "Folk Tales", "Environment"].includes(genre)) return bank.story;
  if (["Science", "Astronomy"].includes(genre)) return bank.science;
  if (["Civics"].includes(genre)) return bank.civic;
  if (["Library Practice", "Life Skills", "Careers"].includes(genre)) return bank.practice;
  return bank.study;
}

function hasNonLatin(s: string) {
  return /[ಀ-೿ऀ-ॿ]/.test(s);
}

async function makePdf(book: (typeof books)[number]) {
  const org = organizations.find((o) => o.slug === book.org)!;
  const target = Math.min(book.pages, 48);
  const doc = new PDFDocument({
    size: [420, 595],
    margins: { top: 56, bottom: 56, left: 48, right: 48 },
    bufferPages: true,
    info: { Title: book.titleLatin ?? book.title, Author: book.author, Subject: book.genre, Keywords: book.tags.join(", "), Creator: "Arivu Kendra Digital Platform" },
  });
  const out = path.join(OUT, `${book.slug}.pdf`);
  const stream = fs.createWriteStream(out);
  doc.pipe(stream);

  // Register script fonts where available (macOS system fonts).
  let kannada = false;
  let devanagari = false;
  try {
    doc.registerFont("Kannada", KANNADA_FONT, "KannadaMN");
    doc.font("Kannada");
    kannada = true;
  } catch {
    kannada = false;
  }
  try {
    doc.registerFont("Devanagari", DEVANAGARI_FONT, "DevanagariMT");
    doc.font("Devanagari");
    devanagari = true;
  } catch {
    devanagari = false;
  }

  const scriptFont = (s: string, fallback: string) => {
    if (/[ಀ-೿]/.test(s) && kannada) return "Kannada";
    if (/[ऀ-ॿ]/.test(s) && devanagari) return "Devanagari";
    return fallback;
  };
  const titleForHeader = hasNonLatin(book.title) && !(kannada || devanagari) ? book.titleLatin ?? book.title : book.title;

  // ── Title page ──
  const [bg, fg, accent] = [book.cover.bg, book.cover.fg, book.cover.accent];
  doc.rect(0, 0, 420, 595).fill(bg);
  doc.rect(0, 330, 420, 70).fill(accent);
  doc.fillColor(fg);
  doc.font("Helvetica").fontSize(8).text(org.name.toUpperCase(), 48, 60, { characterSpacing: 1.5 });
  doc.font(scriptFont(book.title, "Times-Bold")).fontSize(hasNonLatin(book.title) ? 30 : 34).text(book.title, 48, 110, { width: 324, lineGap: 2 });
  if (book.subtitle) doc.moveDown(0.4).font("Times-Italic").fontSize(14).text(book.subtitle, { width: 324 });
  if (book.titleLatin) doc.moveDown(0.3).font("Helvetica").fontSize(10).text(book.titleLatin, { width: 324 });
  doc.font("Helvetica").fontSize(12).fillColor(fg).text(book.author, 48, 420);
  if (book.illustrator) doc.fontSize(10).text(`Illustrated by ${book.illustrator}`);
  doc.fontSize(8).text(`${book.year} · ${book.language} · ${book.license}`, 48, 498, { lineBreak: false });
  doc.text("Arivu Kendra sample edition · Government of Karnataka", 48, 512, { lineBreak: false });

  // ── Contents ──
  doc.addPage();
  doc.fillColor("#1c1915").font("Times-Bold").fontSize(20).text("Contents", { paragraphGap: 14 });
  const chapterPagesPlan: number[] = [];
  const per = (target - 2) / book.chapters.length;
  book.chapters.forEach((c, i) => {
    const start = 3 + Math.floor(i * per);
    chapterPagesPlan.push(start);
    doc.font(scriptFont(c, "Times-Roman")).fontSize(11.5).text(`${i + 1}.  ${c}`, { continued: true }).font("Times-Roman").text(`   ${start}`, { align: "right" });
    doc.moveDown(0.3);
  });
  doc.moveDown(1.5);
  doc.font("Helvetica").fontSize(8.5).fillColor("#6b6256").text(
    "This is a generated sample edition created for the Arivu Kendra public preview. The text on these pages is placeholder prose so that reading tools, previews and downloads can be demonstrated end to end. The real edition will be supplied by the content provider.",
    { width: 324, lineGap: 2 },
  );

  // ── Chapters ──
  const paras = family(book.genre);
  let pi = 0;
  book.chapters.forEach((chapter, ci) => {
    doc.addPage();
    const endPage = ci + 1 < book.chapters.length ? chapterPagesPlan[ci + 1] - 1 : target;
    doc.fillColor("#9a9184").font("Helvetica").fontSize(8).text(`CHAPTER ${ci + 1}`, { characterSpacing: 1.5 });
    doc.fillColor("#1c1915").font(scriptFont(chapter, "Times-Bold")).fontSize(22).text(chapter, { lineGap: 2 });
    doc.moveDown(0.8);
    doc.font("Times-Roman").fontSize(11.5).fillColor("#1c1915");
    if (ci === 0) {
      doc.text(book.description, { align: "left", lineGap: 3, paragraphGap: 10 });
    }
    let guard = 0;
    while (doc.bufferedPageRange().count < endPage && guard < 200) {
      doc.text(paras[pi % paras.length], { align: "left", lineGap: 3, paragraphGap: 10 });
      pi++;
      guard++;
    }
    // Pad so the next chapter starts on its planned page.
    while (doc.bufferedPageRange().count < endPage) doc.addPage();
  });

  // ── Running headers and page numbers ──
  const range = doc.bufferedPageRange();
  for (let i = 1; i < range.count; i++) {
    doc.switchToPage(i);
    const m = doc.page.margins;
    doc.page.margins.bottom = 0;
    doc.page.margins.top = 0;
    doc.fillColor("#9a9184").font(scriptFont(titleForHeader, "Helvetica")).fontSize(7.5).text(titleForHeader, 48, 28, { width: 260, lineBreak: false, ellipsis: true });
    doc.font("Helvetica").fontSize(8).text(String(i + 1), 48, 560, { width: 324, align: "center", lineBreak: false });
    doc.page.margins.bottom = m.bottom;
    doc.page.margins.top = m.top;
  }

  doc.end();
  await new Promise<void>((resolve, reject) => {
    stream.on("finish", () => resolve());
    stream.on("error", reject);
  });
  return { out, pages: range.count, kannada, devanagari };
}

(async () => {
  let n = 0;
  for (const book of books) {
    const r = await makePdf(book);
    n++;
    console.log(`${book.slug}.pdf · ${r.pages} pages${r.kannada ? "" : " · no Kannada font"}`);
  }
  console.log(`\nWrote ${n} PDFs to ${OUT}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
