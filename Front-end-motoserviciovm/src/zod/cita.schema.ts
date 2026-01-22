import z from 'zod';

export const citaSchema = z.object({
  descripcion: z.string().optional().nullable(),
  fechaCita: z.string().min(1, 'Fecha requerida'),
  horaCita: z.string().min(1, 'Hora requerida'),
  nombreContacto: z.string().min(1, 'Nombre contacto requerido'),
  telefonoContacto: z.string().min(1, 'Teléfono requerido'),
  sucursalId: z.number().int(),
  clienteId: z.number().int().nullable().optional(),
  dpiNit: z.string(),
  tipoServicioId: z.number().int(),
  motoId: z.number().int().nullable().optional(),
  placa: z.string(),
  estadoId: z.number().int().optional(),
});

export const citaCreateSchema = citaSchema.pick({
  descripcion: true,
  fechaCita: true,
  horaCita: true,
  dpiNit: true,
  nombreContacto: true,
  telefonoContacto: true,
  sucursalId: true,
  clienteId: true,
  tipoServicioId: true,
  motoId: true,
  placa: true,
});

export default citaSchema;
