import z from "zod";

export const permisoSchema = z.object({
    id:                    z.string().optional(),
    permiso:               z.string().min(3).max(20),
    modulo:                z.string().min(3).max(20).optional(),
    estadoId:              z.number().int(),
})