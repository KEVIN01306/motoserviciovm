import z from "zod";

export const ventaProductoSchema = z.object({
    id: z.number().optional(),
    ventaId: z.number(),
    productoId: z.number(),
    cantidad: z.number(),
    descuento: z.boolean(),
    totalProducto: z.number(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});