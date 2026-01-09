import { categoriaProductoSchema } from "../zod/categoriaProducto.schema";
import z from "zod";
import type { ProductoType } from "./productoType";

export type CategoriaProductoType = z.infer<typeof categoriaProductoSchema> & {
    productos: ProductoType[];
};

export const CategoriaProductoInitialState = {
    categoria: "",
    estadoId: 1,
};

export const mergeCategoriaProductoDataWithDefaults = (apiData: Partial<CategoriaProductoType>): Partial<CategoriaProductoType> => {
    return {
        categoria: apiData.categoria ?? CategoriaProductoInitialState.categoria,
        estadoId: apiData.estadoId ?? CategoriaProductoInitialState.estadoId,
    };
}