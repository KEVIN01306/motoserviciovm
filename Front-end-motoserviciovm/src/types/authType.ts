import { z } from 'zod'
import type { authClienteSchema, authSchema } from '../zod/auth.schema';
import type { UserType } from './userType';
import type { motoGetType } from './motoType';



export type AuthType = z.infer<typeof authSchema>;

export type AuthClienteType = z.infer<typeof authClienteSchema>;

export const authClienteInitialState = {
    identifier: "",
    placa: "",
    userType: 'Usuario Regular',
}


export const AuthInitialState = {
    email: "",
    password: ""
}

export type AuthResponse = {
    user: UserType,
    motos?: motoGetType[],
    token: string
}
