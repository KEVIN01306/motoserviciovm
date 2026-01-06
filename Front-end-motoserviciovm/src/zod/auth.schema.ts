import z from "zod";

export const authSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
})


export const authClienteSchema = z.object({
  identifier: z.string().min(6, 'DPI/NIT requerido'),
  placa: z.string().min(5, 'Placa requerida'),
  userType: z.enum(['USUARIO REGULAR', 'EMPRESA']),
});