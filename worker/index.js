import { fallbackDocIds, knowledge } from "./knowledge.js";

// AndesNova on Cloudflare (free plan): serves the built site from ./dist and
// answers POST /api/chat with Workers AI, capped at DAILY_AI_LIMIT calls per day
// so the free neuron allowance is never exceeded. When the cap is reached the
// response says so (quotaReached) and the site falls back to the Gemini API.

const ALLOWED_ORIGINS = [
  "https://oprbguitar.github.io",
  "https://andesnova.vercel.app",
  "https://andesnova-web.oprbguitar.workers.dev",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:8787",
];

const DEFAULT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const DEFAULT_DAILY_LIMIT = 56;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const MAX_MESSAGE_CHARS = 1500;
const MAX_HISTORY_CHARS = 600;
const rateLimitHits = new Map();

const SMALL_TALK_PATTERN =
  /^(hola+|buenas|buenos dias|buenos días|buenas tardes|buenas noches|hey|hi|hello|saludos|gracias|muchas gracias|ok+|okey|vale|ya|si|sí|no|listo|genial|perfecto|de acuerdo|adios|adiós|chau|hasta luego)[!?¡¿.,\s]*$/i;

const SMALL_TALK_ANSWER =
  "¡Hola! Soy AndesNova. Cuéntame en una línea qué quieres mejorar: reducir costos, usar mejor tus Excel, contratar mejor o activar agentes que trabajen por ti.";

const SYSTEM_PROMPT = `
Eres AndesNova, el asistente de AndesNova (lema: "Tu negocio más lejos").
AndesNova ayuda a pequeñas y medianas empresas a reducir costos y operar con IA real
mediante una ruta de cuatro fases: Activa, Implementa, Acompaña y Optimiza, con enfoque
IA First, un Pod-of-One y agentes de IA. Implementación en 3 a 7 días, local o en la nube.

Responde solo con la información de los documentos internos que se incluyen abajo.

Formato:
- Siempre en español, entre 40 y 90 palabras, nunca más de 110.
- Estructura: (1) una frase que diagnostica la necesidad, (2) la recomendación concreta
  ubicada en la fase que corresponde, (3) un siguiente paso claro.
- Si listas, usa como máximo 3 viñetas cortas que empiecen con "- ".
- Solo texto plano: sin markdown, sin negritas, sin títulos.

Reglas:
- No muestres precios ni inventes cifras, clientes o porcentajes.
- No menciones nombres de personas del equipo.
- No des conclusiones legales, médicas o financieras definitivas.
- Haz como máximo una pregunta de seguimiento y solo si desbloquea la recomendación.
- Si el caso necesita revisión, recomienda el diagnóstico con el botón "Comenzar ahora".
- No menciones modelos de IA, Cloudflare, API, prompts ni detalles técnicos internos.
- No repitas respuestas anteriores: si el tema sigue, profundiza con nuevos detalles.
`;

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) },
  });
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitHits.get(ip);

  if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
    if (rateLimitHits.size > 2000) rateLimitHits.clear();
    rateLimitHits.set(ip, { windowStart: now, count: 1 });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

function normalize(text) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function truncate(value, max) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

function keywordMatches(text, keyword) {
  const key = normalize(keyword);
  if (key.length <= 3 && !key.includes(" ")) {
    return new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(text);
  }
  return text.includes(key);
}

