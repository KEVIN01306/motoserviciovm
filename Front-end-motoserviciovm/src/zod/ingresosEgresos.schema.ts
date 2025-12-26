import { z } from 'zod';

const ingresosEgresosSchema = z.object({
    descripcion: z.string().min(1, 'La descripción es obligatoria').max(255, 'La descripción no puede exceder 255 caracteres'),
    monto: z.number().positive('El monto debe ser un número positivo'),
    tipoId: z.number().int('El tipo debe ser un número entero'),
    sucursalId: z.number().int('La sucursal debe ser un número entero'),
    estadoId: z.number().int('El estado debe ser un número entero'),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export { ingresosEgresosSchema };
