import { ArrowRight, Flag, PlayCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { phases, type Phase, type PhaseId } from "../data/phases";
import { ChatPanel } from "./ChatPanel";

type HeroSceneProps = {
  phase: Phase;
  onSelect: (id: PhaseId) => void;
  onPrimary: () => void;
  onDiagnosis: () => void;
  onRequestContact: (summary?: string) => void;
};

// Route nodes on a 600×420 canvas, climbing towards the summit flag.
const nodes = [
  { x: 70, y: 340, progress: 21 },
  { x: 214, y: 250, progress: 46 },
  { x: 350, y: 160, progress: 70 },
  { x: 476, y: 70, progress: 91 },
];
const routePath = "M-30 392 C 10 372 40 352 70 340 S 172 270 214 250 S 310 184 350 160 S 440 96 476 70 S 528 34 548 18";

export function HeroScene({ phase, onSelect, onPrimary, onDiagnosis, onRequestContact }: HeroSceneProps) {
  const activeIndex = phase.number - 1;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-photo" />
        <div className="cloud-layer cloud-layer-back" />
        <div className="cloud-layer cloud-layer-front" />
        <div className="hero-veil" />
      </div>

      <div className="hero-grid">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase.id}
            className="hero-copy"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32 }}
          >
            <p className="eyebrow">{phase.eyebrow}</p>
            <h1 id="hero-title">
              <span>{phase.title[0]}</span>
              <span>{phase.title[1]}</span>
            </h1>
            <p className="hero-lead">{phase.lead}</p>
            <div className="hero-actions">
              <button className="btn btn-primary" type="button" onClick={onPrimary}>
                {phase.cta} <ArrowRight size={18} />
              </button>
              <button className="btn btn-ghost" type="button" onClick={onDiagnosis}>
                <PlayCircle size={20} /> Diagnóstico en 2 minutos
              </button>
            </div>

            <div className="hero-stepper" role="tablist" aria-label="Fases">
              {phases.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={item.id === phase.id}
                  className={item.id === phase.id ? "active" : undefined}
                  onClick={() => onSelect(item.id)}
                >
                  <span>{item.number}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="route" aria-label="Ruta AndesNova">
          <svg className="route-svg" viewBox="0 0 600 420" preserveAspectRatio="none" aria-hidden="true">
            <path className="route-base" d={routePath} pathLength={100} />
            <path
              className="route-progress"
              d={routePath}
              pathLength={100}
              style={{ strokeDashoffset: 100 - nodes[activeIndex].progress }}
            />
          </svg>
          <span className="route-flag" aria-hidden="true">
            <Flag size={18} />
          </span>
          {phases.map((item, index) => {
            const node = nodes[index];
            const state = index === activeIndex ? "active" : index < activeIndex ? "done" : "";
            return (
              <button
                key={item.id}
                type="button"
                className={`route-node n${index + 1} ${state}`}
                style={{ left: `${(node.x / 600) * 100}%`, top: `${(node.y / 420) * 100}%` }}
                onClick={() => onSelect(item.id)}
                aria-label={`Fase ${item.number}: ${item.name}`}
                aria-pressed={index === activeIndex}
              >
                <span className="route-dot">{item.number}</span>
                <span className="route-label">
                  <strong>{item.routeLabel}</strong>
                  <small>{item.routeDetail}</small>
                </span>
              </button>
            );
          })}
          <AnimatePresence mode="wait">
            <motion.p
              key={phase.id}
              className="route-note"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {phase.note}
            </motion.p>
          </AnimatePresence>
          <p className="route-tagline" aria-hidden="true">
            {phase.tagline.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>

        <ChatPanel phase={phase} onRequestContact={onRequestContact} />
      </div>
    </section>
  );
}
