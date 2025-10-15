import type { TEventColor } from "@/components/types";

type ColorOption = {
  value: TEventColor;
  label: string;
};

export const COLORS: ColorOption[] = [
  { value: "blue", label: "Azul" },
  { value: "green", label: "Verde" },
  { value: "red", label: "Vermelho" },
  { value: "yellow", label: "Amarelo" },
  { value: "purple", label: "Roxo" },
  { value: "orange", label: "Laranja" },
] as const;
