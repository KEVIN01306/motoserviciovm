import z from "zod";

// Validates and coerces query params for GET /tipoServicioHorario
export const tipoServicioHorarioQuerySchema = z.object({
  sucursalId: z.coerce.number().int().optional(),
  tipoHorarioId: z.coerce.number().int().optional(),
});
