import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Bot,
  ChartColumn,
  Check,
  CircleCheck,
  Coins,
  FileSpreadsheet,
  FileText,
  Flag,
  GraduationCap,
  ListChecks,
  Mail,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  TriangleAlert,
  Upload,
  UserSearch,
  UsersRound,
  Wallet,
  Zap,
  Clock,
  ShieldCheck,
  BadgeCheck,
  ArrowRight,
  Cloud,
  Inbox,
  TrendingUp,
  UserRound,
  Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { PhaseId } from "../data/phases";
import { LogoMark } from "./Logo";

/* ---------- Centre visuals ---------- */

const activationSteps = ["Conectando tus datos…", "Configurando agentes…", "Ajustando flujos…", "¡Listo en pocos días!"];

function ActivaVisual() {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setDone((value) => (value >= activationSteps.length + 1 ? 0 : value + 1)), 1100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="visual visual-activa">
      <ul className="activation-list" aria-label="Pasos de activación">
        {activationSteps.map((step, index) => (
          <li key={step} className={index < done ? "done" : undefined}>
            <span className="tick">{index < done ? <Check size={13} /> : null}</span>
            {step}
          </li>
        ))}
      </ul>
      <div className="activation-flow" aria-hidden="true">
        <svg viewBox="0 0 300 220" className="flow-ring">
          <path d="M150 20 C 260 20 280 120 230 170 C 190 210 110 210 70 170 C 20 120 40 20 150 20" />
        </svg>
        <span className="flow-pill flow-pill-a">
          <FileText size={15} /> Tus datos
        </span>
        <span className="flow-core">
          <LogoMark size={40} />
        </span>
        <span className="flow-pill flow-pill-b">
          <Sparkles size={15} /> Agentes IA
        </span>
        <span className="flow-pill flow-pill-c">
          <ChartColumn size={15} /> Tu operación más simple
        </span>
      </div>
      <p className="visual-note">De tus datos a resultados rápido</p>
    </div>
  );
}

const agents = [
  { icon: ChartColumn, name: "Agente Finanzas", detail: "Analiza y reporta", tone: "green" },
  { icon: Settings, name: "Agente Operaciones", detail: "Procesa y organiza", tone: "violet" },
  { icon: UsersRound, name: "Agente Ventas", detail: "Responde y resume", tone: "blue" },
];
const tools = [
  { icon: FileSpreadsheet, name: "Excel", detail: "Archivos y datos" },
  { icon: Mail, name: "Correo", detail: "Emails y respuestas" },
  { icon: ListChecks, name: "Tareas", detail: "Seguimiento" },
  { icon: FileText, name: "Documentos", detail: "Lee y genera" },
];

function ImplementaVisual() {
  return (
    <div className="visual visual-implementa">
      <div className="ops-head">
        <strong>Agentes en acción</strong>
        <span className="live-pill">
          <span /> Operando
        </span>
      </div>
      <div className="ops-agents">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <div className={`ops-agent tone-${agent.tone}`} key={agent.name}>
              <span className="ico">
                <Icon size={17} />
              </span>
              <span>
                <strong>{agent.name}</strong>
                <small>{agent.detail}</small>
              </span>
            </div>
          );
        })}
      </div>
      <svg className="ops-links" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M66 0 V20 H334 V0 M200 20 V40 M50 40 V20 M150 40 V20 M250 40 V20 M350 40 V20" />
      </svg>
      <div className="ops-tools">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div className="ops-tool" key={tool.name}>
              <Icon size={16} />
              <span>
                <strong>{tool.name}</strong>
                <small>{tool.detail}</small>
              </span>
            </div>
          );
        })}
      </div>
      <p className="ops-foot">
        <RefreshCw size={14} /> Todo conectado. Todo trabajando para ti.
      </p>
    </div>
  );
}

const kpis = [
  { icon: Wallet, label: "Costo actual", value: "S/ 12,480", delta: "-12%", good: true },
  { icon: ChartColumn, label: "Ahorro estimado", value: "S/ 3,200", delta: "+18%", good: true },
  { icon: FileText, label: "Licencias evitadas", value: "4", delta: "este mes" },
  { icon: Bot, label: "Agentes activos", value: "6", delta: "4 en ejecución" },
  { icon: CircleCheck, label: "Tareas resueltas", value: "28", delta: "+40%", good: true },
  { icon: FileSpreadsheet, label: "Excel conectado", value: "3 archivos", delta: "Sincronizado" },
];
const insights = [
  { icon: UserSearch, title: "Contrata al perfil correcto", detail: "Un perfil administrativo de 20 h/sem cubre la carga actual." },
  { icon: FileSpreadsheet, title: "Complementa tus Excel", detail: "2 archivos pueden integrarse automáticamente." },
  { icon: Settings, title: "Evita comprar otro software", detail: "Tus agentes actuales ya cubren esa tarea." },
  { icon: Zap, title: "Menos multitarea manual", detail: "6 tareas repetitivas listas para automatizar." },
];

