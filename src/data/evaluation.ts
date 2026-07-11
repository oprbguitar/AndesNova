export type EvaluationOption = {
  label: string;
  score: 0 | 1 | 2;
};

export type EvaluationQuestion = {
  id: string;
  text: string;
  risk: string;
};

export type EvaluationAreaDef = {
  id: string;
  title: string;
  color: string;
  questions: EvaluationQuestion[];
  recommendation: string;
  documentsToPrepare: string;
};

export type GeneralData = {
  company: string;
  sector: string;
  size: string;
};

export const evaluationOptions: EvaluationOption[] = [
  { label: "Sí, está controlado", score: 2 },
  { label: "Parcialmente", score: 1 },
  { label: "No / no se hace", score: 0 },
];

export const sectors = [
  "Servicios",
  "Comercio",
  "Manufactura",
  "Construcción",
  "Minería / Energía",
  "Tecnología",
  "Salud",
  "Educación",
  "Otro",
];

export const companySizes = [
  "Micro (1-10)",
  "Pequeña (11-50)",
  "Mediana (51-250)",
  "Grande (250+)",
];

export const evaluationAreas: EvaluationAreaDef[] = [
  {
    id: "documentation",
    title: "Documentación",
    color: "#20a84a",
    recommendation:
      "Implementar gestión documental: inventario, estructura de carpetas, control de vigencias y responsables de archivo.",
    documentsToPrepare: "listado de documentos críticos, vigencias y carpetas actuales",
    questions: [
      {
        id: "doc-inventario",
        text: "¿Los documentos críticos están inventariados y se ubican rápido?",
        risk: "Documentos críticos sin inventario: riesgo de pérdida y demoras en auditorías o trámites.",
      },
      {
        id: "doc-vigencias",
        text: "¿Controlan vigencias y vencimientos documentales (licencias, certificados, contratos)?",
        risk: "Vigencias sin control: multas, contratos vencidos y pérdida de cobertura legal.",
      },
      {
        id: "doc-estructura",
        text: "¿Existe una estructura de carpetas definida con responsables de archivo?",
        risk: "Archivo sin estructura ni responsables: información duplicada y decisiones con datos desactualizados.",
      },
    ],
  },
  {
    id: "operation",
    title: "Procesos y operación",
    color: "#0c63ff",
    recommendation:
      "Mapear los procesos clave, identificar cuellos de botella y definir responsables y aprobaciones claras.",
    documentsToPrepare: "flujos o procedimientos actuales, organigrama y puntos de aprobación",
    questions: [
      {
        id: "ops-mapeo",
        text: "¿Los procesos clave están mapeados o documentados?",
        risk: "Procesos sin mapear: la operación depende de personas y no de métodos, difícil de escalar.",
      },
      {
        id: "ops-demoras",
        text: "¿La operación fluye sin demoras ni reprocesos recurrentes?",
        risk: "Demoras y reprocesos recurrentes: sobrecostos operativos y clientes insatisfechos.",
      },
      {
        id: "ops-responsables",
        text: "¿Cada proceso tiene responsables y aprobaciones definidas?",
        risk: "Responsabilidades difusas: decisiones trabadas y errores sin dueño identificable.",
      },
    ],
  },
  {
    id: "risks",
    title: "Riesgos",
    color: "#ff7a18",
    recommendation:
      "Priorizar riesgos legales y operativos, controlar vencimientos contractuales y definir planes de mitigación.",
    documentsToPrepare: "contratos vigentes, obligaciones, fechas clave y matriz de riesgos si existe",
    questions: [
      {
        id: "risk-identificacion",
        text: "¿Identifican y priorizan los riesgos legales y operativos del negocio?",
        risk: "Riesgos sin identificar: exposición legal y operativa sin priorización ejecutiva.",
      },
      {
        id: "risk-contratos",
        text: "¿Los contratos y obligaciones tienen seguimiento de vencimientos?",
        risk: "Contratos sin seguimiento: renovaciones automáticas indeseadas y penalidades por incumplimiento.",
      },
      {
        id: "risk-mitigacion",
        text: "¿Cuentan con planes de mitigación para los riesgos altos?",
        risk: "Riesgos altos sin plan de mitigación: una contingencia puede detener la operación.",
      },
    ],
  },
  {
    id: "clients",
    title: "Clientes y objetivos",
    color: "#73839a",
    recommendation:
      "Medir la salud de la cartera, definir KPIs de negocio y montar reportes que lleguen a tiempo para decidir.",
    documentsToPrepare: "cartera de clientes, objetivos del año y reportes de gestión actuales",
    questions: [
      {
        id: "cli-cartera",
        text: "¿Conocen la salud de su cartera de clientes (retención, señales de riesgo)?",
        risk: "Cartera sin señales: pérdida silenciosa de clientes y dependencia de pocos ingresos.",
      },
      {
        id: "cli-objetivos",
        text: "¿Los objetivos del negocio están definidos y se miden con indicadores?",
        risk: "Objetivos sin indicadores: el avance se percibe por intuición y no por datos.",
      },
      {
        id: "cli-reportes",
        text: "¿La información para decidir llega a tiempo (reportes o tableros)?",
        risk: "Reportes tardíos o inexistentes: decisiones gerenciales a ciegas o fuera de tiempo.",
      },
    ],
  },
];

