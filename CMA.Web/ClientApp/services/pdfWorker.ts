// Centralized PDF.js worker setup to ensure API/Worker version parity across the app
// Always use the local worker bundled by Vite to avoid CDN mismatches and caching issues.

import type { GlobalWorkerOptions as GlobalWorkerOptionsType } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';
// Import the worker file as a URL that Vite will serve and version together with the API
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

let configured = false;

export function ensurePdfWorker(): void {
  if (configured) return;
  try {
    // Use the same GlobalWorkerOptions object pdfjs uses internally
    (
      pdfjsLib as unknown as { GlobalWorkerOptions: typeof GlobalWorkerOptionsType }
    ).GlobalWorkerOptions.workerSrc = workerUrl as unknown as string;
    configured = true;
  } catch (err) {
    // If something goes wrong, fail silently so the caller can handle errors
    // but log in development for visibility.
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.error('Failed to configure PDF.js workerSrc', err);
    }
  }
}

// Eagerly configure on import for most cases, callers can also call ensurePdfWorker() explicitly
ensurePdfWorker();
