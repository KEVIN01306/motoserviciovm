import z from 'zod';

export const enReparacionSchema = z.object({
  id: z.number().int().positive().optional(),
  descripcion: z.string().min(3).max(255),
  fechaEntrada: z.coerce.date({ message: 'La fecha de entrada es obligatoria' }),
  fechaSalida: z.date().optional().nullable(),
  total: z.number().nonnegative().optional(),
  observaciones: z.string().max(500).optional().nullable(),
  motoId: z.number().int().positive(),
  estadoId: z.number().int().positive().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export default enReparacionSchema;
