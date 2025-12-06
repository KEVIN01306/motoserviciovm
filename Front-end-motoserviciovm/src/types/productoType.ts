import { estados } from "../utils/estados";
import { productoSchema } from "../zod/producto.schema";
import z from "zod";
import type { CategoriaProductoType } from "./categoriaProductoType";

export type ProductoType = z.infer<typeof productoSchema>;

export type ProductoGetType = ProductoType & {
    categoria: CategoriaProductoType;
};

export const ProductoInitialState = {
    nombre: "",
    descripcion: "",
    precio: 0,
    imagen: "",
    cantidad: 0,
    categoriaId: undefined as number | undefined,
    estadoId: estados().activo,
};

/** Normaliza los datos recibidos desde la API para que el formulario pueda usar `reset` sin fallas
 */
export const mergeProductoDataWithDefaults = (apiData: Partial<ProductoType>): Partial<ProductoType> => {   
    return {
        nombre: apiData.nombre ?? ProductoInitialState.nombre,
        descripcion: apiData.descripcion ?? ProductoInitialState.descripcion,
        precio: apiData.precio ?? ProductoInitialState.precio,
        imagen: apiData.imagen ?? ProductoInitialState.imagen,
        cantidad: apiData.cantidad ?? ProductoInitialState.cantidad,
        categoriaId: apiData.categoriaId ?? ProductoInitialState.categoriaId,
        estadoId: apiData.estadoId ?? ProductoInitialState.estadoId,
    };
};