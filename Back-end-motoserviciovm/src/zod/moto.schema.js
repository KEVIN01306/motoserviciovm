import z from "zod";

export const motoSchema = z.object({
    id:             z.string().optional(),
    placa:          z.string().min(7).max(7),
    avatar:         z.string().optional(),
    calcomania:     z.string().optional(),
    modeloId:       z.number().int(),
    estadoId:       z.number().int(),
    users:          z.array(z.number().int()).optional(),
});