import { Send, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
  from: "bot" | "user";
  text: string;
  loading?: boolean;
};

type ApiMessage = {
  role: "assistant" | "user";
  content: string;
};

type SuggestionChip = {
  label: string;
  message: string;
};

const floatingMessages = [
  "Hola 👋",
  "¿Qué necesitas?",
  "¿Te ayudo con algo?",
  "Consulta gratis aquí 💬",
  "¿Buscas una ruta clara?",
  "Tu evaluación puede empezar hoy 🚀",
  "¿Dudas? Escríbeme",
  "Pregúntame por documentación, riesgos u operaciones.",
  "¿Quieres ordenar tu empresa?",
  "Estoy en línea ahora 🟢",
];

const chatEndpoint = "https://andesnova-chat-api.vercel.app/api/chat";

const primarySuggestions: SuggestionChip[] = [
  {
    label: "Ordenar documentos",
    message: "Quiero ordenar los documentos de mi empresa. ¿Por dónde debería empezar?",
  },
  {
    label: "Revisar contratos",
    message: "Tengo contratos desordenados y quiero controlar vencimientos y obligaciones. ¿Qué me recomienda?",
  },
  {
    label: "Mejorar procesos",
    message: "Mi empresa tiene demoras y procesos poco claros. ¿Qué pasos iniciales debería tomar?",
  },
];

const moreSuggestions: SuggestionChip[] = [
  {
    label: "SST",
    message: "Necesito apoyo en SST para ordenar documentación, controles e IPERC. ¿Cómo debería empezar?",
  },
  {
    label: "Logística",
    message: "Quiero ordenar proveedores, compras y contrataciones. ¿Qué recomienda AndesNova?",
  },
  {
    label: "Dashboards",
    message: "Necesito reportes o dashboards para controlar mejor la gestión. ¿Qué información debería preparar?",
  },
  {
    label: "Chatbot documental",
    message: "Quiero un chatbot documental para consultar archivos internos. ¿Qué pasos recomienda?",
  },
  {
    label: "Capacitación",
    message: "Necesito capacitación para mi equipo en procesos, documentación o SST. ¿Qué enfoque recomienda?",
  },
];

const contactActions = ["Solicitar evaluación", "Contactar especialista"];

const initialMessage =
  "Hola, soy AndesNova IA+. Puedo orientarte sobre documentos, contratos, procesos, SST, logística, reportes o soluciones con IA. Cuéntame brevemente qué necesitas resolver.";

const loadingMessage = "IA escribiendo";

const errorMessage = "Ahora mismo no puedo procesar la consulta. Puede intentar nuevamente o solicitar una evaluación inicial.";

const rateLimitMessage =
  "Has enviado varias consultas seguidas. Espera un momento e inténtalo de nuevo; mientras tanto puedo orientarte con los temas sugeridos.";

const chatStorageKey = "andesnova-chat-messages";
const maxStoredMessages = 30;

function loadStoredMessages(): Message[] {
  try {
    const raw = sessionStorage.getItem(chatStorageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        parsed.every(
          (item) =>
            item &&
            typeof item === "object" &&
            ((item as Message).from === "bot" || (item as Message).from === "user") &&
            typeof (item as Message).text === "string",
        )
      ) {
        return (parsed as Message[]).map(({ from, text }) => ({ from, text }));
      }
    }
  } catch {
    // sessionStorage unavailable or corrupted: start fresh
  }

  return [{ from: "bot", text: initialMessage }];
}

function storeMessages(messages: Message[]) {
  try {
    const persistable = messages
      .filter((message) => !message.loading)
      .slice(-maxStoredMessages)
      .map(({ from, text }) => ({ from, text }));
    sessionStorage.setItem(chatStorageKey, JSON.stringify(persistable));
  } catch {
    // storage full or unavailable: keep the chat working without persistence
  }
}

const toApiHistory = (messages: Message[]): ApiMessage[] =>
  messages
    .filter((message) => !message.loading)
    .map((message) => ({
      role: message.from === "bot" ? ("assistant" as const) : ("user" as const),
      content: message.text,
    }))
    .slice(-6);

function TypingIndicator() {
  return (
    <div className="floating-chat-typing">
      <span>{loadingMessage}</span>
      <span className="floating-chat-typing-dots" aria-hidden="true">
        <span className="chat-dot" />
        <span className="chat-dot chat-dot-delay-1" />
        <span className="chat-dot chat-dot-delay-2" />
      </span>
    </div>
  );
}

type FloatingChatbotProps = {
  onRequestContact: () => void;
};

