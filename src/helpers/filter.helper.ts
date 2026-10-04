import * as z from "zod";
import type { ReposSortByOptions } from "../api/github/github.client";

const sortByOptions: ReposSortByOptions[] = ["created", "updated", "pushed", "full_name"];

// Unified schema definition export
export const filterSchema = z.object({
  minStars: z.coerce.number().min(0, 'Min stars must be 0 or greater'),
  language: z.string(),
  sortBy: z.enum(sortByOptions),
});

export type FilterValues = z.infer<typeof filterSchema>;