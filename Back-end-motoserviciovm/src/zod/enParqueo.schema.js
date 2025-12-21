import z from "zod";

export const enParqueoSchema = z.object({
    id: z.number().int().positive().optional(),
    descripcion: z.string().min(3, { message: "La descripción debe tener al menos 3 caracteres" }).max(255, { message: "La descripción no puede exceder los 255 caracteres" }),
    fechaEntrada: z.coerce.date({ required_error: "La fecha de entrada es obligatoria", invalid_type_error: "La fecha de entrada debe ser una fecha válida" }),
    fechaSalida: z.date({ invalid_type_error: "La fecha de salida debe ser una fecha válida" }).optional().nullable(),
    total: z.number().nonnegative({ message: "El total no puede ser negativo" }).optional(),
    observaciones: z.string().max(500, { message: "Las observaciones no pueden exceder los 500 caracteres" }).optional().nullable(),
    motoId: z.number().int().positive({ message: "El ID de la moto debe ser un número positivo" }),
    estadoId: z.number().int().positive().optional(),
}); 