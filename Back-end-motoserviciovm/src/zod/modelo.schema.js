import z from "zod";

export const modeloSchema = z.object({
    id:             z.string().optional(),
    año:            z.number().int(),
    marcaId:        z.number().int(),
    lineaId:        z.number().int(),
    cilindradaId:   z.number().int(),
    estadoId:       z.number().int(),
})