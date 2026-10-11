import { ArrowRight } from "lucide-react";
import { phases, type PhaseId } from "../data/phases";
import { Logo } from "./Logo";

type SiteHeaderProps = {
  activeId: PhaseId;
  onSelect: (id: PhaseId) => void;
  onStart: () => void;
};

export function SiteHeader({ activeId, onSelect, onStart }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="site-brand" href="#activa" aria-label="AndesNova, inicio" onClick={() => onSelect("activa")}>
        <Logo />
      </a>

      <nav className="site-nav" aria-label="Fases">
        {phases.map((phase) => (
          <a
            key={phase.id}
            href={`#${phase.id}`}
            className={phase.id === activeId ? "active" : undefined}
            aria-current={phase.id === activeId ? "page" : undefined}
            onClick={(event) => {
              event.preventDefault();
              onSelect(phase.id);
            }}
          >
            {phase.name}
          </a>
        ))}
        <a href="#proyectos">Proyectos</a>
      </nav>

      <button className="btn btn-primary header-cta" type="button" onClick={onStart}>
        <span>Comenzar ahora</span> <ArrowRight size={18} />
      </button>
    </header>
  );
}