export type AreaResult = {
  id: string;
  title: string;
  color: string;
  score: number;
  maxScore: number;
  level: "Crítico" | "En proceso" | "Sólido";
  levelColor: string;
};

export function computeAreaResult(area: EvaluationAreaDef, answers: Record<string, number>): AreaResult {
  const score = area.questions.reduce((total, question) => total + (answers[question.id] ?? 0), 0);
  const maxScore = area.questions.length * 2;

  const level = score >= 5 ? "Sólido" : score >= 3 ? "En proceso" : "Crítico";
  const levelColor = score >= 5 ? "#20a84a" : score >= 3 ? "#0c63ff" : "#ff7a18";

  return { id: area.id, title: area.title, color: area.color, score, maxScore, level, levelColor };
}

export function collectPriorityRisks(answers: Record<string, number>): string[] {
  const scored = evaluationAreas
    .flatMap((area) => area.questions)
    .map((question) => ({ risk: question.risk, score: answers[question.id] ?? 0 }))
    .filter((item) => item.score < 2)
    .sort((a, b) => a.score - b.score);

  return scored.slice(0, 3).map((item) => item.risk);
}

export function collectRecommendations(results: AreaResult[]): string[] {
  const weak = results
    .filter((result) => result.score <= 4)
    .sort((a, b) => a.score - b.score)
    .map((result) => {
      const area = evaluationAreas.find((item) => item.id === result.id);
      return area ? area.recommendation : "";
    })
    .filter(Boolean);

  if (weak.length === 0) {
    return [
      "Mantener los controles actuales y programar una revisión trimestral para sostener el nivel alcanzado.",
    ];
  }

  return weak;
}

export function collectNextSteps(results: AreaResult[]): string[] {
  const weakest = [...results].sort((a, b) => a.score - b.score)[0];
  const area = evaluationAreas.find((item) => item.id === weakest?.id);

  return [
    "Solicitar contacto con un especialista adjuntando este diagnóstico.",
    area
      ? `Preparar la información del área más débil (${area.title.toLowerCase()}): ${area.documentsToPrepare}.`
      : "Preparar la información básica de la empresa para la evaluación.",
    "Agendar una revisión de seguimiento en 30 días para medir el avance.",
  ];
}

export function buildDiagnosisText(
  general: GeneralData,
  results: AreaResult[],
  risks: string[],
  recommendations: string[],
  nextSteps: string[],
): string {
  const date = new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" });

  return [
    "DIAGNÓSTICO PRELIMINAR - ANDESNOVA",
    `Empresa: ${general.company || "No indicada"} · Sector: ${general.sector || "No indicado"} · Tamaño: ${general.size || "No indicado"}`,
    `Fecha: ${date}`,
    "",
    "NIVEL POR ÁREA",
    ...results.map((result) => `- ${result.title}: ${result.level} (${result.score}/${result.maxScore})`),
    "",
    "RIESGOS PRIORITARIOS",
    ...(risks.length ? risks.map((risk, index) => `${index + 1}. ${risk}`) : ["Sin riesgos prioritarios detectados."]),
    "",
    "RECOMENDACIONES",
    ...recommendations.map((item) => `- ${item}`),
    "",
    "PRÓXIMOS PASOS",
    ...nextSteps.map((step, index) => `${index + 1}. ${step}`),
    "",
    "Diagnóstico preliminar generado en el portal AndesNova. No constituye una conclusión legal ni financiera definitiva.",
  ].join("\n");
}
