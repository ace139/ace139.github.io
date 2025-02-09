import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional()
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    github: z.string().url().optional(),
    demo: z.string().url().optional()
  }),
});

export const collections = { blog, projects };
