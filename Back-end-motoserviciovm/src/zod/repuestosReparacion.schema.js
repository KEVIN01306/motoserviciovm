import z from 'zod';

export const repuestoReparacionSchema = z.object({
  id: z.number().int().positive().optional(),
  nombre: z.string().min(1, { message: 'El nombre es requerido' }).max(100, { message: 'El nombre no puede exceder los 100 caracteres' }    ),
  descripcion: z.string().max(500).optional().nullable(),
  imagen: z.string().optional().nullable(),
  refencia: z.string().max(500).optional().nullable(),
  cantidad: z.number().int().nonnegative({ message: 'La cantidad debe ser un número no negativo' }),
  checked: z.boolean(),
  estadoId: z.number().int().positive(),
  reparacionId: z.number().int().positive().optional(),
});

export default repuestoReparacionSchema;
