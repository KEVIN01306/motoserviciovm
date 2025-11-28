import z from "zod";

export const aiSourceSchema = z.object({
  uri: z.string().url().optional(),
  title: z.string().optional(),
});

export const aiDiagnosticDataSchema = z.object({
  diagnosis: z.string(),
  sources: z.array(aiSourceSchema).optional(),
});

export const aiResponseSchema = z.object({
  status: z.string(),
  message: z.string().optional(),
  data: aiDiagnosticDataSchema.optional(),
  count: z.number().optional(),
});

export type AiDiagnosticDataSchema = z.infer<typeof aiDiagnosticDataSchema>;
export type AiResponseSchema = z.infer<typeof aiResponseSchema>;
