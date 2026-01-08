import z from "zod";

export const enParqueoSchema = z.object({
    id: z.number().int().positive().optional(),
    descripcion: z.string().min(3, { message: "La descripción debe tener al menos 3 caracteres" }).max(255, { message: "La descripción no puede exceder los 255 caracteres" }),
    fechaEntrada: z.coerce.date({ message: "La fecha de entrada es obligatoria" }),
    fechaSalida: z.date({ message: "La fecha de salida debe ser una fecha válida" }).optional().nullable(),
    total: z.preprocess(
        (val) => {
            if (val === "" || val === null || val === undefined) return undefined;
            // Allow strings that contain numbers (from inputs) and coerce to Number
            return Number(val);
        },
        z.number().nonnegative({ message: "El total no puede ser negativo" }).optional()
    ),
    observaciones: z.string().max(500, { message: "Las observaciones no pueden exceder los 500 caracteres" }).optional().nullable(),
    servicioId: z.number().int().positive({ message: "El ID del servicio debe ser un número positivo" }),
    estadoId: z.number().int().positive().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});