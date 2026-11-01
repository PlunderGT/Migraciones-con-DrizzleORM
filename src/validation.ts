import { z } from "zod";

export const bookCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().min(1).max(120),
  isbn: z.string().trim().min(10).max(20).optional(),
  year: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
  genre: z.string().trim().min(1).max(60).optional(),
  available: z.boolean().optional(),
});

export const bookUpdateSchema = bookCreateSchema
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: "Envía al menos un campo",
  });

export const idSchema = z.coerce.number().int().positive();