function AcompanaVisual() {
  return (
    <div className="visual visual-acompana">
      <div className="ops-head">
        <span className="live-pill">
          <span /> En tiempo real
        </span>
        <small className="sample-tag">Datos de ejemplo</small>
      </div>
      <div className="kpi-grid">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div className="kpi" key={kpi.label}>
              <span className="kpi-label">
                <Icon size={14} /> {kpi.label}
              </span>
              <strong>{kpi.value}</strong>
              <small className={kpi.good ? "good" : undefined}>
                {kpi.good ? kpi.delta.startsWith("-") ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} /> : null}
                {kpi.delta}
              </small>
            </div>
          );
        })}
      </div>
      <p className="insights-title">Insights de hoy</p>
      <div className="insight-grid">
        {insights.map((item) => {
          const Icon = item.icon;
          return (
            <div className="insight" key={item.title}>
              <Icon size={16} />
              <span>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const cycle = [
  { icon: Search, title: "Diagnóstico", detail: "Identificamos oportunidades" },
  { icon: Settings, title: "Implementación", detail: "Configuramos y activamos" },
  { icon: ChartColumn, title: "Uso", detail: "Tu equipo trabaja con IA" },
  { icon: UsersRound, title: "Capacitación", detail: "Formamos y potenciamos" },
  { icon: RefreshCw, title: "Mejora", detail: "Optimizamos continuamente" },
  { icon: Flag, title: "Nuevo ciclo", detail: "Reiniciamos para crecer" },
];
const gains = [
  { icon: Coins, title: "Menos licencias", detail: "Menores costos" },
  { icon: Clock, title: "Menos carga", detail: "Más tiempo" },
  { icon: ShieldCheck, title: "Más control", detail: "Todo en orden" },
  { icon: Zap, title: "Más velocidad", detail: "Decisiones ágiles" },
];

function OptimizaVisual() {
  return (
    <div className="visual visual-optimiza">
      <div className="cycle">
        <svg className="cycle-ring" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="78" />
        </svg>
        <div className="cycle-core">
          <LogoMark size={44} />
          <span>Acompañamiento total, de inicio a fin.</span>
        </div>
        {cycle.map((step, index) => {
          const Icon = step.icon;
          return (
            <div className={`cycle-step cycle-step-${index + 1}`} key={step.title}>
              <span className="ico">
                <Icon size={16} />
              </span>
              <span>
                <strong>
                  {index + 1}. {step.title}
                </strong>
                <small>{step.detail}</small>
              </span>
            </div>
          );
        })}
      </div>
      <div className="gain-row">
        {gains.map((gain) => {
          const Icon = gain.icon;
          return (
            <div className="gain" key={gain.title}>
              <Icon size={15} />
              <span>
                <strong>{gain.title}</strong>
                <small>{gain.detail}</small>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const toolbox = [
  { icon: FileSpreadsheet, name: "Excel+", detail: "Potencia tu Excel con IA", tone: "green" },
  { icon: ChartColumn, name: "Costo en tiempo real", detail: "Gastos y márgenes", tone: "orange" },
  { icon: UserRound, name: "Hiring AI", detail: "Contrata mejor", tone: "violet" },
  { icon: TrendingUp, name: "Sales assist", detail: "Impulsa tus ventas", tone: "blue" },
  { icon: Inbox, name: "Inbox AI", detail: "Organiza tu correo", tone: "blue" },
  { icon: Bot, name: "Agentes", detail: "Trabajan por ti", tone: "violet" },
  { icon: FileText, name: "Docs AI", detail: "Genera documentos", tone: "orange" },
  { icon: Workflow, name: "Flujos", detail: "Automatiza procesos", tone: "green" },
];

function HerramientasVisual() {
  return (
    <div className="visual visual-tools">
      <div className="toolbox">
        {toolbox.slice(0, 4).map((tool) => (
          <ToolCard key={tool.name} {...tool} />
        ))}
        <div className="toolbox-hub">
          <LogoMark size={46} />
          <span>Tu toolbox conectado</span>
        </div>
        {toolbox.slice(4).map((tool) => (
          <ToolCard key={tool.name} {...tool} />
        ))}
      </div>
      <p className="tools-foot">
        <Cloud size={14} /> Local o en la nube · Capacitación · Reportes · Cloud sync
      </p>
    </div>
  );
}

function ToolCard({ icon: Icon, name, detail, tone }: (typeof toolbox)[number]) {
  return (
    <div className={`tool tone-${tone}`}>
      <span className="ico">
        <Icon size={16} />
      </span>
      <span>
        <strong>{name}</strong>
        <small>{detail}</small>
      </span>
    </div>
  );
}

export function PhaseVisual({ id }: { id: PhaseId }) {
  if (id === "herramientas") return <HerramientasVisual />;
  if (id === "implementa") return <ImplementaVisual />;
  if (id === "acompana") return <AcompanaVisual />;
  if (id === "optimiza") return <OptimizaVisual />;
  return <ActivaVisual />;
}

/* ---------- Right-hand cards ---------- */

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}>
          <span className="check">
            <Check size={14} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

const timeline = [
  { day: "Día 1", text: "Diagnóstico y diseño", done: true },
  { day: "Día 3", text: "Conexión de herramientas", done: true },
  { day: "Día 5", text: "Capacitación del equipo" },
  { day: "Día 7", text: "En operación" },
];

const alerts = [
  { icon: TriangleAlert, title: "Costo subiendo", detail: "+22% en herramientas de marketing", time: "Hoy", action: "Revisar", tone: "red" },
  { icon: UserSearch, title: "Vacante recomendada", detail: "Perfil administrativo ideal encontrado", time: "1 h", action: "Ver perfil", tone: "green" },
  { icon: Upload, title: "Archivo pendiente", detail: "Tu reporte financiero de marzo", time: "2 h", action: "Subir", tone: "amber" },
  { icon: GraduationCap, title: "Capacitación completada", detail: "Tu equipo terminó el curso de Excel con IA", time: "Hoy", action: "Ver", tone: "green" },
];

const results = [
  { icon: Coins, title: "Ahorro sostenido", detail: "Costos más bajos en el tiempo" },
  { icon: UsersRound, title: "Equipo capacitado", detail: "Usuarios que saben y aprovechan" },
  { icon: FileText, title: "Proceso documentado", detail: "Todo registrado y estandarizado" },
  { icon: Settings, title: "Agentes afinados", detail: "Mejor rendimiento y precisión" },
  { icon: RefreshCw, title: "Siguiente ciclo listo", detail: "Nuevas oportunidades de mejora" },
];

const combos = [
  { icon: ChartColumn, goal: "Para ventas", tools: ["Sales assist", "Inbox AI"], tone: "green" },
  { icon: Coins, goal: "Para costos", tools: ["Costo en tiempo real", "Reportes"], tone: "orange" },
  { icon: UsersRound, goal: "Para contratación", tools: ["Hiring AI", "Docs AI"], tone: "violet" },
  { icon: FileText, goal: "Para documentos", tools: ["Docs AI", "Flujos"], tone: "blue" },
];

export function PhaseSideCard({ id, onAsk }: { id: PhaseId; onAsk?: (message: string) => void }) {
  if (id === "herramientas") {
    return (
      <div className="side-card">
        <p className="eyebrow">Elige tu combinación</p>
        <p className="side-sub">Soluciones recomendadas por objetivo.</p>
        <ul className="combo-list">
          {combos.map((combo) => {
            const Icon = combo.icon;
            return (
              <li key={combo.goal} className={`tone-${combo.tone}`}>
                <button type="button" onClick={() => onAsk?.(`Quiero la combinación ${combo.goal.toLowerCase()}: ${combo.tools.join(" + ")}. ¿Cómo empiezo?`)}>
                  <span className="ico">
                    <Icon size={16} />
                  </span>
                  <span className="combo-copy">
                    <strong>{combo.goal}</strong>
                    <span className="combo-tags">
                      {combo.tools.map((tool) => (
                        <em key={tool}>{tool}</em>
                      ))}
                    </span>
                  </span>
                  <ArrowRight size={16} className="combo-go" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  if (id === "implementa") {
    return (
      <div className="side-card">
        <h3>
          <Zap size={20} /> Implementación rápida
        </h3>
        <p className="side-sub">De la idea a la operación, en días.</p>
        <ol className="timeline">
          {timeline.map((item) => (
            <li key={item.day} className={item.done ? "done" : undefined}>
              <span className="timeline-dot">{item.done ? <Check size={11} /> : null}</span>
              <strong>{item.day}</strong>
              <small>{item.text}</small>
            </li>
          ))}
        </ol>
        <CheckList items={["Funciona con tus herramientas actuales", "Bajo costo y alto impacto", "Local o en la nube"]} />
      </div>
    );
  }

  if (id === "acompana") {
    return (
      <div className="side-card">
        <h3>
          <Bell size={20} /> Alertas inteligentes
        </h3>
        <ul className="alert-list">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <li key={alert.title} className={`tone-${alert.tone}`}>
                <span className="ico">
                  <Icon size={16} />
                </span>
                <span className="alert-copy">
                  <strong>{alert.title}</strong>
                  <small>{alert.detail}</small>
                </span>
                <span className="alert-meta">
                  <em>{alert.time}</em>
                  <span className="alert-action">{alert.action}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  if (id === "optimiza") {
    return (
      <div className="side-card">
        <h3>
          <ChartColumn size={20} /> Tu optimización en resultados
        </h3>
        <ul className="result-list">
          {results.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.title}>
                <span className="ico">
                  <Icon size={16} />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.detail}</small>
                </span>
                <BadgeCheck size={18} className="result-ok" />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="side-card">
      <h3>
        <Zap size={20} /> Implementación 3–7 días
      </h3>
      <CheckList items={["Implementación en 3–7 días", "1 licencia central", "Menos software disperso", "Listo para acompañamiento"]} />
    </div>
  );
}
