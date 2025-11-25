import z from "zod";

export const motoSchema = z.object({
    id:             z.string().optional(),
    placa:          z.string().min(6).max(6),
    avatar:         z.string().optional(),
    modeloId:       z.number().int(),
    estadoId:       z.number().int(),
    users:          z.array(z.number().int()).optional(),
    createdAt:      z.date().optional(),
    updatedAt:      z.date().optional(),
})