import type { TEventColor } from "@/components/types";

export type Nurse = {
  id: string;
  name: string;
  picturePath: string | null;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  duration: number; // duração em minutos
};

export const NURSES: Nurse[] = [
  {
    id: "maria",
    name: "Maria Silva",
    picturePath: null,
  },
  {
    id: "ana",
    name: "Ana Santos",
    picturePath: null,
  },
  {
    id: "juliana",
    name: "Juliana Lima",
    picturePath: null,
  },
];

export const SERVICES: Service[] = [
  {
    id: "pre-natal",
    name: "Consulta Pré-natal",
    description: "Acompanhamento gestacional",
    duration: 60,
  },
  {
    id: "pos-parto",
    name: "Consulta Pós-parto",
    description: "Acompanhamento pós-parto",
    duration: 60,
  },
  {
    id: "amamentacao",
    name: "Consultoria em Amamentação",
    description: "Orientação para amamentação",
    duration: 45,
  },
  {
    id: "planejamento-familiar",
    name: "Planejamento Familiar",
    description: "Orientação contraceptiva",
    duration: 45,
  },
  {
    id: "saude-mulher",
    name: "Saúde da Mulher",
    description: "Consulta geral",
    duration: 45,
  },
];
