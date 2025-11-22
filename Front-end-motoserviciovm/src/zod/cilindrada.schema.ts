import z from "zod";

export const cilindradaSchema = z.object({
    id:             z.string().optional(),
    cilindrada:     z.number().int(),
    estadoId:       z.number().int(), 
    createdAt:      z.date().optional(),
    updatedAt:      z.date().optional(),
})