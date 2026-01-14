import z from "zod";

const horaSchema = z.object({
  horaInicio: z.string().min(1, "horaInicio es obligatorio"),
  horaFin: z.string().min(1, "horaFin es obligatorio"),
});

const diaConfigSchema = z.object({
  diaId: z.number().int(),
  cantidadPersonal: z.number().int().min(1, "cantidadPersonal debe ser >= 1"),
  horas: z.array(horaSchema).default([]),
});

export const tipoServicioHorarioSchema = z.object({
  id: z.number().optional(),
  sucursalId: z.number().int(),
  tipoHorarioId: z.number().int(),
  cantidadPersonal: z.number().int().min(1, "cantidadPersonal debe ser >= 1").optional(),
  fechaVijencia: z
    .union([
      z.string(),
      z.date(),
    ])
    .transform((v) => (typeof v === "string" ? new Date(v) : v))
    .optional(),
  diasConfig: z.array(diaConfigSchema).default([]),
});
