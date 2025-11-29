import { defineCollection, z, type SchemaContext } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }: SchemaContext) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      date: z.string(),
      heroImage: image().optional(),
      tags: z.array(z.string()).optional(),
      description: z.string().optional(),
    }),
});

const projects = defineCollection({
  type: 'content',
  schema: ({ image }: SchemaContext) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.string(),
      heroImage: image().optional(),
      tags: z.array(z.string()).optional(),
      github: z.string().url().optional(),
      demo: z.string().url().optional(),
    }),
});

export const collections = { blog, projects };
