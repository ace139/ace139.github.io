import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { isPublished, sortByDateDesc } from "../utils/content";

export async function GET(context: APIContext) {
	const posts = (await getCollection("blog", isPublished)).sort(sortByDateDesc);

	return rss({
		title: "Soumyo Dey: writing",
		description:
			"Essays on AI, data, systems, and product, from someone who ships them.",
		site: context.site ?? "https://soumyo.com",
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description ?? post.data.subtitle,
			pubDate: new Date(post.data.date),
			link: `/blog/${post.id}/`,
			categories: post.data.tags,
		})),
		customData: "<language>en-us</language>",
	});
}
