import type z from "zod";
import { estados } from "../utils/estados";
import enReparacionSchema from "../zod/enReparacion.schema";
import type { EstadoType } from "./estadoType";
import type { motoGetType } from "./motoType";
import type { repuestoReparacionType } from "./repuestoReparacionType";


export type EnReparacionType = z.infer<typeof enReparacionSchema>;

export type EnReparacionGetType = EnReparacionType & {
    moto: motoGetType;
    estado: EstadoType;
    repuestos: repuestoReparacionType[];
};

export const EnReparacionInitialState: EnReparacionType = {
    descripcion:  "",
    fechaEntrada: new Date(),
    fechaSalida:  null,
    total:        0,
    observaciones: null,
    motoId:       0,
    estadoId:     estados().activo,
};

/** Normaliza los datos recibidos desde la API para que el formulario pueda usar `reset` sin fallas
 */
export const mergeEnReparacionDataWithDefaults = (apiData: Partial<EnReparacionType>): Partial<EnReparacionType> => {
    return {
        descripcion:  apiData.descripcion ?? EnReparacionInitialState.descripcion,
        fechaEntrada: apiData.fechaEntrada ?? EnReparacionInitialState.fechaEntrada,
        fechaSalida:  apiData.fechaSalida ?? EnReparacionInitialState.fechaSalida,
        total:        apiData.total ?? EnReparacionInitialState.total,
        observaciones: apiData.observaciones ?? EnReparacionInitialState.observaciones,
        motoId:       apiData.motoId ?? EnReparacionInitialState.motoId,
        estadoId:     apiData.estadoId ?? EnReparacionInitialState.estadoId,
    };
}

