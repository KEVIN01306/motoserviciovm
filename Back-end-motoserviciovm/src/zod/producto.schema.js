import z from "zod";


export const productoSchema = z.object({
    id: z.number().optional(),
    nombre: z.string().min(1, "El nombre del producto es obligatorio"),
    descripcion: z.string().optional(),
    precio: z.number().min(0, "El precio debe ser un número positivo"),
    imagen: z.string().optional(),
    cantidad: z.number().int().min(0, "La cantidad debe ser un número entero no negativo"),
    categoriaId: z.number().optional(),
    estadoId: z.number().optional(),
});