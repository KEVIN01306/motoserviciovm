import z from "zod";

export const marcaSchema = z.object({
    id:             z.string().optional(),
    marca:          z.string().min(3).max(50),
    estadoId:       z.number().int(),
})