import { Building2, Gavel, Scale } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const contact = {
  email: "peru.labs.pe@gmail.com",
};

export type Project = {
  name: string;
  description: string;
  url: string;
  host: string;
  icon: LucideIcon;
  tone: "green" | "orange" | "blue";
};

export const projects: Project[] = [
  {
    name: "BEDOIA",
    description: "Revisión y redacción jurídica asistida por IA",
    url: "https://bedoia.oprbguitar.workers.dev",
    host: "bedoia",
    icon: Scale,
    tone: "green",
  },
  {
    name: "CAPTA",
    description: "Inteligencia empresarial: consulta de empresas del Perú",
    url: "https://capta.click",
    host: "capta.click",
    icon: Building2,
    tone: "orange",
  },
  {
    name: "AMAUTA",
    description: "Gestión legal para estudios jurídicos",
    url: "https://amauta.online",
    host: "amauta.online",
    icon: Gavel,
    tone: "blue",
  },
];
