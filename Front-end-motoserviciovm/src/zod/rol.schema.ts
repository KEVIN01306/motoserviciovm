import z from "zod";

export const rolSchema = z.object({
    id:                z.string().optional(),
    rol:               z.string().min(3).max(20)          
})