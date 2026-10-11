import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Phase } from "../data/phases";
import { ChatPanel } from "./ChatPanel";

type ChatLauncherProps = {
  phase: Phase;
  onRequestContact: (summary?: string) => void;
};

const hints = [
  "¡Hola! 👋",
  "¿Te ayudo a reducir costos?",
  "Pregúntame por agentes de IA",
  "¿Qué herramienta necesitas?",
  "Estoy en línea 🟢",
  "Diagnóstico gratis aquí 💬",
];

const hintDismissKey = "andesnova-hint-dismissed";

function hintDismissed() {
  try {
    return sessionStorage.getItem(hintDismissKey) === "1";
  } catch {
    return false;
  }
}

// Floating assistant: a bouncing, blinking orb in the bottom corner that
// opens the chat as a popover (desktop) or a bottom sheet (mobile).
export function ChatLauncher({ phase, onRequestContact }: ChatLauncherProps) {
  const [open, setOpen] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (open || hintDismissed()) {
      setShowHint(false);
      return;
    }
    const first = setTimeout(() => setShowHint(true), 1800);
    const cycle = setInterval(() => setHintIndex((index) => (index + 1) % hints.length), 4200);
    return () => {
      clearTimeout(first);
      clearInterval(cycle);
    };
  }, [open]);

  // Other parts of the page can ask the assistant: open the panel first.
  useEffect(() => {
    const onAsk = () => setOpen(true);
    window.addEventListener("andesnova:ask", onAsk);
    return () => window.removeEventListener("andesnova:ask", onAsk);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function toggle() {
    setOpen((value) => !value);
    try {
      sessionStorage.setItem(hintDismissKey, "1");
    } catch {
      // ignore
    }
  }

  return (
    <div className={`chat-launcher ${open ? "is-open" : ""}`}>
      {/* Kept mounted so the conversation survives closing the panel. */}
      <div className="chat-popover" hidden={!open}>
        <ChatPanel phase={phase} onRequestContact={onRequestContact} onClose={() => setOpen(false)} />
      </div>
      {open ? <button className="chat-backdrop" type="button" aria-label="Cerrar chat" onClick={() => setOpen(false)} /> : null}

      <AnimatePresence>
        {showHint && !open ? (
          <motion.button
            type="button"
            className="chat-hint"
            onClick={toggle}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={hintIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {hints[hintIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        ) : null}
      </AnimatePresence>

      <button
        className="chat-orb"
        type="button"
        aria-label={open ? "Cerrar asistente AndesNova" : "Abrir asistente AndesNova"}
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="orb-ring" aria-hidden="true" />
        <span className="orb-body" aria-hidden="true">
          <span className="orb-face">
            <span className="orb-eye" />
            <span className="orb-eye" />
            <span className="orb-smile" />
          </span>
        </span>
        <span className="orb-dot" aria-hidden="true" />
      </button>
    </div>
  );
}
