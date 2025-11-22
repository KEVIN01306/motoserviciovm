import z from "zod";

export const lineaSchema = z.object({
    id:             z.string().optional(),
    linea:          z.string().min(3).max(50),
    estadoId:       z.number().int(),
    createdAt:      z.date().optional(),
    updatedAt:      z.date().optional(),
})