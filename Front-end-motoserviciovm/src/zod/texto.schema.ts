import { z } from "zod";

export const textoSchema = z.object({
  id: z.number().optional(),
  logoTitle: z.string().optional().nullable(),
  footerText: z.string().optional().nullable(),
  textoServicio: z.string().optional().nullable(),
  textoAbout: z.string().optional().nullable(),
  textoIA: z.string().optional().nullable(),
  textoCita: z.string().optional().nullable(),
});

export type TextoSchemaType = z.infer<typeof textoSchema>;
