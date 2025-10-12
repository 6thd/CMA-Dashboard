import * as pdfjsLib from 'pdfjs-dist';

// Handle worker loading more robustly
let workerInitialized = false;

const initializeWorker = async () => {
  if (workerInitialized) return;
  
  try {
    // Try to load worker from CDN with https protocol (more reliable)
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    workerInitialized = true;
  } catch (error) {
    console.warn('Failed to load PDF worker from CDN, trying local build:', error);
    try {
      // Fallback to local build
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.min.mjs';
      workerInitialized = true;
    } catch (localError) {
      console.error('Failed to initialize PDF worker from local build:', localError);
      throw new Error('Failed to initialize PDF processing worker from both CDN and local sources');
    }
  }
};

export interface PDFParseResult {
  text: string;
  pageCount: number;
  fileName: string;
  error?: string;
}

export class PDFService {
  static async parsePDF(file: File): Promise<PDFParseResult> {
    try {
      // Initialize worker if not already done
      await initializeWorker();
      
      const arrayBuffer = await this.readFileAsArrayBuffer(file);
      const typedArray = new Uint8Array(arrayBuffer);
      
      // Add parameters to handle common PDF issues
      const loadingTask = pdfjsLib.getDocument({
        data: typedArray,
        verbosity: 0,
        stopAtErrors: false,
        disableFontFace: true
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
            .map((item: any) => item.str || '')
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
        fileName: file.name
      };
    } catch (error: any) {
      console.error("Error parsing PDF:", error);
      return {
        text: '',
        pageCount: 0,
        fileName: file.name,
        error: error.message || 'Unknown error occurred while parsing PDF'
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
    const regex = new RegExp('\n\n\n', 'g');
    while (cleaned.indexOf('\n\n\n') !== -1) {
      cleaned = cleaned.replace(regex, '\n\n');
    }
    
    return cleaned;
  }
}