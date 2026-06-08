/**
 * Generates a Markdown representation of every built HTML page so that the
 * Cloudflare Pages middleware (functions/_middleware.js) can serve it when an
 * agent requests `Accept: text/markdown`.
 *
 * For each `dist/**​/*.html` we extract the page's <main> content, strip
 * non-content noise, convert it to Markdown, and write a sibling `<file>.html.md`.
 * A small YAML frontmatter block (title/description/url) is prepended so the
 * output is self-describing for agents.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { parse } from "node-html-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "../dist");

// Elements that never carry meaningful reading content for an agent.
// `.hero-content-mobile` duplicates the desktop hero (title/date/subtitle) that
// BlogHeader.astro also renders in `.hero-content-overlay`, so drop the copy.
const STRIP_SELECTORS = [
	"script",
	"style",
	"noscript",
	"svg",
	"button",
	".hero-content-mobile",
];

/** Recursively collect every .html file under a directory. */
function collectHtmlFiles(dir) {
	const out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			out.push(...collectHtmlFiles(full));
		} else if (entry.isFile() && entry.name.endsWith(".html")) {
			out.push(full);
		}
	}
	return out;
}

/** Read a meta/link attribute value, returning an empty string when absent. */
function attr(root, selector, name) {
	const el = root.querySelector(selector);
	return el?.getAttribute(name)?.trim() ?? "";
}

/** Escape a value for safe inclusion in a single-line YAML string. */
function yaml(value) {
	return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function htmlToMarkdown(html) {
	const root = parse(html, { comment: false });

	const title =
		root.querySelector("title")?.text?.trim() ||
		attr(root, 'meta[property="og:title"]', "content");
	const description =
		attr(root, 'meta[name="description"]', "content") ||
		attr(root, 'meta[property="og:description"]', "content");
	const url =
		attr(root, 'link[rel="canonical"]', "href") ||
		attr(root, 'meta[property="og:url"]', "content");

	const main = root.querySelector("main") ?? root.querySelector("body");
	if (!main) {
		return null;
	}

	for (const selector of STRIP_SELECTORS) {
		for (const el of main.querySelectorAll(selector)) {
			el.remove();
		}
	}

	const body = NodeHtmlMarkdown.translate(main.innerHTML).trim();
	if (!body) {
		return null;
	}

	const frontmatter = ["---"];
	if (title) {
		frontmatter.push(`title: ${yaml(title)}`);
	}
	if (description) {
		frontmatter.push(`description: ${yaml(description)}`);
	}
	if (url) {
		frontmatter.push(`url: ${yaml(url)}`);
	}
	frontmatter.push("---", "");

	return `${frontmatter.join("\n")}\n${body}\n`;
}

if (!fs.existsSync(distDir)) {
	console.error("[markdown] dist/ not found — run the build first");
	process.exit(1);
}

let written = 0;
for (const htmlFile of collectHtmlFiles(distDir)) {
	const markdown = htmlToMarkdown(fs.readFileSync(htmlFile, "utf8"));
	if (!markdown) {
		continue;
	}
	fs.writeFileSync(`${htmlFile}.md`, markdown);
	written++;
}

console.log(
	`Generated ${written} Markdown page(s) for agent content negotiation`,
);
