import type z from "zod";
import { estados } from "../utils/estados";
import enReparacionSchema from "../zod/enReparacion.schema";
import type { EstadoType } from "./estadoType";
import type { repuestoReparacionType } from "./repuestoReparacionType";
import type { ServicioGetType } from "./servicioType";


export type EnReparacionType = z.infer<typeof enReparacionSchema> ;

export type EnReparacionGetType = EnReparacionType & {
    servicio: ServicioGetType;
    estado: EstadoType;
    repuestos: repuestoReparacionType[];
};

export const EnReparacionInitialState: EnReparacionType = {
    descripcion:  "",
    fechaEntrada: new Date(),
    total:        0,
    observaciones: null,
    servicioId:       0,
    estadoId:     estados().activo,
    firmaSalida: null
};

/** Normaliza los datos recibidos desde a API para que el formulario pueda usar `reset` sin fallas
 */
export const mergeEnReparacionDataWithDefaults = (apiData: Partial<EnReparacionType>): Partial<EnReparacionType> => {
    return {
        descripcion:  apiData.descripcion ?? EnReparacionInitialState.descripcion,
        fechaEntrada: apiData.fechaEntrada ?? EnReparacionInitialState.fechaEntrada,
        total:        apiData.total ?? EnReparacionInitialState.total,
        observaciones: apiData.observaciones ?? EnReparacionInitialState.observaciones,
        servicioId:       apiData.servicioId ?? EnReparacionInitialState.servicioId,
        estadoId:     apiData.estadoId ?? EnReparacionInitialState.estadoId,
        firmaSalida:  apiData.firmaSalida ?? EnReparacionInitialState.firmaSalida, // Incluir firmaSalida
    };
}

/** Prepara los datos para el envío al backend, incluyendo solo los campos necesarios
 */
export const mergeEnReparacionDataForSubmission = (formData: Partial<EnReparacionType>): Partial<EnReparacionType> => {
    return {
        total: formData.total ?? EnReparacionInitialState.total,       
        observaciones: formData.observaciones,
        firmaSalida: formData.firmaSalida, // Incluir firmaSalida para el envío
    };
};

