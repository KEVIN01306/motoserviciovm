import type{ userSchema } from '../zod/user.schema'
import z from 'zod'

export type UserType = z.infer<typeof userSchema>

export const UserInitialState = {
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    email: "",
    password: "",
    roles:[],
    fechaNac: new Date().toISOString().split("T")[0],
    activo: true
    
}