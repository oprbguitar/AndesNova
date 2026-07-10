import {
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  FileText,
  Folder,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StatusKey = "ready" | "normalized" | "progress" | "review" | "pending";

export type EvaluationArea = {
  id: string;
  title: string;
  status: string;
  statusKey: StatusKey;
  color: string;
  icon: LucideIcon;
  description: string;
  actions: string[];
  guidance: string;
};

export type KpiCardData = {
  id: string;
  title: string;
  value: string;
  detail: string;
  tone: StatusKey;
  icon: LucideIcon;
};

export const companyData = {
  companyName: "AndesNova",
  navigation: ["Inicio"],
  contact: {
    name: "Pierre R.",
    email: "peru.labs.pe@gmail.com",
  },
  assistant: {
    homeTitle: "Hola, soy Andes 👋",
    homeSubtitle: "Estoy aquí para ayudarte.",
    routeTitle: "Hola 👋",
    routeSubtitle: "Sigo tu ruta de cerca.",
    status: "Estoy aquí para ayudarte",
    defaultGuidance:
      "Te recomiendo revisar riesgos y documentación para mantener clara la evaluación.",
    suggestions: [
      { id: "risk", label: "Revisar riesgos", detail: "2 en revisión", areaId: "risks" },
      { id: "docs", label: "Ver documentación", detail: "Todo al día", areaId: "documentation" },
      { id: "start", label: "Iniciar evaluación", detail: "Comienza ahora", areaId: "base" },
    ],
    prompts: [
      "¿Qué debo revisar primero?",
      "Explícame los riesgos",
      "¿Cómo está la documentación?",
      "¿Cuál es el siguiente paso?",
    ],
  },
  areas: [
    {
      id: "base",
      title: "Base",
      status: "Listo",
      statusKey: "ready",
      color: "#20a84a",
      icon: FileText,
      description:
        "La base define el alcance, responsables y criterios mínimos de la evaluación empresarial.",
      actions: ["Confirmar alcance", "Validar responsables", "Cerrar datos faltantes"],
      guidance: "La base está lista. Puedes avanzar hacia documentación y operación.",
    },
    {
      id: "documentation",
      title: "Documentación",
      status: "Normalizado",
      statusKey: "normalized",
      color: "#22b64b",
      icon: ClipboardList,
      description:
        "Los documentos críticos están ordenados para que la consultoría trabaje con evidencia confiable.",
      actions: ["Revisar vigencias", "Ordenar anexos", "Compartir carpeta maestra"],
      guidance: "La documentación está saludable. Mantén vigencias y anexos controlados.",
    },
    {
      id: "operation",
      title: "Operación",
      status: "En proceso",
      statusKey: "progress",
      color: "#0c63ff",
      icon: BriefcaseBusiness,
      description:
        "La operación muestra cómo se ejecutan procesos, controles y decisiones del negocio.",
      actions: ["Mapear procesos", "Detectar cuellos de botella", "Asignar mejora rápida"],
      guidance: "Operación está en proceso. Enfócate en procesos clave y responsables.",
    },
    {
      id: "risks",
      title: "Riesgos",
      status: "En revisión",
      statusKey: "review",
      color: "#ff7a18",
      icon: ShieldCheck,
      description:
        "Los riesgos señalan exposición legal, operativa o financiera que requiere priorización ejecutiva.",
      actions: ["Priorizar riesgos altos", "Definir mitigación", "Agendar revisión"],
      guidance: "Riesgos requiere atención. Prioriza lo crítico y define mitigaciones concretas.",
    },
    {
      id: "clients",
      title: "Clientes",
      status: "Pendiente",
      statusKey: "pending",
      color: "#73839a",
      icon: UsersRound,
      description:
        "La mirada de clientes ayuda a conectar la evaluación con experiencia, valor y retención.",
      actions: ["Revisar cartera", "Identificar señales", "Preparar entrevistas"],
      guidance: "Clientes está pendiente. Reúne señales comerciales antes de cerrar el diagnóstico.",
    },
  ] satisfies EvaluationArea[],
  kpis: [
    {
      id: "progress",
      title: "Progreso general",
      value: "58%",
      detail: "+8% vs. último mes",
      tone: "progress",
      icon: CalendarDays,
    },
    {
      id: "priorities",
      title: "Prioridades",
      value: "2",
      detail: "En revisión",
      tone: "review",
      icon: ShieldCheck,
    },
    {
      id: "pending",
      title: "Pendientes",
      value: "5",
      detail: "Por atender",
      tone: "pending",
      icon: ClipboardList,
    },
    {
      id: "next",
      title: "Próxima revisión",
      value: "12 jun 2025",
      detail: "En 8 días",
      tone: "progress",
      icon: CalendarDays,
    },
  ] satisfies KpiCardData[],
  routeSteps: ["base", "documentation", "operation", "risks", "clients"],
  chatFallback:
    "Aún no tengo esa información en la base de AndesNova. Puedes cargarla en la data de la empresa.",
};
