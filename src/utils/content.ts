/**
 * Content collection utilities for filtering and sorting
 */

import type { CollectionEntry } from "astro:content";

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

/** ~230 words per minute for considered, technical reading. */
export function readingMinutes(body = ""): number {
	const words = body.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 230));
}

export interface EntryItem {
	href: string;
	title: string;
	dek?: string;
	date: string;
	readingTime?: number;
	tags?: string[];
	links?: { label: string; href: string }[];
}

/** Map a blog post or project onto the typeset list row. */
export function toEntry(
	entry: CollectionEntry<"blog"> | CollectionEntry<"projects">,
): EntryItem {
	const base = {
		href: `/${entry.collection}/${entry.id}`,
		date: entry.data.date,
		title: entry.data.title,
		tags: entry.data.tags,
	};

	if (entry.collection === "blog") {
		return {
			...base,
			dek: entry.data.subtitle ?? entry.data.description,
			readingTime: readingMinutes(entry.body),
		};
	}

	const links = [
		entry.data.github && { label: "Code", href: entry.data.github },
		entry.data.demo && { label: "Demo", href: entry.data.demo },
	].filter((link): link is { label: string; href: string } => Boolean(link));

	return { ...base, dek: entry.data.description, links };
}
