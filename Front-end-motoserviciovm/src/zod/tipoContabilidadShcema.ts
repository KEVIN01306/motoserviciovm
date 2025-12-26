import z from "zod";


const tipoContabilidadSchema = z.object({
    id: z.number().optional(),
    tipo: z.string().min(1, 'El tipo de contabilidad es obligatorio').max(100, 'El tipo de contabilidad no puede exceder 100 caracteres'),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export { tipoContabilidadSchema };

export type TipoContabilidadType = z.infer<typeof tipoContabilidadSchema>;