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
		day: "numeric",
		// Dates are calendar days, not instants: don't let the viewer's
		// timezone shift them.
		timeZone: "UTC",
	});
}

/** ~230 words per minute for considered, technical reading. */
export function readingMinutes(body?: string): number {
	const words = (body ?? "").split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 230));
}

export interface EntryProps {
	href: string;
	title: string;
	description?: string;
	date: string;
	tags?: string[];
	/** Minutes to read; blog posts only. */
	readingTime?: number;
	/** Secondary links shown under the entry (projects: code, demo). */
	links?: { label: string; href: string }[];
}

/** Table-of-contents entry for a blog post or a project. */
export function toEntry(
	entry: CollectionEntry<"blog"> | CollectionEntry<"projects">,
): EntryProps {
	const base: EntryProps = {
		href: `/${entry.collection}/${entry.id}`,
		title: entry.data.title,
		description: entry.data.description,
		date: entry.data.date,
		tags: entry.data.tags,
	};

	if (entry.collection === "blog") {
		return { ...base, readingTime: readingMinutes(entry.body) };
	}

	const links = [
		entry.data.github && { label: "Code", href: entry.data.github },
		entry.data.demo && { label: "Demo", href: entry.data.demo },
	].filter((link): link is { label: string; href: string } => Boolean(link));
	return { ...base, links };
}
