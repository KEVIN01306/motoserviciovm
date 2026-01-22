import z from "zod";

// Permitir múltiples estadoId por query: ?estadoIds=1,2 o ?estadoIds=1&estadoIds=2 o ?estadoId=1
const estadoIdsSchema = z.preprocess((v) => {
  if (Array.isArray(v)) return v; // estadoIds=["1","2"]
  if (typeof v === 'string') return v.split(','); // "1,2"
  if (typeof v === 'number') return [v]; // 1
  return v; // undefined o cualquier otro
}, z.array(z.coerce.number().int()).optional());

export const citaQuerySchema = z.object({
  sucursalId: z.coerce.number().int().optional(),
  estadoId: z.coerce.number().int().optional(), // compatibilidad con un solo estado
  estadoIds: estadoIdsSchema, // nuevo: múltiples estados
  clienteId: z.coerce.number().int().optional(),
  tipoServicioId: z.coerce.number().int().optional(),
  fechaInicio: z.coerce.date().optional(),
  fechaFin: z.coerce.date().optional(),
  fechaCita: z.coerce.date().optional(),
});
