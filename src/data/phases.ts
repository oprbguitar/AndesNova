import {
  Bell,
  Bot,
  ChartColumn,
  Cloud,
  Coins,
  Cpu,
  Database,
  FileSpreadsheet,
  FileText,
  Folder,
  GraduationCap,
  Mail,
  MapPin,
  RefreshCw,
  Server,
  Settings,
  TrendingUp,
  UserRound,
  UsersRound,
  Workflow,
  Activity,
  Network,
  Clock,
  Layers,
  Search,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PhaseId = "activa" | "implementa" | "acompana" | "optimiza" | "herramientas";

export type Feature = {
  icon: LucideIcon;
  title: string;
  detail: string;
  tone: "green" | "orange" | "violet" | "blue";
};

export type ChatChip = {
  icon: LucideIcon;
  label: string;
  message: string;
};

export type Phase = {
  id: PhaseId;
  number: number;
  name: string;
  routeLabel: string;
  routeDetail: string;
  eyebrow: string;
  title: [string, string];
  lead: string;
  cta: string;
  note: string;
  chatGreeting: string;
  chips: ChatChip[];
  panelEyebrow: string;
  panelTitle: string;
  panelSubtitle: string;
  panelBody?: string;
  features: Feature[];
  hashtag: string;
};

export const phases: Phase[] = [
  {
    id: "activa",
    number: 1,
    name: "Activa",
    routeLabel: "Activa",
    routeDetail: "IA First",
    eyebrow: "Operaciones inteligentes con IA",
    title: ["Reduce costos.", "Activa IA real."],
    lead: "IA First con Pod-of-One y agentes. Implementación en 3–7 días. Bajo costo. Local o nube. Menos software, más resultados.",
    cta: "Quiero reducir costos",
    note: "Resultados reales en menos tiempo",
    chatGreeting:
      "Hola, soy AndesNova 👋 Te acompaño de inicio a fin. Con IA, agentes y un Pod-of-One para tu negocio.",
    chips: [
      { icon: ChartColumn, label: "Reducir costos", message: "Quiero reducir los costos operativos de mi negocio con IA. ¿Por dónde empiezo?" },
      { icon: FileSpreadsheet, label: "Usar mis Excel", message: "Trabajo con muchos Excel. ¿Cómo pueden ayudarme los agentes a sacarles más provecho?" },
      { icon: UsersRound, label: "Contratar mejor", message: "Quiero contratar mejor y más rápido. ¿Qué me recomiendas?" },
      { icon: Bot, label: "Activar agentes", message: "¿Qué agentes de IA puedo activar primero en mi negocio?" },
    ],
    panelEyebrow: "Fase 1",
    panelTitle: "Activa tu operación",
    panelSubtitle: "IA First, bajo costo, sin fricción.",
    features: [
      { icon: Cpu, title: "AI First", detail: "IA en tu realidad", tone: "green" },
      { icon: UserRound, title: "Pod-of-One", detail: "Tu equipo aumentado", tone: "orange" },
      { icon: Network, title: "Agentes", detail: "Ejecutan por ti", tone: "violet" },
      { icon: Database, title: "Low cost", detail: "Menos licencias", tone: "orange" },
      { icon: Server, title: "Local", detail: "En tu entorno o nube", tone: "blue" },
      { icon: FileSpreadsheet, title: "Excel+", detail: "Usa tus archivos", tone: "green" },
    ],
    hashtag: "#MenosCostoMásControl",
  },
  {
    id: "implementa",
    number: 2,
    name: "Implementa",
    routeLabel: "Implementa",
    routeDetail: "Agentes en acción",
    eyebrow: "Implementación con IA",
    title: ["Implementa hoy.", "Agentes que trabajan para ti."],
    lead: "Activamos agentes, conectamos tus herramientas y comenzamos a generar resultados en pocos días, con costos accesibles, en la nube o en tu entorno local.",
    cta: "Quiero implementar",
    note: "Implementación hoy, resultados mañana",
    chatGreeting:
      "Hola, soy AndesNova 👋 Te ayudo a implementar agentes con IA, conectar tus herramientas y ponerlo en marcha rápidamente. ¿Qué necesitas hoy?",
    chips: [
      { icon: Bot, label: "Implementar agentes", message: "Quiero implementar agentes de IA en mi negocio. ¿Cómo sería el plan de 7 días?" },
      { icon: Workflow, label: "Conectar herramientas", message: "¿Cómo conectan los agentes con las herramientas que ya uso?" },
      { icon: Mail, label: "Usar Excel y correo", message: "Quiero que los agentes trabajen con mi Excel y mi correo. ¿Es posible?" },
      { icon: Cloud, label: "Activar local o nube", message: "¿Qué conviene más para mi negocio: implementación local o en la nube?" },
    ],
    panelEyebrow: "Fase 2 · Implementación",
    panelTitle: "Implementa sin fricción",
    panelSubtitle: "Agentes + herramientas + proceso guiado.",
    panelBody:
      "Conectamos con tus herramientas actuales, configuramos agentes y ponemos todo en marcha de forma rápida, segura y a tu medida.",
    features: [
      { icon: Bot, title: "Agentes", detail: "Trabajan contigo", tone: "green" },
      { icon: Server, title: "Local", detail: "En tu infraestructura", tone: "violet" },
      { icon: Cloud, title: "Cloud", detail: "Flexible y seguro", tone: "blue" },
      { icon: Mail, title: "Correo", detail: "Gmail / Outlook", tone: "orange" },
      { icon: FileSpreadsheet, title: "Excel", detail: "Tus archivos", tone: "green" },
      { icon: Workflow, title: "Flujos", detail: "Automatiza procesos", tone: "blue" },
    ],
    hashtag: "#ImplementaciónRápida",
  },
  {
    id: "acompana",
    number: 3,
    name: "Acompaña",
    routeLabel: "Acompaña",
    routeDetail: "Proceso vivo",
    eyebrow: "Fase 3 | Acompañamiento continuo",
    title: ["Acompañamiento real.", "Costos bajo control."],
    lead: "Agentes de IA trabajando contigo, monitoreando en tiempo real, para que tomes mejores decisiones, reduzcas tu carga operativa y hagas crecer tu negocio con tranquilidad.",
    cta: "Quiero acompañamiento",
    note: "Tu negocio también puede llegar más lejos",
    chatGreeting:
      "Hola, soy AndesNova 👋 Te acompaño en tiempo real para mantener tus costos bajo control y que tu negocio avance. ¿Qué te gustaría hacer hoy?",
    chips: [
      { icon: Activity, label: "Costos en tiempo real", message: "Quiero ver mis costos en tiempo real. ¿Qué indicadores debería vigilar?" },
      { icon: FileSpreadsheet, label: "Usar mis Excel", message: "¿Cómo se conectan mis Excel al acompañamiento en tiempo real?" },
      { icon: UserRound, label: "Contratar mejor", message: "¿Cómo me ayuda el acompañamiento a contratar al perfil correcto?" },
      { icon: Bell, label: "Ver agentes activos", message: "¿Qué hacen los agentes activos durante el acompañamiento y qué alertas envían?" },
    ],
    panelEyebrow: "Fase 3",
    panelTitle: "Acompaña en tiempo real",
    panelSubtitle: "No es solo tablero: es apoyo continuo.",
    panelBody:
      "Visibilidad en tiempo real con agentes que detectan oportunidades, controlan costos y resuelven tareas junto a ti.",
    features: [
      { icon: Activity, title: "Visión viva", detail: "Tu negocio hoy", tone: "green" },
      { icon: Coins, title: "Costos", detail: "Bajo control", tone: "orange" },
      { icon: Bell, title: "Alertas", detail: "Antes del problema", tone: "violet" },
      { icon: UsersRound, title: "Contratación", detail: "Perfil correcto", tone: "blue" },
      { icon: Folder, title: "Archivos", detail: "Siempre al día", tone: "orange" },
      { icon: Bot, title: "Agentes", detail: "Trabajando 24/7", tone: "green" },
    ],
    hashtag: "#TiempoReal #CostoBajoControl",
  },
  {
    id: "optimiza",
    number: 4,
    name: "Optimiza",
    routeLabel: "Optimiza",
    routeDetail: "Menos costo",
    eyebrow: "Optimización continua",
    title: ["El proceso no se detiene.", "Te acompañamos siempre."],
    lead: "Después de la implementación seguimos a tu lado: capacitamos a tu equipo, optimizamos tus procesos, documentamos todo y reiniciamos el ciclo para que sigas creciendo con menos costos.",
    cta: "Quiero optimizar",
    note: "Un ciclo que siempre sigue llevándote más lejos",
    chatGreeting:
      "Hola, soy AndesNova 👋 Te ayudo a optimizar, capacitar y seguir mejorando. ¿Qué te gustaría hacer hoy?",
    chips: [
      { icon: ChartColumn, label: "Optimizar costos", message: "Ya tengo procesos con IA. ¿Cómo sigo optimizando costos?" },
      { icon: GraduationCap, label: "Capacitar equipo", message: "Quiero capacitar a mi equipo para aprovechar mejor los agentes. ¿Qué propones?" },
      { icon: Settings, label: "Revisar agentes", message: "¿Cómo se revisan y afinan los agentes después de implementarlos?" },
      { icon: RefreshCw, label: "Reiniciar ciclo", message: "¿Cómo funciona cerrar y reiniciar el ciclo de mejora?" },
    ],
    panelEyebrow: "Fase 4 · Optimización",
    panelTitle: "Optimiza y vuelve a crecer.",
    panelSubtitle: "Capacita, mejora y reinicia el ciclo.",
    panelBody:
      "El camino no termina con la implementación: capacitación, documentación y mejora continua para que tu negocio sea cada vez más eficiente.",
    features: [
      { icon: GraduationCap, title: "Capacitación", detail: "Equipos listos", tone: "green" },
      { icon: UsersRound, title: "Acompañamiento", detail: "Siempre a tu lado", tone: "blue" },
      { icon: Settings, title: "Automatización", detail: "Más eficiencia", tone: "violet" },
      { icon: FileText, title: "Documentación", detail: "Todo registrado", tone: "orange" },
      { icon: TrendingUp, title: "Mejora continua", detail: "Evoluciona", tone: "green" },
      { icon: MapPin, title: "Escala", detail: "Listo para crecer", tone: "blue" },
    ],
    hashtag: "#CicloVivo",
  },
  {
    id: "herramientas",
    number: 5,
    name: "Herramientas",
    routeLabel: "Herramientas",
    routeDetail: "Tu toolbox",
    eyebrow: "Herramientas de IA para negocios reales",
    title: ["Herramientas que", "reducen costo hoy."],
    lead: "Un toolbox de IA, simple y de bajo costo, que complementa tus herramientas actuales. Implementa en tu empresa, local o en la nube, y empieza a ver resultados.",
    cta: "Quiero mi toolbox",
    note: "Herramientas inteligentes para llegar más lejos",
    chatGreeting:
      "Hola, soy AndesNova 👋 Te ayudo a elegir las herramientas ideales para tu negocio con IA. ¿Qué te gustaría hacer hoy?",
    chips: [
      { icon: Activity, label: "Costos en tiempo real", message: "¿Qué herramienta me ayuda a controlar mis costos en tiempo real?" },
      { icon: FileSpreadsheet, label: "Complementa mi Excel", message: "¿Cómo funciona Excel+ para complementar mis archivos de Excel?" },
      { icon: UsersRound, label: "Contrata mejor", message: "¿Qué combinación de herramientas me recomiendas para contratar mejor?" },
      { icon: FileText, label: "Crear documentos", message: "Quiero generar y organizar documentos con IA. ¿Qué herramientas uso?" },
    ],
    panelEyebrow: "Nuestras herramientas",
    panelTitle: "Herramientas que activan tu operación.",
    panelSubtitle: "AI First + bajo costo + local o nube.",
    panelBody: "Complementa lo que ya usas, sin sumar software disperso.",
    features: [
      { icon: Search, title: "1 licencia central", detail: "Para todo tu negocio", tone: "green" },
      { icon: Layers, title: "Menos software", detail: "Más simplicidad", tone: "blue" },
      { icon: Zap, title: "Rápido de activar", detail: "En días, no meses", tone: "orange" },
      { icon: Clock, title: "Acompañamiento", detail: "De 3 a 7 días", tone: "violet" },
    ],
    hashtag: "#ToolstackLigero",
  },
];

export const phaseIds = phases.map((phase) => phase.id);
