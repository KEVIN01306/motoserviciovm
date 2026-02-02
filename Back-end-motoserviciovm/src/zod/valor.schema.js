import z from "zod";

export const valorSchema = z.object({
    id: z.number().optional(),
    title: z.string().max(255).optional().nullable(),
    desc: z.string().optional().nullable(),
    icon: z.string().max(255).optional().nullable(),
    color: z.string().max(50).optional().nullable(),
});
