import { tipoServicioSchema } from "../zod/tipoServicio.schema";
import z from "zod";
import type { OpcionServicioType } from "./opcionServicioType";

export type TipoServicioType = z.infer<typeof tipoServicioSchema>;

export type TipoServicioGetType = Omit<TipoServicioType,  'opcionServicios'> & {
    opcionServicios: OpcionServicioType[];
}

export const TipoServicioInitialState = {
    tipo: "",
    descripcion: "",
    opcionServicios: [],
    servicioCompleto: false,
    estadoId: 1,
};

/** Normaliza los datos recibidos desde la API para que el formulario pueda usar `reset` sin fallas
 */
export const mergeTipoServicioDataWithDefaults = (apiData: Partial<TipoServicioGetType>): Partial<TipoServicioType> => {
    return {
        tipo: apiData.tipo ?? TipoServicioInitialState.tipo,
        descripcion: apiData.descripcion ?? TipoServicioInitialState.descripcion,
        opcionServicios: (apiData.opcionServicios || [] ).
            map((opcion: OpcionServicioType) => (opcion.id !== undefined ? Number(opcion.id) : undefined))
            .filter((id): id is number => typeof id === 'number' && !Number.isNaN(id)),
        estadoId: apiData.estadoId ?? TipoServicioInitialState.estadoId,
        servicioCompleto: apiData.servicioCompleto ?? TipoServicioInitialState.servicioCompleto,
    };
}