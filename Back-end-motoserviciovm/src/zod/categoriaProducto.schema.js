import z from "zod";

export const categoriaProductoSchema = z.object({
    id: z.number().optional(),
    categoria: z.string().min(1, "El nombre de la categoría es obligatorio"),
    estadoId: z.number().optional(),
    productos: z.array(z.number()).optional(),
});