import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/blog" }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    author_avatar_url: z.string(),
    date: z.date(),
    edited_at: z.date().optional(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
    permalink: z.string(),
  }),
});

export const collections = { blog };
