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

export const servicioProductoProximoSchema = z.object({
    id: z.number().optional(),
    nombre: z.string().min(1, 'El nombre es obligatorio'),
});

export const servicioSchema = z.object({
    id: z.number().optional(),
    kilometraje: z.number(),
    kilometrajeProximoServicio: z.number().optional().nullable(),
    descripcion: z.string().min(1, 'La descripcion es obligatoria'),
    total: z.number().optional(),
    observaciones: z.string().optional(),
    proximaFechaServicio: z.coerce.date().optional().nullable(),
    descripcionProximoServicio: z.string().optional().nullable(),
    sucursalId: z.number(),
    firmaEntrada:    z.string(),
    firmaSalida:     z.string().optional(),
    motoId: z.number(),
    clienteId: z.number().optional().nullable(),
    mecanicoId: z.number(),
    tipoServicioId: z.number(),
    estadoId: z.number().optional(),
    servicioItems: z.array(servicioItemSchema).optional(),
    productosCliente: z.array(servicioProductoClienteSchema).optional(),
    imagenesMeta: z.array(imagenMetaSchema).optional(),
    proximoServicioItems: z.array(servicioProductoProximoSchema).optional(),
});
