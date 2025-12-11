import z from "zod";

export const ventaSchema = z.object({
    id: z.number().optional(),
    usuarioId: z.number(),
    servicioId: z.number().optional(),
    total: z.number(),
    productos: z.array(z.number()),
    estadoId: z.number().optional(),
});
