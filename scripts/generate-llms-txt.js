import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get blog posts
function getBlogPosts() {
	const blogDir = path.join(__dirname, "../src/content/blog");
	const posts = [];

	try {
		const files = fs.readdirSync(blogDir);

		for (const file of files) {
			// Only process .md and .mdx files
			if (!file.endsWith(".md") && !file.endsWith(".mdx")) {
				continue;
			}

			const filePath = path.join(blogDir, file);
			const content = fs.readFileSync(filePath, "utf-8");
			const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);

			if (frontmatterMatch) {
				const frontmatter = frontmatterMatch[1];

				// Skip draft posts
				const draftMatch = frontmatter.match(/draft:\s*(true|false)/);
				const isDraft = draftMatch && draftMatch[1] === "true";
				if (isDraft) {
					continue;
				}

				const titleMatch = frontmatter.match(/title:\s*(.+)/);
				const descMatch = frontmatter.match(/description:\s*(.+)/);

				if (titleMatch) {
					// Clean title and description (remove quotes if present)
					const title = titleMatch[1].trim().replace(/^["']|["']$/g, "");
					const description = descMatch
						? descMatch[1].trim().replace(/^["']|["']$/g, "")
						: "";

					// Get slug from filename (remove extension)
					const slug = file.replace(/\.(md|mdx)$/, "");

					posts.push({
						title,
						description,
						url: `/blog/${slug}`,
					});
				}
			}
		}
	} catch (_error) {
		console.error("Error reading blog posts:", _error);
	}

	return posts;
}

// Get projects
function getProjects() {
	const projectsDir = path.join(__dirname, "../src/content/projects");
	const projects = [];

	try {
		const files = fs.readdirSync(projectsDir);

		for (const file of files) {
			// Only process .md and .mdx files
			if (!file.endsWith(".md") && !file.endsWith(".mdx")) {
				continue;
			}

			const filePath = path.join(projectsDir, file);
			const content = fs.readFileSync(filePath, "utf-8");
			const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);

			if (frontmatterMatch) {
				const frontmatter = frontmatterMatch[1];

				// Skip draft projects
				const draftMatch = frontmatter.match(/draft:\s*(true|false)/);
				const isDraft = draftMatch && draftMatch[1] === "true";
				if (isDraft) {
					continue;
				}

				const titleMatch = frontmatter.match(/title:\s*(.+)/);
				const descMatch = frontmatter.match(/description:\s*(.+)/);

				if (titleMatch) {
					// Clean title and description (remove quotes if present)
					const title = titleMatch[1].trim().replace(/^["']|["']$/g, "");
					const description = descMatch
						? descMatch[1].trim().replace(/^["']|["']$/g, "")
						: "";

					// Get slug from filename (remove extension)
					const slug = file.replace(/\.(md|mdx)$/, "");

					projects.push({
						title,
						description,
						url: `/projects/${slug}`,
					});
				}
			}
		}
	} catch (_error) {
		console.error("Error reading projects:", _error);
	}

	return projects;
}

// Generate llms.txt
function generateLLMsTxt() {
	// Read site URL from astro.config.mjs
	let siteUrl = "https://ace139.github.io"; // fallback
	try {
		const configPath = path.join(__dirname, "../astro.config.mjs");
		const configContent = fs.readFileSync(configPath, "utf-8");
		const siteMatch = configContent.match(/site:\s*['"]([^'"]+)['"]/);
		if (siteMatch) {
			siteUrl = siteMatch[1];
		}
	} catch (_error) {
		console.warn(
			"Could not read site URL from astro.config.mjs, using fallback",
		);
	}

	const siteName = "Soumyo Dey";
	// Keep in sync with the default description in src/layouts/Layout.astro
	const tagline =
		"Soumyo Dey builds products across AI, data, and systems, and writes about what holds up in production.";

	const blogPosts = getBlogPosts();
	const projects = getProjects();

	let content = `# ${siteName}

> ${tagline}

## About

Soumyo Dey is a builder and systems thinker with a decade across AI, data, systems, and product. He is Founder & CEO of Oogway Labs (https://oogwaylabs.com/), an AI consulting and engineering firm. Previously he was Co-founder & CTO of Cornet Health (voice-first AI for clinicians), and earlier built the Connected Platforms and Data & AI capabilities at Ather Energy, powering 500,000+ EVs across India.

Every page on this site is also available as Markdown: send \`Accept: text/markdown\`.

## Site Structure

- [Home](${siteUrl}/)
- [Writing](${siteUrl}/blog)
- [Work](${siteUrl}/projects)
- [About](${siteUrl}/about)
- [RSS feed](${siteUrl}/rss.xml)

## Writing\n\n`;

	blogPosts.forEach((post) => {
		content += `- [${post.title}](${siteUrl}${post.url})`;
		content += post.description ? `: ${post.description}\n` : "\n";
	});

	if (projects.length > 0) {
		content += `\n## Projects\n\n`;
		for (const project of projects) {
			content += `- [${project.title}](${siteUrl}${project.url})`;
			content += project.description ? `: ${project.description}\n` : "\n";
		}
	}

	content += `\n## Newsletter

- [Stochastic Musings](https://stochasticmusings.substack.com/): notes on product intuition, engineering systems, and signals from the AI landscape.

## Contact

- Email: heysoumyo@gmail.com
- X/Twitter: https://x.com/soumyo
- LinkedIn: https://linkedin.com/in/soumyo-dey
- GitHub: https://github.com/ace139
`;

	return content;
}

// Write to public directory
const llmsTxtContent = generateLLMsTxt();
const publicDir = path.join(__dirname, "../public");
const llmsTxtPath = path.join(publicDir, "llms.txt");

try {
	fs.writeFileSync(llmsTxtPath, llmsTxtContent, "utf-8");
	console.log("✓ Generated llms.txt");
	console.log(`  Location: ${llmsTxtPath}`);
} catch (err) {
	console.error("Failed to write llms.txt:", err.message);
	process.exit(1);
}
