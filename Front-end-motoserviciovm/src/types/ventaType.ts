import z from "zod";
import { ventaSchema } from "../zod/venta.schema";
import { ventaProductoSchema } from "../zod/ventaProducto.schema";
import { estados } from "../utils/estados";
import type { UserGetType } from "./userType";
import type { ProductoGetType } from "./productoType";
import type { EstadoType } from "./estadoType";

export type VentaType = z.infer<typeof ventaSchema>;

export type VentaGetType = VentaType & {
    trabajador: UserGetType;
    productos: VentaProductoGetType[];
    estado: EstadoType;
};

export type VentaProductoType = z.infer<typeof ventaProductoSchema>;

export type VentaProductoGetType = VentaProductoType & {
    usuario: UserGetType;
    producto: ProductoGetType;
};

export const VentaInitialState: VentaType = {
    usuarioId: 0,
    servicioId: null,
    total: 0,
    estadoId: estados().enEspera,
};

export const VentaProductoInitialState: VentaProductoType = {
    ventaId: 0,
    productoId: 0,
    cantidad: 0,
    totalProducto: 0,
};

/** Normaliza los datos recibidos desde la API para que el formulario pueda usar `reset` sin fallas
 */
export const mergeVentaDataWithDefaults = (apiData: Partial<VentaType>): Partial<VentaType> => {
    return {
        usuarioId: apiData.usuarioId ?? VentaInitialState.usuarioId,
        servicioId: apiData.servicioId ?? VentaInitialState.servicioId,
        total: apiData.total ?? VentaInitialState.total,
        estadoId: apiData.estadoId ?? VentaInitialState.estadoId,
    };
}

/** Normaliza los datos recibidos desde la API para que el formulario pueda usar `reset` sin fallas
 */
export const mergeVentaProductoDataWithDefaults = (apiData: Partial<VentaProductoType>): Partial<VentaProductoType> => {
    return {
        ventaId: apiData.ventaId ?? VentaProductoInitialState.ventaId,
        productoId: apiData.productoId ?? VentaProductoInitialState.productoId,
        cantidad: apiData.cantidad ?? VentaProductoInitialState.cantidad,
        totalProducto: apiData.totalProducto ?? VentaProductoInitialState.totalProducto,
    };
}