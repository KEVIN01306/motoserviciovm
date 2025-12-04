import { estados } from "../utils/estados";
import { opcionesServicioSchema } from "../zod/opcionServicio.shema";
import z from "zod";


export type OpcionServicioType = z.infer<typeof opcionesServicioSchema>;

export const OpcionServicioInitialState = {
    opcion: '',
    descripcion: '',
    estadoId: estados().activo,
};

export const mergeOpcionServicioDataWithDefaults = (apiData: Partial<OpcionServicioType>): Partial<OpcionServicioType> => {
    return {
        opcion: apiData.opcion ?? OpcionServicioInitialState.opcion,
        descripcion: apiData.descripcion ?? OpcionServicioInitialState.descripcion,
        estadoId: apiData.estadoId ?? OpcionServicioInitialState.estadoId,
    };
}