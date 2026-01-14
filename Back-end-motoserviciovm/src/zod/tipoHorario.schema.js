import z from "zod";

export const tipoHorarioSchema = z.object({
  id: z.string().optional(),
  tipo: z.string().min(1, "El tipo de horario es obligatorio"),
});
