import { userSchema } from '../zod/user.schema';
import z from 'zod';
import type { RolType } from './rolType';

export type UserType = z.infer<typeof userSchema>;

export type UserGetType = Omit<UserType, 'roles'> & {
  roles: RolType[];
};


export const UserInitialState = {
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    email: "",
    password: "",
    dpi: "",
    nit: "",
    tipo: "",
    numeroTel: "",
    numeroAuxTel: "",
    roles:[],
    fechaNac: new Date(),
    activo: true
}

/**
 * Mezcla datos de API con valores por defecto.
 * Si un campo es null, undefined, usa el valor de UserInitialState
 */
export const mergeUserDataWithDefaults = (apiData: Partial<UserGetType>): Partial<UserType> => {
    return {
        primerNombre: apiData.primerNombre ?? UserInitialState.primerNombre,
        segundoNombre: apiData.segundoNombre ?? UserInitialState.segundoNombre,
        primerApellido: apiData.primerApellido ?? UserInitialState.primerApellido,
        segundoApellido: apiData.segundoApellido ?? UserInitialState.segundoApellido,
        email: apiData.email ?? UserInitialState.email,
        password: apiData.password ?? UserInitialState.password,
        dpi: apiData.dpi ?? UserInitialState.dpi,
        nit: apiData.nit ?? UserInitialState.nit,
        tipo: apiData.tipo ?? UserInitialState.tipo,
        numeroTel: apiData.numeroTel ?? UserInitialState.numeroTel,
        numeroAuxTel: apiData.numeroAuxTel ?? UserInitialState.numeroAuxTel,
        fechaNac: apiData.fechaNac ? new Date(apiData.fechaNac) : UserInitialState.fechaNac,
        activo: apiData.activo ?? UserInitialState.activo,
        roles: (apiData.roles || [])
            .map((role: RolType) => (role.id !== undefined ? Number(role.id) : undefined))
            .filter((id): id is number => typeof id === 'number' && !Number.isNaN(id)),
    };
};