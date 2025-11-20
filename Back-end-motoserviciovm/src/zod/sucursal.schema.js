import z from "zod";


export const sucursalSchema = z.object({
    id:             z.string().optional(),
    nombre:         z.string().min(3).max(50),
    direccion:      z.string().min(5).max(100),
    telefono:       z.string().min(7).max(15),
    email:          z.string().email().max(50),
    estadoId:       z.number().int(),
})