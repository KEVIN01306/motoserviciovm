import z from "zod";

export const userSchema = z.object({
  id: z.string().optional(),
  primerNombre: z.string(),
  segundoNombre: z.string().optional(),
  primerApellido: z.string(),
  segundoApellido: z.string().optional(),
  fechaNac: z.preprocess(
  (arg) => (arg === "" || arg === null ? undefined : arg),
    z.coerce.date().optional()
  ),
  dpi: z.string().optional().nullable(),
  nit: z.string().optional().nullable(),
  tipo: z.string().optional(),
  activo: z.boolean().default(true),
  numeroTel: z.string().min(8).max(8),
  numeroAuxTel: z.string().optional(),
  email: z
  .string()
  .email("Correo inválido")
  .optional() 
  .nullable()
  .or(z.literal("")),
  password: z.string().optional(),
  estadoId: z.number(),
  roles: z.array(z.number().int()).optional(),
  sucursales: z.array(z.number().int()).optional(),
  motos: z.array(z.number().int()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
