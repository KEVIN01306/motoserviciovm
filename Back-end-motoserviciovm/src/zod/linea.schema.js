import z from "zod";

export const lineaSchema = z.object({
    id:             z.string().optional(),
    linea:          z.string().min(1).max(50),
    estadoId:       z.number().int(),
})