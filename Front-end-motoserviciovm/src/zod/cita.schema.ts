import z from 'zod';

export const citaSchema = z.object({
  descripcion: z.string().min(0).optional(),
  fechaCita: z.string().min(1, 'Fecha requerida'),
  horaCita: z.string().min(1, 'Hora requerida'),
  nombreContacto: z.string().min(1, 'Nombre contacto requerido'),
  telefonoContacto: z.string().min(1, 'Teléfono requerido'),
  sucursalId: z.number().int().optional(),
  clienteId: z.number().int().nullable().optional(),
  dpiNit: z.string().optional(),
  tipoServicioId: z.number().int().optional(),
  motoId: z.number().int().nullable().optional(),
  placa: z.string().optional(),
  estadoId: z.number().int().optional(),
});

export const citaCreateSchema = citaSchema.pick({
  fechaCita: true,
  horaCita: true,
  nombreContacto: true,
  telefonoContacto: true,
  sucursalId: true,
  tipoServicioId: true,
  placa: true,
});

export default citaSchema;
