import z from "zod";
import { enParqueoSchema } from "../zod/enParqueo.schema";
import { estados } from "../utils/estados";
import type { EstadoType } from "./estadoType";
import type { ServicioGetType } from "./servicioType";

export type EnParqueoType = z.infer<typeof enParqueoSchema>;

export type EnParqueoGetType = EnParqueoType & {
    id: number;
    servicio: ServicioGetType;
    estado: EstadoType;
    fechaSalida: Date | null;
}

export const EnParqueoInitialState = {
    descripcion: "",
    fechaEntrada: new Date(),
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
        total: apiData.total ?? EnParqueoInitialState.total,
        observaciones: apiData.observaciones ?? EnParqueoInitialState.observaciones,
        servicioId: apiData.servicioId ?? EnParqueoInitialState.servicioId,
        estadoId: apiData.estadoId ?? EnParqueoInitialState.estadoId,
    };
}

/** Prepara los datos para el envío al backend, incluyendo solo los campos necesarios */
export const mergeEnParqueoDataForSubmission = (formData: Partial<EnParqueoType>): Partial<EnParqueoType> => {
    return {
        total: formData.total ?? 0, // Valor inicial por defecto
        observaciones: formData.observaciones,
        firmaSalida: formData.firmaSalida, // Incluir firmaSalida para el envío
    };
};