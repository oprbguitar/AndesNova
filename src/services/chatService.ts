// Chat goes to the Cloudflare Worker first (Workers AI, free plan, capped per
// day). When that cap is reached or the worker fails, it falls back to the
// existing Gemini API on Vercel.
const cloudflareEndpoint =
  import.meta.env.VITE_CHAT_API ?? "https://andesnova-web.oprbguitar.workers.dev/api/chat";
const geminiEndpoint = "https://andesnova-chat-api.vercel.app/api/chat";

export type ChatSource = {
  title: string;
  category?: string;
  updated?: string;
  description?: string;
};

export type ChatTurn = {
  role: "assistant" | "user";
  content: string;
};

export type ChatReply = {
  answer: string;
  sources?: ChatSource[];
  provider: "cloudflare" | "gemini";
  remaining?: number;
  limit?: number;
};

export type ChatErrorKind = "offline" | "limit" | "error";

export class ChatError extends Error {
  constructor(public kind: ChatErrorKind) {
    super(kind);
  }
}

function normalizeSources(raw: unknown): ChatSource[] | undefined {
  if (!Array.isArray(raw)) return undefined;

  const sources = raw
    .map((item): ChatSource | null => {
      if (typeof item === "string") return { title: item };
      if (item && typeof item === "object" && typeof (item as ChatSource).title === "string") {
        const source = item as ChatSource;
        return {
          title: source.title,
          category: typeof source.category === "string" ? source.category : undefined,
          updated: typeof source.updated === "string" ? source.updated : undefined,
          description: typeof source.description === "string" ? source.description : undefined,
        };
      }
      return null;
    })
    .filter((item): item is ChatSource => item !== null)
    .slice(0, 3);

  return sources.length ? sources : undefined;
}

async function post(url: string, body: unknown, timeoutMs: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function sendChat(message: string, history: ChatTurn[], phase?: string): Promise<ChatReply> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new ChatError("offline");
  }

  let remaining: number | undefined;
  let limit: number | undefined;

  try {
    const response = await post(cloudflareEndpoint, { message, history, phase }, 20_000);

    if (response.status === 429) {
      throw new ChatError("limit");
    }

    if (response.ok) {
      const data = (await response.json()) as {
        answer?: unknown;
        sources?: unknown;
        remaining?: unknown;
        limit?: unknown;
        quotaReached?: unknown;
      };
      remaining = typeof data.remaining === "number" ? data.remaining : undefined;
      limit = typeof data.limit === "number" ? data.limit : undefined;

      if (!data.quotaReached && typeof data.answer === "string" && data.answer.trim()) {
        return {
          answer: data.answer.trim(),
          sources: normalizeSources(data.sources),
          provider: "cloudflare",
          remaining,
          limit,
        };
      }
    }
  } catch (error) {
    if (error instanceof ChatError) throw error;
    // Network/timeout on the worker: try the fallback below.
  }

  const response = await post(geminiEndpoint, { message, history }, 25_000).catch(() => null);

  if (!response) throw new ChatError("error");
  if (response.status === 429) throw new ChatError("limit");
  if (!response.ok) throw new ChatError("error");

  const data = (await response.json()) as { answer?: unknown; sources?: unknown };
  if (typeof data.answer !== "string" || !data.answer.trim()) throw new ChatError("error");

  return {
    answer: data.answer.trim(),
    sources: normalizeSources(data.sources),
    provider: "gemini",
    remaining,
    limit,
  };
}
