import { Bot, MessageCircle, Send, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

type Message = {
  from: "bot" | "user";
  text: string;
  loading?: boolean;
};

type ApiMessage = {
  role: "assistant" | "user";
  content: string;
};

const floatingMessages = [
  "¿Qué haces por aquí? Sé que estás buscando algo.",
  "Consúltame sobre documentos, contratos o procesos.",
  "Puedo ayudarte a elegir el servicio adecuado.",
  "Ordena tu empresa con una consulta rápida.",
];

const botAnimations = ["bot-bounce", "bot-glow", "bot-wiggle", "bot-float", "bot-pulse"];

const chatEndpoint = "https://andesnova-chat-api.vercel.app/api/chat";

const quickPrompts = [
  "Quiero ordenar mis documentos",
  "Necesito controlar contratos",
  "Deseo mejorar procesos",
  "Necesito apoyo en SST",
  "Quiero un chatbot documental",
  "Necesito reportes o dashboards",
];

const contactActions = ["Solicitar evaluación", "Contactar especialista", "Enviar caso"];

const initialMessage =
  "Hola, soy AndesNova IA. Puedo orientarte sobre gestión documental, contratos, procesos, SST, logística, reportes o soluciones con IA. ¿Qué necesitas resolver?";

const loadingMessage = "AndesNova IA está escribiendo...";

const errorMessage = "En este momento no puedo procesar la consulta. Intente nuevamente o solicite una evaluación inicial.";

const toApiHistory = (messages: Message[]): ApiMessage[] =>
  messages
    .filter((message) => !message.loading)
    .map((message) => ({
      role: message.from === "bot" ? ("assistant" as const) : ("user" as const),
      content: message.text,
    }))
    .slice(-6);

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [botAnimation, setBotAnimation] = useState(botAnimations[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ from: "bot", text: initialMessage }]);

  useEffect(() => {
    const messageTimer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % floatingMessages.length);
    }, 4500);
    const animationTimer = window.setInterval(() => {
      const next = botAnimations[Math.floor(Math.random() * botAnimations.length)];
      setBotAnimation(next);
    }, 3200);

    return () => {
      window.clearInterval(messageTimer);
      window.clearInterval(animationTimer);
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

  const scrollToContact = () => {
    document.getElementById("contacto")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

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

  const ask = (prompt: string) => {
    void sendMessage(prompt);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    void sendMessage(text);
  };

  return (
    <div id="ia" className="fixed bottom-5 right-4 z-[90] sm:bottom-7 sm:right-7">
      {open && (
        <section className="mb-4 w-[min(calc(100vw-2rem),390px)] overflow-hidden rounded-2xl border border-white/15 bg-[#0b233d] shadow-premium">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-teal">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-bold text-white">AndesNova IA+</h2>
                <p className="text-xs text-white/65">Asistente empresarial</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-white/75 transition hover:bg-white/10 hover:text-white"
              aria-label="Cerrar asistente"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[430px] space-y-3 overflow-auto bg-softWhite p-3">
            {messages.map((message, index) => (
              <div
                key={`${message.from}-${index}`}
                className={`rounded-xl p-3 text-sm leading-6 ${
                  message.from === "bot" ? "mr-8 bg-white text-navy shadow-sm" : "ml-8 bg-teal text-white"
                }`}
              >
                {message.text}
              </div>
            ))}

            <div className="grid gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => ask(prompt)}
                  disabled={loading}
                  className="rounded-full border border-teal/40 bg-white px-3 py-2 text-xs font-bold text-tealDark transition hover:bg-teal hover:text-white disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="grid gap-2 border-t border-slate-200 pt-3 sm:grid-cols-3">
              {contactActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={scrollToContact}
                  className="rounded-full bg-navy px-3 py-2 text-xs font-extrabold text-white transition hover:bg-navyDark"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={submit} className="flex gap-2 border-t border-white/10 bg-[#0b233d] p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-white px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-teal"
              placeholder="Escriba su consulta..."
              aria-label="Escriba su consulta"
            />
            <button
              type="submit"
              disabled={loading}
              className="grid h-12 w-12 place-items-center rounded-full bg-teal text-white transition hover:bg-tealDark disabled:cursor-not-allowed disabled:opacity-55"
              aria-label={loading ? "Esperando respuesta" : "Enviar consulta"}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>

          <p className="bg-[#0b233d] px-4 pb-3 text-xs text-white/55">
            Consulta inicial orientativa. Servicio sujeto a evaluación.
          </p>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="chat-invite group flex items-end gap-3 text-left"
        aria-label={open ? "Ocultar asistente AndesNova IA" : "Abrir asistente AndesNova IA"}
      >
        {!open && (
          <span className="hidden max-w-[280px] rounded-2xl border border-white/20 bg-navyDark/95 px-4 py-3 text-sm font-semibold leading-5 text-white shadow-premium backdrop-blur-md transition group-hover:-translate-y-1 sm:block">
            {floatingMessages[messageIndex]}
          </span>
        )}

        <span
          className={`relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-teal text-white shadow-premium transition group-hover:-translate-y-1 group-hover:bg-tealDark sm:h-16 sm:w-16 ${botAnimation}`}
        >
          <span className="bot-ring absolute inset-0 rounded-full bg-teal/30" />
          <span className="bot-ring-delay absolute inset-0 rounded-full bg-gold/25" />
          <span className="absolute inset-0 rounded-full bg-teal/40 blur-xl" />
          <span className="absolute -right-1 -top-1 z-20 grid h-6 w-6 place-items-center rounded-full bg-gold text-[10px] font-black text-white">
            IA
          </span>
          {open ? <X className="relative z-10 h-7 w-7" /> : <Bot className="relative z-10 h-7 w-7 sm:h-8 sm:w-8" />}
          {!open && <MessageCircle className="absolute -bottom-1 -left-1 z-20 h-5 w-5 rounded-full bg-white p-1 text-teal" />}
        </span>
      </button>
    </div>
  );
}
