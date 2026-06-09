import { defineCollection, type SchemaContext, z } from "astro:content";
import { glob } from "astro/loaders";
import { heroConfigSchema } from "./utils/hero-config";

const blog = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
	schema: ({ image }: SchemaContext) =>
		z.object({
			title: z.string(),
			subtitle: z.string().optional(),
			date: z.string(),
			heroImage: image().optional(),
			tags: z.array(z.string()).optional(),
			description: z.string().optional(),
			// Draft status - when true, content is hidden from public views
			draft: z.boolean().default(false),
			heroConfig: heroConfigSchema,
		}),
});

const projects = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
	schema: ({ image }: SchemaContext) =>
		z.object({
			title: z.string(),
			description: z.string(),
			date: z.string(),
			heroImage: image().optional(),
			tags: z.array(z.string()).optional(),
			github: z.string().url().optional(),
			demo: z.string().url().optional(),
			// Draft status - when true, content is hidden from public views
			draft: z.boolean().default(false),
		}),
});

export const collections = { blog, projects };
