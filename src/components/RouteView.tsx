import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import type { EvaluationArea, companyData } from "../data/companyData";
import { ChatDrawer } from "./ChatDrawer";
import { BuildingIllustration } from "./BuildingIllustration";
import { EvaluationNode } from "./EvaluationNode";
import { RoutePath } from "./RoutePath";

type RouteViewProps = {
  areas: EvaluationArea[];
  routeSteps: string[];
  assistant: typeof companyData.assistant;
  selectedArea?: EvaluationArea;
  onSelectArea: (id: string) => void;
};

const routePositions = ["route-one", "route-two", "route-three", "route-four", "route-five"];

export function RouteView({ areas, routeSteps, assistant, selectedArea, onSelectArea }: RouteViewProps) {
  const ordered = routeSteps
    .map((id) => areas.find((area) => area.id === id))
    .filter(Boolean) as EvaluationArea[];
  const activeArea = selectedArea ?? ordered[0];

  return (
    <motion.section
      className="screen route-screen"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.32 }}
    >
      <div className="route-canvas route-desktop-canvas">
        <RoutePath />
        <svg className="route-connectors" viewBox="0 0 980 550" aria-hidden="true">
          <path className="connector green" d="M150 250 C300 310 335 350 420 390" />
          <path className="connector green" d="M335 175 C400 260 425 310 455 383" />
          <path className="connector blue" d="M520 120 C510 230 495 300 490 380" />
          <path className="connector orange" d="M700 130 C650 235 585 300 525 380" />
          <path className="connector gray" d="M870 150 C820 280 680 340 540 385" />
        </svg>
        {ordered.map((area, index) => (
          <EvaluationNode
            compact
            area={area}
            active={selectedArea?.id === area.id}
            className={routePositions[index]}
            key={area.id}
            number={index + 1}
            onSelect={onSelectArea}
          />
        ))}
        <div className="route-building">
          <BuildingIllustration />
        </div>
      </div>
      <div className="route-mobile-flow">
        <section className="route-mobile-assistant" aria-label="Resumen de Andes">
          <div className="route-mobile-mascot" aria-hidden="true">
            <div className="mascot">
              <span className="helmet" />
              <span className="face">
                <i />
                <i />
              </span>
              <span className="ear left" />
              <span className="ear right" />
            </div>
          </div>
          <div>
            <span className="route-mobile-eyebrow">Siguiente guía</span>
            <h2>{activeArea?.title ?? assistant.routeTitle}</h2>
            <p>{activeArea?.guidance ?? assistant.routeSubtitle}</p>
          </div>
          <ChatDrawer prompts={assistant.prompts} selectedAreaId={activeArea?.id} closedLabel="Consultar" />
        </section>

        <section className="route-progress-card" aria-label="Progreso de ruta">
          <span>Ruta AndesNova</span>
          <strong>{ordered.findIndex((area) => area.id === activeArea?.id) + 1 || 1} de {ordered.length}</strong>
          <p>Avanza por cada área para completar una evaluación clara y ejecutiva.</p>
        </section>

        <div className="route-mobile-visual" aria-hidden="true">
          <BuildingIllustration />
        </div>

        <div className="route-mobile-timeline" aria-label="Pasos de la ruta">
          <svg className="route-mobile-path" viewBox="0 0 120 620" aria-hidden="true">
            <path d="M58 18 C24 95 88 142 58 220 S28 348 62 426 S88 538 56 604" />
            <circle cx="58" cy="18" r="4" />
            <circle cx="63" cy="604" r="4" />
          </svg>
          {ordered.map((area, index) => {
            const Icon = area.icon;
            const active = activeArea?.id === area.id;
            return (
              <button
                className={`route-mobile-step tone-${area.statusKey} ${active ? "selected" : ""}`}
                key={area.id}
                type="button"
                aria-label={`Paso ${index + 1}: ${area.title}, ${area.status}`}
                aria-expanded={active}
                onClick={() => onSelectArea(area.id)}
                style={{ "--node-color": area.color } as CSSProperties}
              >
                <span className="route-mobile-badge">{index + 1}</span>
                <span className="route-mobile-icon">
                  <Icon size={22} strokeWidth={2} />
                </span>
                <span className="route-mobile-copy">
                  <strong>{area.title}</strong>
                  <small>{area.status}</small>
                  <span>{area.description}</span>
                  {active ? (
                    <ul>
                      {area.actions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        {activeArea ? (
          <section className="route-mobile-detail" aria-live="polite">
            <span>{activeArea.status}</span>
            <h3>{activeArea.title}</h3>
            <p>{activeArea.guidance}</p>
            <button type="button" onClick={() => onSelectArea(activeArea.id)}>
              Mantener selección <ArrowRight size={18} />
            </button>
          </section>
        ) : null}
      </div>
    </motion.section>
  );
}
