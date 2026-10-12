"use client";

import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import type { QuizQuestion } from "@/lib/types";

export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const score = answers.filter((a, i) => a === questions[i].answer).length;
  const complete = answers.every((a) => a !== null);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {questions.map((qq, qi) => (
        <fieldset key={qi} className="rounded-xl3 border border-line bg-paper-card p-5">
          <legend className="sr-only">Question {qi + 1}</legend>
          <div className="eyebrow text-ink-faint">Question {qi + 1}</div>
          <p className="display mt-1 text-lg font-semibold leading-snug">{qq.q}</p>
          <div className="mt-4 space-y-2">
            {qq.options.map((opt, oi) => {
              const chosen = answers[qi] === oi;
              const correct = qq.answer === oi;
              let tone = "border-line hover:border-line-strong";
              if (submitted && correct) tone = "border-moss bg-moss-soft";
              else if (submitted && chosen && !correct) tone = "border-ink-faint bg-paper-deep";
              else if (chosen) tone = "border-ink bg-paper-deep";
              return (
                <label key={oi} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${tone}`}>
                  <input
                    type="radio"
                    name={`q${qi}`}
                    className="accent-ink"
                    checked={chosen}
                    disabled={submitted}
                    onChange={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                  />
                  <span className="flex-1">{opt}</span>
                  {submitted && correct && <Check className="h-4 w-4 text-moss" aria-label="Correct" />}
                  {submitted && chosen && !correct && <X className="h-4 w-4 text-ink-soft" aria-label="Incorrect" />}
                </label>
              );
            })}
          </div>
          {submitted && qq.explain && <p className="mt-3 text-xs leading-relaxed text-ink-soft">{qq.explain}</p>}
        </fieldset>
      ))}
      <div className="flex items-center gap-4 lg:col-span-3">
        {!submitted ? (
          <button
            type="button"
            disabled={!complete}
            onClick={() => setSubmitted(true)}
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check my answers
          </button>
        ) : (
          <>
            <div className="display text-2xl font-semibold">
              {score} / {questions.length}
              <span className="ml-3 text-base font-normal text-ink-soft">
                {score === questions.length ? "Perfect. You read closely." : score >= questions.length / 2 ? "Good going. Have another look at the ones you missed." : "Worth a second read, the answers are all in the book."}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setAnswers(questions.map(() => null));
                setSubmitted(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-line-strong"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
