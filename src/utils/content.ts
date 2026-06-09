/**
 * Content collection utilities for filtering and sorting
 */

import type { CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";
import type { HeroConfig } from "./hero-config";

/**
 * Filter function for published (non-draft) content
 */
export const isPublished = <T extends { data: { draft?: boolean } }>({
	data,
}: T): boolean => data.draft !== true;

/**
 * Sort comparator for content by date (newest first)
 */
export const sortByDateDesc = <T extends { data: { date: string } }>(
	a: T,
	b: T,
): number => new Date(b.data.date).getTime() - new Date(a.data.date).getTime();

export function formatCardDate(
	date: string,
	style: "short" | "long" = "short",
): string {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: style === "short" ? "short" : "long",
		day: style === "long" ? "numeric" : undefined,
	});
}

export function formatCardMeta(
	kind: "project" | "blog",
	date?: string,
): string | undefined {
	const parts: string[] = [];
	if (kind === "project") {
		parts.push("Project");
	}
	if (date) {
		parts.push(formatCardDate(date, "short"));
	}
	return parts.length > 0 ? parts.join(" · ") : undefined;
}

export interface BentoItem {
	href: string;
	title: string;
	description?: string;
	subtitle?: string;
	date?: string;
	tags?: string[];
	heroImage?: ImageMetadata;
	heroConfig?: HeroConfig;
	kind: "project" | "blog";
}

export function toBentoItem(
	entry: CollectionEntry<"blog"> | CollectionEntry<"projects">,
): BentoItem {
	const kind = entry.collection === "projects" ? "project" : "blog";
	const base: BentoItem = {
		href: `/${entry.collection}/${entry.id}`,
		title: entry.data.title,
		description: entry.data.description,
		date: entry.data.date,
		tags: entry.data.tags,
		heroImage: entry.data.heroImage,
		kind,
	};

	if (entry.collection === "blog") {
		return {
			...base,
			subtitle: entry.data.subtitle,
			heroConfig: entry.data.heroConfig,
		};
	}

	return base;
}

export interface StackedProjectProps {
	href: string;
	title: string;
	description: string;
	date: string;
	tags?: string[];
	heroImage?: ImageMetadata;
	github?: string;
	demo?: string;
}

export function toStackedProjectProps(
	entry: CollectionEntry<"projects">,
): StackedProjectProps {
	return {
		href: `/projects/${entry.id}`,
		title: entry.data.title,
		description: entry.data.description,
		date: entry.data.date,
		tags: entry.data.tags,
		heroImage: entry.data.heroImage,
		github: entry.data.github,
		demo: entry.data.demo,
	};
}
