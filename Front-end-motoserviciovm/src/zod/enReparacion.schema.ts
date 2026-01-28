import z from 'zod';

export const enReparacionSchema = z.object({
  descripcion: z.string().min(3).max(255),
  fechaEntrada: z.coerce.date({ message: 'La fecha de entrada es obligatoria' }),
  fechaSalida: z.coerce.date().optional(),
  total: z.number().nonnegative().optional(),
  observaciones: z.string().max(500).optional().nullable(),
  servicioId: z.number().int().positive(),
  estadoId: z.number().int().positive().optional(),
  firmaSalida: z.union([z.string(), z.instanceof(File)]).optional().nullable(),
});

export default enReparacionSchema;
