import z from 'zod'
import type { permisoSchema } from '../zod/permiso.schema'

export type PermisoType = z.infer<typeof permisoSchema>