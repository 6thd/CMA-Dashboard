/**
 * PDF Content Extraction Service
 * Extract text, questions, and generate study materials from PDF
 */

import * as pdfjsLib from 'pdfjs-dist';
import { ensurePdfWorker } from './pdfWorker';
import { httpClient } from '@/utils/httpClient';

export interface ExtractedQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  page: number;
  topic: string;
}

export interface ExtractedTopic {
  id: string;
  title: string;
  content: string;
  pages: number[];
  keywords: string[];
}

export interface PDFContent {
  text: string;
  pages: number;
  topics: ExtractedTopic[];
  questions: ExtractedQuestion[];
  keywords: string[];
}

class PDFService {
  /**
   * Extract all text from PDF
   */
  async extractText(fileUrl: string): Promise<string> {
    try {
      ensurePdfWorker();
      const pdf = await pdfjsLib.getDocument(fileUrl).promise;
      const numPages = pdf.numPages;
      let fullText = '';

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: unknown) =>
            typeof (item as { str?: string }).str === 'string'
              ? ((item as { str?: string }).str as string)
              : ''
          )
          .join(' ');
        fullText += pageText + '\n\n';
      }

      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('فشل في استخراج النص من PDF');
    }
  }

  /**
   * Extract text by page
   */
  async extractTextByPage(fileUrl: string): Promise<Map<number, string>> {
    try {
      ensurePdfWorker();
      const pdf = await pdfjsLib.getDocument(fileUrl).promise;
      const numPages = pdf.numPages;
      const pageTexts = new Map<number, string>();

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: unknown) =>
            typeof (item as { str?: string }).str === 'string'
              ? ((item as { str?: string }).str as string)
              : ''
          )
          .join(' ');
        pageTexts.set(pageNum, pageText);
      }

      return pageTexts;
    } catch (error) {
      console.error('Error extracting text by page:', error);
      throw new Error('فشل في استخراج النص من الصفحات');
    }
  }

  /**
   * Extract questions from PDF using AI
   */
  async extractQuestions(pdfText: string): Promise<ExtractedQuestion[]> {
    try {
      const response = await httpClient.post<{ questions: ExtractedQuestion[] }>(
        '/api/ai/extract-questions',
        { text: pdfText }
      );

      return response.questions;
    } catch (error) {
      console.error('Error extracting questions:', error);
      throw new Error('فشل في استخراج الأسئلة');
    }
  }

  /**
   * Extract topics and structure from PDF
   */
  async extractTopics(pdfText: string): Promise<ExtractedTopic[]> {
    try {
      const response = await httpClient.post<{ topics: ExtractedTopic[] }>(
        '/api/ai/extract-topics',
        { text: pdfText }
      );

      return response.topics;
    } catch (error) {
      console.error('Error extracting topics:', error);
      throw new Error('فشل في استخراج المواضيع');
    }
  }

  /**
   * Extract keywords from text
   */
  extractKeywords(text: string): string[] {
    // Simple keyword extraction (can be enhanced with AI)
    const words = text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 4)
      .filter(word => !/^\d+$/.test(word)); // Remove numbers

    // Count word frequency
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

    // Sort by frequency and take top 50
    const keywords = Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
      .map(([word]) => word);

    return keywords;
  }

  /**
   * Generate flashcards from PDF content
   */
  async generateFlashcards(text: string): Promise<Array<{ front: string; back: string }>> {
    try {
      const response = await httpClient.post<{
        flashcards: Array<{ front: string; back: string }>;
      }>('/api/ai/generate-flashcards', { text });

      return response.flashcards;
    } catch (error) {
      console.error('Error generating flashcards:', error);
      throw new Error('فشل في توليد البطاقات التعليمية');
    }
  }

  /**
   * Generate summary of PDF content
   */
  async generateSummary(text: string, maxLength: number = 500): Promise<string> {
    try {
      const response = await httpClient.post<{ summary: string }>('/api/ai/generate-summary', {
        text,
        maxLength,
      });

      return response.summary;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('فشل في توليد الملخص');
    }
  }

  /**
   * Search within PDF content
   */
  searchInPDF(
    pageTexts: Map<number, string>,
    query: string
  ): Array<{
    page: number;
    text: string;
    position: number;
  }> {
    const results: Array<{ page: number; text: string; position: number }> = [];
    const lowerQuery = query.toLowerCase();

    pageTexts.forEach((text, page) => {
      const lowerText = text.toLowerCase();
      let position = lowerText.indexOf(lowerQuery);

      while (position !== -1) {
        // Extract context (50 chars before and after)
        const start = Math.max(0, position - 50);
        const end = Math.min(text.length, position + query.length + 50);
        const context = text.substring(start, end);

        results.push({
          page,
          text: context,
          position,
        });

        position = lowerText.indexOf(lowerQuery, position + 1);
      }
    });

    return results;
  }

  /**
   * Generate practice exam from PDF
   */
  async generatePracticeExam(
    text: string,
    numQuestions: number = 20
  ): Promise<ExtractedQuestion[]> {
    try {
      const response = await httpClient.post<{ questions: ExtractedQuestion[] }>(
        '/api/ai/generate-practice-exam',
        { text, numQuestions }
      );

      return response.questions;
    } catch (error) {
      console.error('Error generating practice exam:', error);
      throw new Error('??? ?? ????? ?????? ??????');
    }
  }

  /**
   * Analyze difficulty level of content
   */
  async analyzeDifficulty(text: string): Promise<{
    level: 'beginner' | 'intermediate' | 'advanced';
    score: number;
    readabilityIndex: number;
  }> {
    try {
      const response = await httpClient.post<{
        level: 'beginner' | 'intermediate' | 'advanced';
        score: number;
        readabilityIndex: number;
      }>('/api/ai/analyze-difficulty', { text });

      return response;
    } catch (error) {
      console.error('Error analyzing difficulty:', error);
      throw new Error('??? ?? ????? ????? ???????');
    }
  }

  /**
   * Extract table of contents
   */
  async extractTableOfContents(fileUrl: string): Promise<
    Array<{
      title: string;
      page: number;
      level: number;
    }>
  > {
    try {
      const pdf = await pdfjsLib.getDocument(fileUrl).promise;
      const outline = await pdf.getOutline();

      if (!outline) {
        return [];
      }

      const toc: Array<{ title: string; page: number; level: number }> = [];

      const processOutline = async (items: unknown[], level: number = 0) => {
        for (const item of items) {
          const outlineItem = item as { title?: string; dest?: unknown; items?: unknown[] };
          if (outlineItem.dest) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dest = await pdf.getDestination(outlineItem.dest as any);
            if (dest) {
              const pageIndex = await pdf.getPageIndex(dest[0]);
              toc.push({
                title: outlineItem.title ?? '',
                page: pageIndex + 1,
                level,
              });
            }
          }

          if (outlineItem.items && outlineItem.items.length > 0) {
            await processOutline(outlineItem.items, level + 1);
          }
        }
      };

      await processOutline(outline);
      return toc;
    } catch (error) {
      console.error('Error extracting table of contents:', error);
      return [];
    }
  }

  /**
   * Get PDF metadata
   */
  async getPDFMetadata(fileUrl: string): Promise<{
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  }> {
    try {
      const pdf = await pdfjsLib.getDocument(fileUrl).promise;
      const metadata = await pdf.getMetadata();
      const info = metadata.info as Record<string, unknown>;

      return {
        title: info?.Title as string | undefined,
        author: info?.Author as string | undefined,
        subject: info?.Subject as string | undefined,
        keywords: info?.Keywords as string | undefined,
        creator: info?.Creator as string | undefined,
        producer: info?.Producer as string | undefined,
        creationDate: info?.CreationDate as Date | undefined,
        modificationDate: info?.ModDate as Date | undefined,
      };
    } catch (error) {
      console.error('Error getting PDF metadata:', error);
      return {};
    }
  }
}

export const pdfService = new PDFService();
export default pdfService;
