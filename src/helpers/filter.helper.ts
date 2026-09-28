import * as z from "zod";


// Unified schema definition export
export const filterSchema = z.object({
  minStars: z.coerce.number().min(0, 'Min stars must be 0 or greater'),
  language: z.string(),
  sortBy: z.enum(['stars', 'forks', 'updated']),
});

export type FilterValues = z.infer<typeof filterSchema>;