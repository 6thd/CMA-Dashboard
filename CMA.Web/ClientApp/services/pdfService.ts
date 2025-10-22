import * as pdfjsLib from 'pdfjs-dist';
import { ensurePdfWorker } from './pdfWorker';

export interface PDFParseResult {
  text: string;
  pageCount: number;
  fileName: string;
  error?: string;
}

export class PDFService {
  static async parsePDF(file: File): Promise<PDFParseResult> {
    try {
      // Ensure the correct local worker is configured (version-parity with API)
      ensurePdfWorker();

      const arrayBuffer = await this.readFileAsArrayBuffer(file);
      const typedArray = new Uint8Array(arrayBuffer);

      // Add parameters to handle common PDF issues
      const loadingTask = pdfjsLib.getDocument({
        data: typedArray,
        verbosity: 0,
        stopAtErrors: false,
        disableFontFace: true,
      });

      const pdf = await loadingTask.promise;

      let fullText = '';

      // Process pages sequentially to avoid memory issues
      for (let i = 1; i <= pdf.numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();

          // Extract text with better formatting
          const pageText = textContent.items
            .map((item: unknown) =>
              typeof (item as { str?: string }).str === 'string'
                ? ((item as { str?: string }).str as string)
                : ''
            )
            .join(' ')
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();

          if (pageText) {
            fullText += pageText + '\n\n';
          }
        } catch (pageError) {
          console.warn(`Error processing page ${i}:`, pageError);
          // Continue with other pages
        }
      }

      // Clean up the text
      const cleanedText = this.cleanExtractedText(fullText);

      return {
        text: cleanedText,
        pageCount: pdf.numPages,
        fileName: file.name,
      };
    } catch (error: unknown) {
      console.error('Error parsing PDF:', error);
      return {
        text: '',
        pageCount: 0,
        fileName: file.name,
        error: (error as Error)?.message || 'Unknown error occurred while parsing PDF',
      };
    }
  }

  private static readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  private static cleanExtractedText(text: string): string {
    // Remove excessive whitespace and clean up text
    let cleaned = text
      .replace(/\s+/g, ' ') // Normalize all whitespace to single spaces
      .trim();

    // Reduce multiple blank lines
    const tripleNewline = /\n\n\n/g;
    while (cleaned.indexOf('\n\n\n') !== -1) {
      cleaned = cleaned.replace(tripleNewline, '\n\n');
    }

    return cleaned;
  }
}
