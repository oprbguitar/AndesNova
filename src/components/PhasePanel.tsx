import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { phases, type Phase, type PhaseId } from "../data/phases";
import { projects } from "../data/site";
import { PhaseSideCard, PhaseVisual } from "./PhaseVisuals";

type PhasePanelProps = {
  phase: Phase;
  onSelect: (id: PhaseId) => void;
};

function askAssistant(message: string) {
  window.dispatchEvent(new CustomEvent("andesnova:ask", { detail: message }));
}

export function PhasePanel({ phase, onSelect }: PhasePanelProps) {
  const index = phase.number - 1;
  const prev = phases[(index + phases.length - 1) % phases.length];
  const next = phases[(index + 1) % phases.length];

  return (
    <section className="panel" id="fases" aria-label="Fases AndesNova">
      <div className="panel-tabs">
        <div className="tab-track" role="tablist" aria-label="Fases">
          {phases.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-controls="phase-content"
              aria-selected={item.id === phase.id}
              className={item.id === phase.id ? "active" : undefined}
              onClick={() => onSelect(item.id)}
            >
              {item.id === phase.id ? <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: "spring", stiffness: 380, damping: 34 }} /> : null}
              <span className="tab-num">{item.number}</span>
              <span className="tab-name">{item.name}</span>
            </button>
          ))}
        </div>
        <div className="tab-arrows">
          <button type="button" aria-label={`Anterior: ${prev.name}`} onClick={() => onSelect(prev.id)}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" aria-label={`Siguiente: ${next.name}`} onClick={() => onSelect(next.id)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={phase.id}
          id="phase-content"
          role="tabpanel"
          aria-labelledby={`tab-${phase.id}`}
          className="panel-body"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.28 }}
        >
          <div className="panel-intro">
            <p className="eyebrow eyebrow-slash">{phase.panelEyebrow}</p>
            <h2>{phase.panelTitle}</h2>
            <p className="panel-sub">{phase.panelSubtitle}</p>
            {phase.panelBody ? <p className="panel-text">{phase.panelBody}</p> : null}
            <div className="feature-grid">
              {phase.features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div className={`feature tone-${feature.tone}`} key={feature.title}>
                    <span className="ico">
                      <Icon size={20} />
                    </span>
                    <span>
                      <strong>{feature.title}</strong>
                      <small>{feature.detail}</small>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <PhaseVisual id={phase.id} />
          <PhaseSideCard id={phase.id} onAsk={askAssistant} />
        </motion.div>
      </AnimatePresence>

      <div className="projects" id="proyectos">
        <p className="projects-label">Proyectos en marcha</p>
        <div className="project-list">
          {projects.map((project) => {
            const Icon = project.icon;
            return (
              <a className={`project tone-${project.tone}`} href={project.url} target="_blank" rel="noopener noreferrer" key={project.name}>
                <span className="ico">
                  <Icon size={22} />
                </span>
                <span className="project-copy">
                  <strong>{project.name}</strong>
                  <small>{project.description}</small>
                </span>
                <span className="project-go" aria-hidden="true">
                  <ArrowUpRight size={17} />
                </span>
              </a>
            );
          })}
        </div>
        <p className="hashtag">{phase.hashtag}</p>
      </div>
    </section>
  );
}
