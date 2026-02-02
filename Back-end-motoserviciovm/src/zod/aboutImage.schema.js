import z from "zod";

export const aboutImageSchema = z.object({
    id: z.number().optional(),
    image: z.string().optional(),
});
