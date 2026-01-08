import z from 'zod';

export const enReparacionSchema = z.object({
  id: z.number().int().positive().optional(),
  descripcion: z.string().min(3).max(255),
  fechaEntrada: z.coerce.date({ required_error: 'La fecha de entrada es obligatoria' }),
  fechaSalida: z.date().optional().nullable(),
  total: z.number().nonnegative().optional(),
  observaciones: z.string().max(500).optional().nullable(),
  servicioId: z.number().int().positive(),
  estadoId: z.number().int().positive().optional(),
});

export default enReparacionSchema;