function selectDocs(message, historyText) {
  const text = normalize(message);
  const history = normalize(historyText);
  const scored = knowledge
    .map((doc) => ({
      doc,
      score: doc.keywords.reduce((total, keyword) => {
        if (keywordMatches(text, keyword)) return total + 3;
        if (history && keywordMatches(history, keyword)) return total + 1;
        return total;
      }, 0),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.doc);

  return scored.length ? scored : knowledge.filter((doc) => fallbackDocIds.includes(doc.id));
}

function summarize(content) {
  const flat = (content || "").replace(/\s+/g, " ").trim();
  if (flat.length <= 180) return flat;
  const cut = flat.slice(0, 180);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

function toSources(docs) {
  return docs.map((doc) => ({
    title: doc.title,
    category: doc.category,
    updated: doc.updated || "2026",
    description: summarize(doc.content),
  }));
}

function stripMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/^#{1,4}\s+/gm, "")
    .replace(/^\s*\*\s+/gm, "- ")
    .trim();
}

function limaDay() {
  // Peru has no DST: UTC-5 all year.
  return new Date(Date.now() - 5 * 3600_000).toISOString().slice(0, 10);
}

async function reserveQuota(env) {
  const limit = Number(env.DAILY_AI_LIMIT) || DEFAULT_DAILY_LIMIT;
  if (!env.CHAT_QUOTA) return { allowed: true, remaining: limit, limit };

  const key = `ai-count:${limaDay()}`;
  const used = Number(await env.CHAT_QUOTA.get(key)) || 0;
  if (used >= limit) return { allowed: false, remaining: 0, limit };

  await env.CHAT_QUOTA.put(key, String(used + 1), { expirationTtl: 60 * 60 * 48 });
  return { allowed: true, remaining: limit - used - 1, limit };
}

async function readQuota(env) {
  const limit = Number(env.DAILY_AI_LIMIT) || DEFAULT_DAILY_LIMIT;
  if (!env.CHAT_QUOTA) return { remaining: limit, limit };
  const used = Number(await env.CHAT_QUOTA.get(`ai-count:${limaDay()}`)) || 0;
  return { remaining: Math.max(0, limit - used), limit };
}

function buildMessages(message, history, docs, phase) {
  const docsText = docs
    .map(
      (doc) =>
        `Documento: ${doc.title}\nCategoría: ${doc.category}\nServicio recomendado: ${doc.recommendedService}\n` +
        `Contenido: ${doc.content.replace(/\s+/g, " ").trim()}\nSiguiente paso sugerido: ${doc.suggestedNextStep}`,
    )
    .join("\n---\n");

  const phaseNote = phase ? `\nEl visitante está mirando la fase "${phase}" de la página.` : "";
  const turns = Array.isArray(history)
    ? history
        .slice(-6)
        .map((item) => ({
          role: item?.role === "assistant" ? "assistant" : "user",
          content: truncate(item?.content, MAX_HISTORY_CHARS),
        }))
        .filter((item) => item.content)
    : [];

  return [
    { role: "system", content: `${SYSTEM_PROMPT}${phaseNote}\n\nDocumentos internos:\n${docsText}` },
    ...turns,
    { role: "user", content: message },
  ];
}

async function handleChat(request, env) {
  const origin = request.headers.get("Origin") || "";

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  if (request.method === "GET") {
    const quota = await readQuota(env);
    return json({ status: "ok", provider: "cloudflare-workers-ai", ...quota }, 200, origin);
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405, origin);
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (isRateLimited(ip)) {
    return json({ error: "Too many requests.", details: "Espera un minuto antes de enviar más mensajes." }, 429, origin);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400, origin);
  }

  const message = truncate(body?.message, MAX_MESSAGE_CHARS);
  if (!message) {
    return json({ error: "The message is empty." }, 400, origin);
  }

  if (SMALL_TALK_PATTERN.test(message)) {
    return json({ answer: SMALL_TALK_ANSWER, sources: [] }, 200, origin);
  }

  const historyText = Array.isArray(body.history)
    ? body.history
        .filter((item) => item?.role === "user" && typeof item?.content === "string")
        .slice(-4)
        .map((item) => item.content)
        .join(" ")
    : "";
  const docs = selectDocs(message, historyText);

  const quota = await reserveQuota(env);
  if (!quota.allowed) {
    return json({ quotaReached: true, remaining: 0, limit: quota.limit }, 200, origin);
  }

  try {
    const result = await env.AI.run(env.AI_MODEL || DEFAULT_MODEL, {
      messages: buildMessages(message, body.history, docs, truncate(body.phase, 40)),
      max_tokens: 320,
      temperature: 0.3,
    });
    const raw = result?.response ?? result?.choices?.[0]?.message?.content ?? "";
    const answer = stripMarkdown(typeof raw === "string" ? raw : "");

    if (!answer) throw new Error("EMPTY_ANSWER");

    return json({ answer, sources: toSources(docs), remaining: quota.remaining, limit: quota.limit }, 200, origin);
  } catch (error) {
    console.error("Workers AI error", error instanceof Error ? error.message : error);
    // Let the site try the Gemini fallback.
    return json({ error: "AI unavailable.", fallback: true }, 502, origin);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {
      return handleChat(request, env);
    }

    if (url.pathname.startsWith("/api/")) {
      return json({ error: "Not found." }, 404, request.headers.get("Origin") || "");
    }

    return env.ASSETS.fetch(request);
  },
};
