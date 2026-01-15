import z from "zod";

const horaSchema = z.object({
  horaInicio: z.string().min(1, "horaInicio es obligatorio"),
  horaFin: z.string().min(1, "horaFin es obligatorio"),
});

export const tipoServicioHorarioDiaSchema = z.object({
  diaId: z.number().int(),
  cantidadPersonal: z.number().int().min(1, "cantidadPersonal debe ser >= 1"),
  horas: z.array(horaSchema).default([]),
});

