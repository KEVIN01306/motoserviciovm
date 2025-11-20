import z from "zod";

export const motoSchema = z.object({
    id:             z.string().optional(),
    placa:          z.string().min(3).max(50),
    avatar:         z.string().optional(),
    modeloId:       z.number().int(),
    estadoId:       z.number().int(),
})