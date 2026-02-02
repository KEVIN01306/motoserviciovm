import z from "zod";

export const contactoSchema = z.object({
    id: z.number().optional(),
    direccion: z.string().optional().nullable(),
    telefono: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    textoWhatsapp: z.string().optional().nullable(),
    telefonoWhatsapp: z.string().optional().nullable(),
});
