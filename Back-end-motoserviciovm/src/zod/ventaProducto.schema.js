import z from "zod";

export const ventaProductoSchema = z.object({
    id: z.number().optional(),
    ventaId: z.number(),
    productoId: z.number(),
    cantidad: z.number(),
    totalProducto: z.number(),
});
