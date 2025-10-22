const API_URL = 'https://api.perplexity.ai/v1/chat/completions';
const DEFAULT_MODEL = 'pplx-70b-online';

export type PerplexityRole = 'system' | 'user' | 'assistant';

export interface PerplexityMessage {
  role: PerplexityRole;
  content: string;
}

export interface PerplexityChatOptions {
  model?: string;
  temperature?: number;
  top_p?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
}

export interface PerplexityChatChoice {
  index?: number;
  finish_reason?: string;
  message?: {
    role?: PerplexityRole;
    content?: string;
  };
}

export interface PerplexityChatResponse {
  id?: string;
  created?: number;
  model?: string;
  choices?: PerplexityChatChoice[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  [key: string]: unknown;
}

export interface PerplexityChatResult {
  text: string;
  raw: PerplexityChatResponse;
}

export class PerplexityApiError extends Error {
  status?: number;
  retryAfterMs?: number;
  constructor(message: string, status?: number, retryAfterMs?: number) {
    super(message);
    this.name = 'PerplexityApiError';
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

const getRetryAfterMs = (headerValue: string | null): number | undefined => {
  if (!headerValue) return undefined;
  const numeric = Number(headerValue);
  if (!Number.isNaN(numeric)) {
    return Math.max(0, numeric) * 1000;
  }
  const retryDate = Date.parse(headerValue);
  if (!Number.isNaN(retryDate)) {
    return Math.max(0, retryDate - Date.now());
  }
  return undefined;
};

const resolveApiKey = (): string | undefined => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const key = import.meta.env.VITE_PERPLEXITY_API_KEY as string | undefined;
    if (key) return key;
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env.PERPLEXITY_API_KEY;
  }
  return undefined;
};

export const isPerplexityConfigured = (): boolean => Boolean(resolveApiKey());

const buildRequestBody = (messages: PerplexityMessage[], options: PerplexityChatOptions) => {
  const body: Record<string, unknown> = {
    model: options.model ?? DEFAULT_MODEL,
    messages,
  };

  const optionalParams: Array<keyof PerplexityChatOptions> = [
    'temperature',
    'top_p',
    'presence_penalty',
    'frequency_penalty',
  ];

  optionalParams.forEach(key => {
    const value = options[key];
    if (typeof value === 'number') {
      body[key] = value;
    }
  });

  return body;
};

export const sendPerplexityChat = async (
  messages: PerplexityMessage[],
  options: PerplexityChatOptions = {}
): Promise<PerplexityChatResult> => {
  const apiKey = resolveApiKey();

  if (!apiKey) {
    throw new PerplexityApiError(
      'PERPLEXITY_API_KEY is not configured. Please add VITE_PERPLEXITY_API_KEY to your environment.',
      401
    );
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(buildRequestBody(messages, options)),
  });

  const retryAfterMs = getRetryAfterMs(response.headers.get('retry-after'));

  if (!response.ok) {
    let errorMessage = `Perplexity API request failed with status ${response.status}`;
    let details: unknown;

    try {
      details = await response.json();
      if (details && typeof details === 'object') {
        const payload = details as { error?: { message?: string } };
        if (payload.error?.message) {
          errorMessage = payload.error.message;
        }
      }
    } catch (jsonErr) {
      const text = await response.text().catch(() => '');
      if (text) {
        errorMessage = text;
      }
    }

    throw new PerplexityApiError(errorMessage, response.status, retryAfterMs);
  }

  const payload = (await response.json()) as PerplexityChatResponse;
  const text = payload?.choices?.[0]?.message?.content?.toString()?.trim() ?? '';

  return { text, raw: payload };
};
