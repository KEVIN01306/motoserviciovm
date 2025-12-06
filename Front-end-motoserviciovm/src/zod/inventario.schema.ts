import z from "zod";

export const inventarioSchema = z.object({
    id: z.number().optional(),
    item: z.string().min(1, "El item es obligatorio"),
    descripcion: z.string().optional(),
    activo: z.boolean().optional(),
    estadoId: z.number().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});