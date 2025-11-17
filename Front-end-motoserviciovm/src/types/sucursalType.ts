import z from 'zod'
import type { sucursalSchema } from '../zod/sucursal.schema'

export type SucursalType = z.infer<typeof sucursalSchema>

export const SucursalInitialState = {
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
}
