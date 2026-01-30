import z from "zod";
import { userSchema } from "./user.schema";

export const ventaSchema = z.object({
    id: z.number().optional(),
    usuarioId: z.number(),
    servicioId: z.number().optional().nullable(),
    reparacionId: z.number().optional().nullable(),
    total: z.number(),
    sucursalId: z.number().min(1, 'La sucursal es obligatoria'),
    usuario: userSchema.optional(),
    estadoId: z.number().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
