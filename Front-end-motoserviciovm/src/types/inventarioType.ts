import { estados } from "../utils/estados";
import { inventarioSchema } from "../zod/inventario.schema";
import z from "zod";

export type InventarioType = z.infer<typeof inventarioSchema>;

export const InventarioInitialState = {
    item: "",
    descripcion: "",
    activo: true,
    estadoId: estados().activo,
};

/** Normaliza los datos recibidos desde la API para que el formulario pueda usar `reset` sin fallas
 */
export const mergeInventarioDataWithDefaults = (apiData: Partial<InventarioType>): Partial<InventarioType> => {
    return {
        item: apiData.item ?? InventarioInitialState.item,
        descripcion: apiData.descripcion ?? InventarioInitialState.descripcion,
        activo: apiData.activo ?? InventarioInitialState.activo,
        estadoId: apiData.estadoId ?? InventarioInitialState.estadoId,
    };
}