import type{ rolSchema } from '../zod/rol.schema'
import z from 'zod'
import type { PermisoType } from './permisoType'
import { estados } from '../utils/estados'

export type RolType = z.infer<typeof rolSchema>

export type RolGetType = Omit<RolType, 'permisos'> & {  
    permisos: PermisoType[];
}

export const RolInitialState = {
    rol: "",
    descripcion: "",
    permisos: [],
    estadoId: estados().activo
}

/**
 * Asegura que RolType tenga valores por defecto para campos null/undefined
 */
export const mergeRolDataWithDefaults = (apiData: Partial<RolGetType>): Partial<RolType> => {
    return {
        rol: apiData.rol ?? RolInitialState.rol,
        descripcion: apiData.descripcion ?? RolInitialState.descripcion,
        permisos: (apiData.permisos || [])
            .map((permiso: PermisoType) => (permiso.id !== undefined ? Number(permiso.id) : undefined))
            .filter((id): id is number => typeof id === 'number' && !Number.isNaN(id)),
        estadoId: apiData.estadoId ?? RolInitialState.estadoId
    };
};