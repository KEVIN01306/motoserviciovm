import z from "zod";

export const rolSchema = z.object({
    id:                z.string().optional(),
    rol:               z.string().min(3).max(20),
    descripcion:       z.string().min(5).max(100).optional(),
    permisos:          z.array(z.number().int()).optional(),
})