import type{ rolSchema } from '../zod/rol.schema'
import z from 'zod'

export type RolType = z.infer<typeof rolSchema>