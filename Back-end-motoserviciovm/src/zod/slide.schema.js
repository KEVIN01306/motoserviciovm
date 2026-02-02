import z from "zod";

export const slideSchema = z.object({
    id: z.number().optional(),
    image: z.string().optional(),
    tag: z.string().optional(),
    promo: z.string().optional(),
    subtitle: z.string().optional(),
});
