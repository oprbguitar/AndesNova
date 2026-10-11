import { Check, Copy, MoreHorizontal, RotateCcw, Send } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import type { Phase } from "../data/phases";
import { ChatError, sendChat, type ChatErrorKind, type ChatSource, type ChatTurn } from "../services/chatService";
import { LogoMark } from "./Logo";

type Message = {
  from: "bot" | "user";
  text: string;
  sources?: ChatSource[];
  status?: ChatErrorKind;
  retryText?: string;
};

type ChatPanelProps = {
  phase: Phase;
  onRequestContact: (summary?: string) => void;
};

const storageKey = "andesnova-chat-v2";
const maxStored = 30;

const statusText: Record<ChatErrorKind, string> = {
  offline: "Parece que no hay conexión. Revisa tu red y vuelve a intentarlo.",
  limit: "Has enviado varias consultas seguidas. Espera un minuto y vuelve a intentarlo.",
  error: "Ahora mismo no puedo responder. Reintenta en unos segundos o escríbenos con «Solicitar evaluación».",
};

function loadMessages(): Message[] {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(storageKey) || "[]") as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is Message =>
          item && (item.from === "bot" || item.from === "user") && typeof item.text === "string",
      );
    }
  } catch {
    // storage unavailable: start fresh
  }
  return [];
}

function saveMessages(messages: Message[]) {
  try {
    const persistable = messages.filter((message) => !message.status).slice(-maxStored);
    sessionStorage.setItem(storageKey, JSON.stringify(persistable));
  } catch {
    // keep chatting without persistence
  }
}

function toHistory(messages: Message[]): ChatTurn[] {
  return messages
    .filter((message) => !message.status)
    .map((message) => ({ role: message.from === "bot" ? ("assistant" as const) : ("user" as const), content: message.text }))
    .slice(-6);
}

function buildSummary(messages: Message[]) {
  const lines = messages
    .filter((message) => !message.status)
    .slice(-6)
    .map((message) => `${message.from === "user" ? "Yo" : "AndesNova"}: ${message.text}`);
  return lines.length ? `Resumen de mi consulta en el chat:\n\n${lines.join("\n\n")}` : undefined;
}

export function ChatPanel({ phase, onRequestContact }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [quota, setQuota] = useState<{ remaining: number; limit: number } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => saveMessages(messages), [messages]);

  // Other parts of the page (e.g. tool combinations) can ask the assistant.
  const askRef = useRef<(text: string) => void>(() => undefined);
  useEffect(() => {
    const onAsk = (event: Event) => askRef.current(String((event as CustomEvent).detail ?? ""));
    window.addEventListener("andesnova:ask", onAsk);
    return () => window.removeEventListener("andesnova:ask", onAsk);
  }, []);

  useEffect(() => {
    const box = scrollRef.current;
    // Keep the greeting in view until the conversation starts.
    if (box && (messages.length || loading)) box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function ask(text: string, baseMessages = messages) {
    const question = text.trim();
    if (!question || loading) return;

    const withQuestion: Message[] = [...baseMessages.filter((message) => !message.status), { from: "user", text: question }];
    setMessages(withQuestion);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChat(question, toHistory(withQuestion.slice(0, -1)), phase.name);
      if (typeof reply.remaining === "number" && typeof reply.limit === "number") {
        setQuota({ remaining: reply.remaining, limit: reply.limit });
      }
      setMessages([...withQuestion, { from: "bot", text: reply.answer, sources: reply.sources }]);
    } catch (error) {
      const kind = error instanceof ChatError ? error.kind : "error";
      setMessages([...withQuestion, { from: "bot", text: statusText[kind], status: kind, retryText: question }]);
    } finally {
      setLoading(false);
    }
  }

  askRef.current = (text: string) => ask(text);

  function retry(text: string) {
    // Drop the failed question and its error so it is re-sent cleanly.
    const trimmed = messages.filter((message) => !message.status);
    const last = trimmed[trimmed.length - 1];
    ask(text, last?.from === "user" && last.text === text ? trimmed.slice(0, -1) : trimmed);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    ask(input);
  }

  async function copy(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  }

  const started = messages.length > 0;

  return (
    <aside className="chat-card" aria-label="Asistente AndesNova">
      <header className="chat-head">
        <span className="chat-avatar">
          <LogoMark size={26} />
        </span>
        <span className="chat-status">
          <span className="chat-online" aria-hidden="true" /> En línea
        </span>
        <div className="chat-menu">
          <button type="button" aria-label="Opciones del chat" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <MoreHorizontal size={18} />
          </button>
          {menuOpen ? (
            <div className="chat-menu-list" role="menu">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMessages([]);
                  setMenuOpen(false);
                }}
              >
                <RotateCcw size={14} /> Nueva conversación
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onRequestContact(buildSummary(messages));
                  setMenuOpen(false);
                }}
              >
                <Send size={14} /> Enviar resumen por correo
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <div className="chat-scroll" ref={scrollRef} aria-live="polite">
        <p className="chat-greeting">
          {phase.chatGreeting.split("AndesNova").map((part, index, parts) => (
            <span key={index}>
              {part}
              {index < parts.length - 1 ? <strong>AndesNova</strong> : null}
            </span>
          ))}
        </p>

        {messages.map((message, index) => (
          <div className={`chat-msg ${message.from} ${message.status ? "is-status" : ""}`} key={index}>
            <p>{message.text}</p>
            {message.from === "bot" && !message.status ? (
              <div className="chat-msg-tools">
                {message.sources?.length ? (
                  <details>
                    <summary>Fuentes ({message.sources.length})</summary>
                    <ul>
                      {message.sources.map((source) => (
                        <li key={source.title}>
                          <strong>{source.title}</strong>
                          {source.category ? <span> · {source.category}</span> : null}
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}
                <button type="button" onClick={() => copy(message.text, index)} aria-label="Copiar respuesta">
                  {copied === index ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
            ) : null}
            {message.status && message.retryText ? (
              <button className="chat-retry" type="button" onClick={() => retry(message.retryText!)}>
                <RotateCcw size={13} /> Reintentar
              </button>
            ) : null}
          </div>
        ))}

        {loading ? (
          <div className="chat-typing" aria-label="Escribiendo">
            <span />
            <span />
            <span />
          </div>
        ) : null}
      </div>

      <div className={`chat-chips ${started ? "compact" : ""}`}>
        {phase.chips.map((chip) => {
          const Icon = chip.icon;
          return (
            <button type="button" key={chip.label} onClick={() => ask(chip.message)} disabled={loading}>
              <Icon size={16} aria-hidden="true" />
              {chip.label}
            </button>
          );
        })}
      </div>

      <form className="chat-form" onSubmit={onSubmit}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Escribe tu consulta..."
          aria-label="Escribe tu consulta"
          maxLength={1200}
        />
        <button type="submit" aria-label="Enviar" disabled={!input.trim() || loading}>
          <Send size={16} />
        </button>
      </form>

      <footer className="chat-foot">
        <button type="button" onClick={() => onRequestContact(buildSummary(messages))}>
          Solicitar evaluación
        </button>
        {quota ? (
          <span title="Consultas con IA disponibles hoy">
            IA hoy: {quota.remaining}/{quota.limit}
          </span>
        ) : null}
      </footer>
    </aside>
  );
}