export function FloatingChatbot({ onRequestContact }: FloatingChatbotProps) {
  const [open, setOpen] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMoreTopics, setShowMoreTopics] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadStoredMessages);
  const [orbEffect, setOrbEffect] = useState<"jump" | "glow" | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let messageTimer: number;

    const scheduleNext = () => {
      messageTimer = window.setTimeout(() => {
        setMessageIndex((current) => {
          let next = Math.floor(Math.random() * floatingMessages.length);
          if (next === current) {
            next = (next + 1) % floatingMessages.length;
          }
          return next;
        });
        scheduleNext();
      }, 4200 + Math.random() * 3600);
    };

    scheduleNext();
    return () => window.clearTimeout(messageTimer);
  }, []);

  useEffect(() => {
    let startTimer: number;
    let stopTimer: number;

    const scheduleEffect = () => {
      startTimer = window.setTimeout(() => {
        setOrbEffect(Math.random() < 0.5 ? "jump" : "glow");
        stopTimer = window.setTimeout(() => {
          setOrbEffect(null);
          scheduleEffect();
        }, 1400);
      }, 2400 + Math.random() * 4200);
    };

    scheduleEffect();
    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(stopTimer);
    };
  }, []);

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === "#ia") {
        setOpen(true);
      }
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, open, showMoreTopics]);

  useEffect(() => {
    storeMessages(messages);
  }, [messages]);


  const sendMessage = async (userMessage: string) => {
    if (loading) return;

    setLoading(true);

    const userEntry: Message = { from: "user", text: userMessage };
    const waitingEntry: Message = { from: "bot", text: loadingMessage, loading: true };
    let history: ApiMessage[] = [];

    setMessages((current) => {
      history = toApiHistory(current);
      return [...current, userEntry, waitingEntry];
    });

    try {
      const response = await fetch(chatEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history,
        }),
      });

      if (response.status === 429) {
        setMessages((current) =>
          current.map((message) => (message.loading ? { from: "bot", text: rateLimitMessage } : message)),
        );
        return;
      }

      if (!response.ok) {
        throw new Error(`Chat request failed with ${response.status}`);
      }

      const data = (await response.json()) as { answer?: unknown };
      const answer = typeof data.answer === "string" && data.answer.trim() ? data.answer : errorMessage;

      setMessages((current) =>
        current.map((message) => (message.loading ? { from: "bot", text: answer } : message)),
      );
    } catch {
      setMessages((current) =>
        current.map((message) => (message.loading ? { from: "bot", text: errorMessage } : message)),
      );
    } finally {
      setLoading(false);
    }
  };

  const chooseSuggestion = (suggestion: SuggestionChip) => {
    void sendMessage(suggestion.message);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    void sendMessage(text);
  };

  const hasUserMessage = messages.some((message) => message.from === "user");
  const visibleSuggestions = showMoreTopics ? [...primarySuggestions, ...moreSuggestions] : primarySuggestions;

  return (
    <div id="ia" className={`chatbot-floating ${open ? "chatbot-open" : ""}`}>
      {open && (
        <section className="floating-chat-panel" aria-label="Chatbot AndesNova IA">
          <div className="floating-chat-header">
            <div className="floating-chat-title">
              <div className="floating-chat-avatar" aria-hidden="true">
                <BotHelmetFace compact />
              </div>
              <div>
                <h2>AndesNova IA+</h2>
                <p>Asistente empresarial</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="floating-chat-close"
              aria-label="Cerrar asistente"
            >
              <X size={20} />
            </button>
          </div>

          <div className="floating-chat-messages">
            {messages.map((message, index) =>
              message.loading ? (
                <TypingIndicator key={`${message.from}-${index}`} />
              ) : (
                <div
                  key={`${message.from}-${index}`}
                  className={`floating-chat-message ${message.from === "bot" ? "bot" : "user"}`}
                >
                  {message.text}
                </div>
              ),
            )}

            {!hasUserMessage && (
              <div className="floating-chat-suggestions">
                <div className="floating-chat-chip-row">
                  {visibleSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.label}
                      type="button"
                      onClick={() => chooseSuggestion(suggestion)}
                      disabled={loading}
                      className="floating-chat-chip"
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowMoreTopics((value) => !value)}
                  className="floating-chat-more"
                >
                  {showMoreTopics ? "Ver menos temas" : "Ver más temas"}
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="floating-chat-composer">
            <div className="floating-chat-actions">
              {contactActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={onRequestContact}
                  className="floating-chat-action"
                >
                  {action}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="floating-chat-form">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="floating-chat-input"
                placeholder="Describe tu caso o consulta..."
                aria-label="Describe tu caso o consulta"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="floating-chat-send"
                aria-label={loading ? "Esperando respuesta" : "Enviar consulta"}
              >
                <Send size={19} />
              </button>
            </form>

            <p>Orientado con documentación interna de AndesNova.</p>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="chatbot-floating-launcher"
        aria-label={open ? "Ocultar asistente AndesNova IA" : "Abrir asistente AndesNova IA"}
      >
        {!open && (
          <span className="chatbot-floating-hint" key={messageIndex}>
            {floatingMessages[messageIndex]}
          </span>
        )}

        <span className={`chatbot-floating-orb ${!open && orbEffect ? `orb-${orbEffect}` : ""}`}>
          {open ? <X className="chatbot-orb-close" size={28} /> : <BotHelmetFace />}
          {!open && <span className="chatbot-online-dot" aria-hidden="true" />}
        </span>
      </button>
    </div>
  );
}

function BotHelmetFace({ compact = false }: { compact?: boolean }) {
  return (
    <svg className={compact ? "bot-helmet-face compact" : "bot-helmet-face"} viewBox="0 0 96 96" aria-hidden="true">
      <defs>
        <linearGradient id="orbFace" x1="24" x2="72" y1="34" y2="74">
          <stop offset="0" stopColor="#17467a" />
          <stop offset="1" stopColor="#061642" />
        </linearGradient>
      </defs>
      <path className="bot-helmet-shell" d="M18 49c0-18 13-32 30-32s30 14 30 32v9H18z" />
      <path className="bot-helmet-brim" d="M16 54c7 4 18 6 32 6s25-2 32-6v8c-8 5-19 7-32 7s-24-2-32-7z" />
      <path className="bot-helmet-ridge" d="M48 17v39" />
      <rect className="bot-face-panel" x="23" y="37" width="50" height="35" rx="18" />
      <path className="bot-eye left" d="M38 53c0-5 3-8 7-8s7 3 7 8" />
      <path className="bot-eye right" d="M55 53c0-5 3-8 7-8s7 3 7 8" />
      <path className="bot-smile" d="M40 62c5 4 11 4 16 0" />
      <path className="bot-ear left" d="M18 48h-5c-3 0-5 3-5 8s2 8 5 8h5" />
      <path className="bot-ear right" d="M78 48h5c3 0 5 3 5 8s-2 8-5 8h-5" />
    </svg>
  );
}
