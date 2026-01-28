import repuestoReparacionSchema from "../zod/repuestosReparacion.schema";
import z from "zod";
import { estados } from "../utils/estados";

export type repuestoReparacionType = z.infer<typeof repuestoReparacionSchema>;

export const repuestoReparacionInitialState: repuestoReparacionType = {
    nombre:     "",
    descripcion: "",
    refencia:    null,
    cantidad:    0,
    checked:     false,
    estadoId:    estados().activo,
    reparacionId: undefined,
};

/** Normaliza los datos recibidos desde la API para que el formulario pueda usar `reset` sin fallas
 */
export const mergeRepuestoReparacionDataWithDefaults = (apiData: Partial<repuestoReparacionType>): Partial<repuestoReparacionType> => {
    return {
        nombre:      apiData.nombre ?? repuestoReparacionInitialState.nombre,
        descripcion: apiData.descripcion ?? repuestoReparacionInitialState.descripcion,
        refencia:    apiData.refencia ?? repuestoReparacionInitialState.refencia,
        cantidad:    apiData.cantidad ?? repuestoReparacionInitialState.cantidad,
        checked:     apiData.checked ?? repuestoReparacionInitialState.checked,
        estadoId:    apiData.estadoId ?? repuestoReparacionInitialState.estadoId,
        reparacionId: apiData.reparacionId ?? repuestoReparacionInitialState.reparacionId,
    };
}