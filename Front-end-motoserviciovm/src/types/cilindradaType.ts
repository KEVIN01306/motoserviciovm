import z from "zod";
import type { cilindradaSchema } from "../zod/cilindrada.schema";

export type cilindradaType = z.infer<typeof cilindradaSchema>