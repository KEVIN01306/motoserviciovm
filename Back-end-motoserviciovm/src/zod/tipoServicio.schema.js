import z from "zod";

export const tipoServicioSchema = z.object({
    id: z.number().optional(),
    tipo: z.string().min(1, "El tipo de servicio es obligatorio"),
    descripcion: z.string().optional(),
    opcionServicios: z.array(z.number()).optional(),
    servicioCompleto: z.boolean().optional(),
    estadoId: z.number().optional(),
});