import z from "zod";

export const diasDisponiblesSchema = z.object({
  id: z.number().optional(),
  dia: z.string().min(1, "dia es obligatorio"),
});
