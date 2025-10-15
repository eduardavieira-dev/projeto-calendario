import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Tipo de consulta é obrigatório"),
  nurse: z.string().min(1, "Nome da enfermeira é obrigatório"),
  service: z.string().min(1, "Tipo de consulta é obrigatório"),
  observation: z.string().optional(),
  startDate: z.date({ message: "Data inicial é obrigatória" }),
  endDate: z.date({ message: "Data final é obrigatória" }),
  color: z.enum(["blue", "green", "red", "yellow", "purple", "orange"]),
});

export type TEventFormData = z.infer<typeof eventSchema>;
