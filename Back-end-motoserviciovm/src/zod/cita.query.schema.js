import z from "zod";

export const citaQuerySchema = z.object({
  sucursalId: z.coerce.number().int().optional(),
  estadoId: z.coerce.number().int().optional(),
  clienteId: z.coerce.number().int().optional(),
  tipoServicioId: z.coerce.number().int().optional(),
  fechaInicio: z.coerce.date().optional(),
  fechaFin: z.coerce.date().optional(),
  fechaCita: z.coerce.date().optional(),
});
