import z from "zod";
import { enParqueoSchema } from "../zod/enParqueo.schema";
import { estados } from "../utils/estados";
import type { EstadoType } from "./estadoType";
import type { ServicioGetType } from "./servicioType";

export type EnParqueoType = z.infer<typeof enParqueoSchema>;

export type EnParqueoGetType = EnParqueoType & {
    servicio: ServicioGetType;
    estado: EstadoType;
}

export const EnParqueoInitialState = {
    descripcion: "",
    fechaEntrada: new Date(),
    fechaSalida: null as Date | null,
    total: 0,
    observaciones: "",
    servicioId: undefined as number | undefined,
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
        servicioId: apiData.servicioId ?? EnParqueoInitialState.servicioId,
        estadoId: apiData.estadoId ?? EnParqueoInitialState.estadoId,
    };
}