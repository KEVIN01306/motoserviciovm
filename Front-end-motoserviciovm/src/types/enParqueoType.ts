import z from "zod";
import { enParqueoSchema } from "../zod/enParqueo.schema";
import { estados } from "../utils/estados";
import type { motoGetType } from "./motoType";
import type { EstadoType } from "./estadoType";

export type EnParqueoType = z.infer<typeof enParqueoSchema>;

export type EnParqueoGetType = EnParqueoType & {
    moto: motoGetType;
    estado: EstadoType;
}

export const EnParqueoInitialState = {
    descripcion: "",
    fechaEntrada: new Date(),
    fechaSalida: null as Date | null,
    total: 0,
    observaciones: "",
    motoId: undefined as number | undefined,
    estadoId: estados().activo,
}

/** Normaliza los datos recibidos desde la API para que el formulario pueda usar `reset` sin fallas
 */
export const mergeEnParqueoDataWithDefaults = (apiData: Partial<EnParqueoType>): Partial<EnParqueoType> => {
    return {
        descripcion: apiData.descripcion ?? EnParqueoInitialState.descripcion,
        fechaEntrada: apiData.fechaEntrada ?? EnParqueoInitialState.fechaEntrada,
        fechaSalida: apiData.fechaSalida ?? EnParqueoInitialState.fechaSalida,
        total: apiData.total ?? EnParqueoInitialState.total,
        observaciones: apiData.observaciones ?? EnParqueoInitialState.observaciones,
        motoId: apiData.motoId ?? EnParqueoInitialState.motoId,
        estadoId: apiData.estadoId ?? EnParqueoInitialState.estadoId,
    };
}