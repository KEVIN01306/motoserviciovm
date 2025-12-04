import z from "zod";

export const opcionesServicioSchema = z.object({
    id: z.string().optional(),
    opcion: z.string().min(1, "El nombre es obligatorio"),
    descripcion: z.string().optional(),
    estadoId: z.number().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});