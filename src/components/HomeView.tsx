import { ArrowRight, Map } from "lucide-react";
import { motion } from "framer-motion";
import type { EvaluationArea, KpiCardData } from "../data/companyData";
import { BuildingIllustration } from "./BuildingIllustration";
import { EvaluationNode } from "./EvaluationNode";
import { KpiCard } from "./KpiCard";

type HomeViewProps = {
  areas: EvaluationArea[];
  kpis: KpiCardData[];
  selectedArea?: EvaluationArea;
  onSelectArea: (id: string) => void;
  onRoute: () => void;
};

const positions = ["node-base", "node-docs", "node-operation", "node-risks", "node-clients"];

export function HomeView({ areas, kpis, selectedArea, onSelectArea, onRoute }: HomeViewProps) {
  return (
    <motion.section
      className="screen home-screen"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.32 }}
    >
      <div className="home-copy">
        <h1>
          Entiende tu empresa de un <span>vistazo</span>
        </h1>
        <p>Ordena, revisa y decide con claridad.</p>
        <button className="primary-action" type="button" onClick={() => onSelectArea("base")}>
          Iniciar evaluación <ArrowRight size={24} />
        </button>
        <button className="secondary-action" type="button" onClick={onRoute}>
          Ver ruta <Map size={22} />
        </button>
      </div>

      <div className="home-visual">
        <svg className="connector-layer" viewBox="0 0 780 500" aria-hidden="true">
          <path className="connector green" d="M120 190 C170 300 270 120 350 295" />
          <path className="connector green" d="M70 310 C160 250 190 370 300 310" />
          <path className="connector blue" d="M410 80 C390 160 480 180 430 300" />
          <path className="connector orange" d="M585 160 C545 245 490 205 475 305" />
          <path className="connector gray" d="M660 310 C600 245 550 345 505 306" />
        </svg>
        <BuildingIllustration />
        {areas.map((area, index) => (
          <EvaluationNode
            area={area}
            active={selectedArea?.id === area.id}
            className={positions[index]}
            key={area.id}
            onSelect={onSelectArea}
          />
        ))}
      </div>

      <div className="kpi-row">
        {kpis.map((item) => (
          <KpiCard item={item} key={item.id} />
        ))}
      </div>
    </motion.section>
  );
}
