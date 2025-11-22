import z from 'zod'
import type { sucursalSchema } from '../zod/sucursal.schema'
import { estados } from '../utils/estados'

export type SucursalType = z.infer<typeof sucursalSchema>

export const SucursalInitialState = {
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    estadoId: estados().activo
}

/**
 * Normaliza los datos recibidos desde la API para que el formulario pueda usar `reset` sin fallas
 */
export const mergeSucursalDataWithDefaults = (apiData: Partial<SucursalType>): Partial<SucursalType> => {
    return {
        nombre: apiData.nombre ?? SucursalInitialState.nombre,
        direccion: apiData.direccion ?? SucursalInitialState.direccion,
        telefono: apiData.telefono ?? SucursalInitialState.telefono,
        email: apiData.email ?? SucursalInitialState.email,
        estadoId: apiData.estadoId ?? SucursalInitialState.estadoId,
    }
}
