import z from "zod";

export const categoriaProductoSchema = z.object({
    id: z.string().optional(),
    categoria: z.string().min(1, "El nombre de la categoría es obligatorio"),
    estadoId: z.number().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});