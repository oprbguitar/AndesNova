import { serviceDocs } from "./serviceDocs.js";

// Internal guide the assistant answers from. The first block describes the
// current AndesNova offer (Activa → Implementa → Acompaña → Optimiza); the
// service documents keep covering specific consulting needs.
const offerDocs = [
  {
    id: "perfil-andesnova",
    title: "Perfil de AndesNova",
    category: "Institucional",
    updated: "oct 2026",
    keywords: ["andesnova", "empresa", "consultora", "quienes son", "que hacen", "servicios", "ayuda", "negocio"],
    recommendedService: "Ruta AndesNova: Activa, Implementa, Acompaña y Optimiza",
    suggestedNextStep: "Hacer el diagnóstico de 2 minutos con el botón Comenzar ahora para ubicar la fase de partida.",
    content: `
      AndesNova (Tu negocio más lejos) ayuda a pequeñas y medianas empresas a reducir costos y operar con IA real.
      Trabaja con un enfoque IA First, un Pod-of-One (un especialista que acompaña al equipo del cliente) y agentes
      de IA que ejecutan tareas. La ruta tiene cuatro fases: Activa, Implementa, Acompaña y Optimiza. La
      implementación toma de 3 a 7 días, puede correr local o en la nube y complementa las herramientas que el
      cliente ya usa (Excel, correo, documentos) en lugar de sumar software disperso.
    `,
  },
  {
    id: "fase-activa",
    title: "Fase 1: Activa",
    category: "Ruta AndesNova",
    updated: "oct 2026",
    keywords: ["activa", "activar", "empezar", "inicio", "reducir costos", "costos", "ia first", "pod-of-one", "pod of one", "bajo costo", "licencias"],
    recommendedService: "Activa tu operación",
    suggestedNextStep: "Identificar las 2 o 3 tareas repetitivas que más horas consumen y los archivos que las alimentan.",
    content: `
      Activa prepara la operación para trabajar con IA sin fricción: diagnóstico del negocio, conexión de los datos
      existentes y configuración inicial de agentes. Pilares: AI First (IA aplicada a la realidad del negocio),
      Pod-of-One (equipo aumentado con un especialista), agentes que ejecutan tareas, bajo costo con menos licencias,
      despliegue local o en la nube y Excel+ para usar los archivos actuales. Resultado: una licencia central,
      menos software disperso y la operación lista para implementar en pocos días.
    `,
  },
  {
    id: "fase-implementa",
    title: "Fase 2: Implementa",
    category: "Ruta AndesNova",
    updated: "oct 2026",
    keywords: ["implementa", "implementar", "implementacion", "agentes", "agente", "conectar", "herramientas", "correo", "gmail", "outlook", "flujos", "automatizar", "local", "nube", "cloud"],
    recommendedService: "Implementación de agentes",
    suggestedNextStep: "Listar las herramientas actuales (Excel, correo, carpetas) para planificar la conexión del día 3.",
    content: `
      Implementa pone a trabajar agentes de IA conectados a las herramientas actuales. Plan típico: día 1
      diagnóstico y diseño, día 3 conexión de herramientas, día 5 capacitación del equipo y día 7 en operación.
      Ejemplos de agentes: finanzas (analiza y reporta), operaciones (procesa y organiza) y ventas (responde y
      resume), conectados a Excel, correo, tareas y documentos. Funciona en la infraestructura del cliente o en la
      nube, con bajo costo y acompañamiento en cada etapa.
    `,
  },
  {
    id: "fase-acompana",
    title: "Fase 3: Acompaña",
    category: "Ruta AndesNova",
    updated: "oct 2026",
    keywords: ["acompana", "acompañamiento", "acompanamiento", "tiempo real", "monitoreo", "alertas", "tablero", "dashboard", "kpi", "indicadores", "contratar", "contratacion", "vacante", "perfil"],
    recommendedService: "Acompañamiento en tiempo real",
    suggestedNextStep: "Definir los 3 indicadores que se quieren vigilar (costos, tareas o contratación) para configurar las alertas.",
    content: `
      Acompaña da visibilidad en tiempo real con agentes que monitorean el negocio: costo actual, ahorro estimado,
      licencias evitadas, agentes activos, tareas resueltas y archivos de Excel conectados. Genera alertas
      inteligentes (por ejemplo, un costo que sube o un archivo pendiente) e insights como contratar al perfil
      correcto, complementar los Excel o evitar comprar otro software. No es solo un tablero: es apoyo continuo.
    `,
  },
  {
    id: "fase-optimiza",
    title: "Fase 4: Optimiza",
    category: "Ruta AndesNova",
    updated: "oct 2026",
    keywords: ["optimiza", "optimizar", "optimizacion", "mejora continua", "capacitar", "capacitacion", "documentar", "escalar", "crecer", "ciclo", "reiniciar"],
    recommendedService: "Optimización continua",
    suggestedNextStep: "Revisar con el equipo qué agente o proceso rindió menos para priorizarlo en el siguiente ciclo.",
    content: `
      Optimiza mantiene el ciclo vivo después de la implementación: diagnóstico, implementación, uso, capacitación,
      mejora y nuevo ciclo. Incluye capacitación del equipo, documentación de procesos, ajuste de agentes y mejora
      continua. Resultados buscados: ahorro sostenido, equipo capacitado, proceso documentado, agentes afinados y
      un siguiente ciclo listo con nuevas oportunidades.
    `,
  },
  {
    id: "toolbox-ia",
    title: "Toolbox de IA",
    category: "Herramientas",
    updated: "oct 2026",
    keywords: ["herramientas", "toolbox", "excel", "inbox", "docs ai", "hiring", "sales", "ventas", "reportes", "documentos", "software"],
    recommendedService: "Toolbox AndesNova",
    suggestedNextStep: "Elegir el objetivo principal (ventas, costos, contratación o documentos) para armar la combinación.",
    content: `
      El toolbox de AndesNova combina herramientas simples y de bajo costo: Excel+ (potencia Excel con IA), costo en
      tiempo real, Hiring AI (contratar mejor), Sales assist (impulsa ventas), Inbox AI (organiza y responde el
      correo), agentes, Docs AI (genera y automatiza documentos), flujos de punta a punta, capacitación, reportes y
      cloud sync. Combinaciones sugeridas: ventas (Sales assist + Inbox AI), costos (costo en tiempo real +
      reportes), contratación (Hiring AI + Docs AI) y documentos (Docs AI + flujos).
    `,
  },
  {
    id: "proyectos-andesnova",
    title: "Proyectos en marcha",
    category: "Casos",
    updated: "oct 2026",
    keywords: ["proyectos", "casos", "ejemplos", "bedoia", "capta", "amauta", "clientes", "portafolio"],
    recommendedService: "Proyectos AndesNova",
    suggestedNextStep: "Revisar los proyectos enlazados al pie de la página y contar cuál se parece más a su caso.",
    content: `
      Proyectos activos construidos con este enfoque: BEDOIA, revisión y redacción jurídica asistida por IA;
      CAPTA (capta.click), inteligencia empresarial para consultar empresas del Perú; y AMAUTA (amauta.online),
      gestión legal para estudios jurídicos. Muestran cómo agentes y herramientas ligeras reducen trabajo manual.
    `,
  },
];

export const knowledge = [
  ...offerDocs,
  ...serviceDocs.filter((doc) => doc.id !== "perfil-andesnova"),
];

export const fallbackDocIds = ["perfil-andesnova", "fase-activa", "evaluacion-inicial"];
