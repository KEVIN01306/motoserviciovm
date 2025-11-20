import z from "zod";

export const estadoSchema = z.object({
    id:             z.string().optional(),
    estado:         z.string().min(3).max(50).unique(),
})