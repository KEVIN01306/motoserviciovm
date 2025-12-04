import z from "zod";


export const opcionesServicioSchema = z.object({
    id: z.number().optional(),
    opcion: z.string().min(1, "El nombre es obligatorio"),
    descripcion: z.string().optional(),
    estadoId: z.number().optional(),
});