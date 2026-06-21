/**
 * Groq AI adapter — powers ALL AI operations in CarbonTrace.
 *
 * Groq exposes an OpenAI-compatible Chat Completions API with very low latency.
 * We call it server-side only (the key never reaches the client), so AI works
 * with no separate backend or database — just a Next.js Route Handler.
 *
 * Follows the project's graceful-adapter pattern (see lib/adapters/README.md):
 * a real call when GROQ_API_KEY is set, a deterministic stub otherwise, so the
 * demo always works locally even without a key.
 */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

/** Default model — fast, capable, JSON-friendly. Override via GROQ_MODEL. */
export const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

const apiKey = process.env.GROQ_API_KEY;

export const aiEnabled = Boolean(apiKey);

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GroqChatOptions {
  messages: ChatMessage[];
  /** Ask Groq to return strict JSON (response_format json_object). */
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

/**
 * Low-level chat completion. Throws on transport / API errors so callers can
 * decide how to surface failures. Returns the assistant message content.
 */
export async function groqChat({
  messages,
  json = false,
  temperature = 0.4,
  maxTokens = 1024,
  signal,
}: GroqChatOptions): Promise<string> {
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
    signal,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Groq API error ${res.status}: ${detail.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq returned an empty response.");
  return content;
}
