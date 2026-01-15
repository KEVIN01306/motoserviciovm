import z from "zod";
import { tipoServicioHorarioDiaSchema } from "./tipoServicioHorarioDia.schema";

export const tipoServicioHorarioSchema = z.object({
  sucursalId: z.number().int().min(1, "Sucursal es obligatoria"),
  tipoHorarioId: z.number().int().min(1, "Tipo de horario es obligatorio"),
  fechaVijencia: z.string().min(1, "Fecha de vigencia es obligatoria"),
  diasConfig: z.array(tipoServicioHorarioDiaSchema).default([]),
});

export const updateTipoServicioHorarioSchema = tipoServicioHorarioSchema.extend({
  id: z.number().int(),
});
