import { z } from 'zod';

export const contactoSchema = z.object({
  id: z.number().optional(),
  email: z.string().min(1, 'Email es requerido').email('Email inválido'),
  direccion: z.string().min(1, 'Teléfono es requerido'),
  telefono: z.string().min(1, 'Dirección es requerida'),
  textoWhatsapp: z.string().optional().nullable(),
  telefonoWhatsapp: z.string().optional().nullable(),
});

export type ContactoSchemaType = z.infer<typeof contactoSchema>;
