"use client";

import type * as PdfJs from "pdfjs-dist";

let promise: Promise<typeof PdfJs> | null = null;

/** Loads pdf.js once on the client and points it at the worker served from /public. */
export function loadPdfjs(): Promise<typeof PdfJs> {
  if (!promise) {
    promise = import("pdfjs-dist").then((mod) => {
      mod.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      return mod;
    });
  }
  return promise;
}
