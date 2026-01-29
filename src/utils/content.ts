/**
 * Content collection utilities for filtering and sorting
 */

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
