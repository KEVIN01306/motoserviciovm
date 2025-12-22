import z from "zod";

export const servicioItemSchema = z.object({
    inventarioId: z.number(),
    checked: z.boolean().optional(),
    itemName: z.string().optional(),
    itemDescripcion: z.string().optional(),
    notas: z.string().optional(),
});

export const servicioProductoClienteSchema = z.object({
    id: z.number().optional(),
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    cantidad: z.number(),
});

export const imagenMetaSchema = z.object({
    descripcion: z.string().optional(),
});

export const servicioSchema = z.object({
    id: z.number().optional(),
    descripcion: z.string().min(1, 'La descripcion es obligatoria'),
    fechaEntrada: z.coerce.date().optional(),
    fechaSalida: z.coerce.date().optional().nullable(),
    total: z.number().optional(),
    observaciones: z.string().optional(),
    proximaFechaServicio: z.coerce.date().optional().nullable(),
    descripcionProximoServicio: z.string().optional().nullable(),
    sucursalId: z.number(),
    motoId: z.number(),
    clienteId: z.number().optional().nullable(),
    mecanicoId: z.number(),
    tipoServicioId: z.number(),
    estadoId: z.number().optional(),
    servicioItems: z.array(servicioItemSchema).optional(),
    productosCliente: z.array(servicioProductoClienteSchema).optional(),
    imagenesMeta: z.array(imagenMetaSchema).optional(),
});
