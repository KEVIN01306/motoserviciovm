import z from "zod";

export const userSchema = z.object({
    id:                 z.string().optional(),
    primerNombre:       z.string(),
    segundoNombre:      z.string().optional(),
    primerApellido:     z.string(),
    segundoApellido:    z.string().optional(),
    fechaNac:           z.coerce.date(),
    dpi:                z.string().optional(),
    nit:                z.string().optional(),      
    tipo:               z.string().optional(),
    activo:             z.boolean().default(false),
    numeroTel:          z.string().min(8).max(8),
    numeroAuxTel :      z.string().optional(),
    email:              z.email().optional(),
    password:           z.string().optional(),
    roles:              z.array(z.number().int()).optional(),
    sucursales:         z.array(z.number().int()).optional(),
})