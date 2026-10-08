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

/**
 * Reading time in minutes: ~230 words per minute for considered, technical
 * reading.
 */
export function readingMinutes(body?: string): number {
	const words = (body ?? "").split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 230));
}

export interface IndexItem {
	href: string;
	title: string;
	/** ISO date string from the content collection. */
	date: string;
	description?: string;
	tags?: string[];
	/** Last column: reading time for essays, a kind label for projects. */
	trailing?: string;
}

/** Row for the typeset index list (`PostIndex`). */
export function toIndexItem(
	entry: CollectionEntry<"blog"> | CollectionEntry<"projects">,
): IndexItem {
	const isBlog = entry.collection === "blog";
	return {
		href: `/${entry.collection}/${entry.id}`,
		title: entry.data.title,
		date: entry.data.date,
		description: entry.data.description,
		tags: entry.data.tags,
		trailing: isBlog ? `${readingMinutes(entry.body)} min` : "Project",
	};
}
