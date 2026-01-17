import z from "zod";

export const citaSchema = z.object({
  id: z.number().optional(),
  descripcion: z.string().min(1, "descripcion es obligatoria").max(500),
  fechaCita: z
    .union([z.string(), z.date()])
    .transform((v) => (typeof v === "string" ? new Date(v) : v)),
  horaCita: z.string().min(1, "horaCita es obligatoria"),
  nombreContacto: z.string().min(1, "nombreContacto es obligatorio").max(100),
  telefonoContacto: z.string().min(7, "telefonoContacto debe tener al menos 7 caracteres").max(15),
  sucursalId: z.number().int().positive("sucursalId debe ser un número positivo"),
  clienteId: z.number().int().positive().optional().nullable(),
  dpiNit: z.string().max(20).optional().nullable(),
  tipoServicioId: z.number().int().positive("tipoServicioId debe ser un número positivo"),
  motoId: z.number().int().positive().optional().nullable(),
  placa: z.string().max(20).optional().nullable(),
  estadoId: z.number().int().positive("estadoId debe ser un número positivo"),
});
