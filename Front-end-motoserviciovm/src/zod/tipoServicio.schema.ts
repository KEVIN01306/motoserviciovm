import z from "zod";

export const tipoServicioSchema = z.object({
    id: z.string().optional(),
    tipo: z.string().min(1, "El tipo de servicio es obligatorio"),
    descripcion: z.string().optional(),
    opcionServicios: z.array(z.number()).optional(),
    estadoId: z.number().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});