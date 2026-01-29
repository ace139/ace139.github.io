import { defineCollection, type SchemaContext, z } from "astro:content";
import { glob } from "astro/loaders";

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
			// Hero image display configuration
			heroConfig: z
				.object({
					position: z
						.enum([
							"center",
							"top",
							"bottom",
							"left",
							"right",
							"top-left",
							"top-right",
							"bottom-left",
							"bottom-right",
						])
						.default("center"),
					aspectRatio: z
						.enum(["cinematic", "wide", "standard", "square"])
						.default("cinematic"),
					overlay: z
						.enum(["gradient", "dark", "light", "none"])
						.default("gradient"),
				})
				.optional(),
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
