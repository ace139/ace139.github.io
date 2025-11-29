import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get blog posts
function getBlogPosts() {
    const blogDir = path.join(__dirname, '../src/content/blog');
    const posts = [];

    try {
        const files = fs.readdirSync(blogDir);

        for (const file of files) {
            // Only process .md and .mdx files
            if (!file.endsWith('.md') && !file.endsWith('.mdx')) {
                continue;
            }

            const filePath = path.join(blogDir, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);

            if (frontmatterMatch) {
                const frontmatter = frontmatterMatch[1];
                const titleMatch = frontmatter.match(/title:\s*(.+)/);
                const descMatch = frontmatter.match(/description:\s*(.+)/);

                if (titleMatch) {
                    // Clean title and description (remove quotes if present)
                    let title = titleMatch[1].trim().replace(/^["']|["']$/g, '');
                    let description = descMatch ? descMatch[1].trim().replace(/^["']|["']$/g, '') : '';

                    // Get slug from filename (remove extension)
                    const slug = file.replace(/\.(md|mdx)$/, '');

                    posts.push({
                        title,
                        description,
                        url: `/blog/${slug}`,
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error reading blog posts:', error);
    }

    return posts;
}

// Extract About content from about.astro
function getAboutContent() {
    const aboutPath = path.join(__dirname, '../src/pages/about.astro');
    let aboutText = "I'm a Senior Product Manager working on AI and data products."; // fallback

    try {
        const content = fs.readFileSync(aboutPath, 'utf-8');

        // Look for the first main paragraph after the h1 heading in the Origin section
        const originMatch = content.match(/<h1[^>]*>A systems thinker[^<]*<\/h1>\s*<p[^>]*>([\s\S]*?)<\/p>/);
        if (originMatch) {
            // Clean HTML and get text
            aboutText = originMatch[1]
                .replace(/<[^>]+>/g, '') // Remove HTML tags
                .replace(/\s+/g, ' ')     // Normalize whitespace
                .trim();
        }
    } catch (error) {
        console.warn('Could not read About content from about.astro, using fallback');
    }

    return aboutText;
}

// Generate llms.txt
function generateLLMsTxt() {
    // Read site URL from astro.config.mjs
    let siteUrl = 'https://ace139.github.io'; // fallback
    try {
        const configPath = path.join(__dirname, '../astro.config.mjs');
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const siteMatch = configContent.match(/site:\s*['"]([^'"]+)['"]/);
        if (siteMatch) {
            siteUrl = siteMatch[1];
        }
    } catch (error) {
        console.warn('Could not read site URL from astro.config.mjs, using fallback');
    }

    const siteName = 'Soumyo Dey';
    const tagline = 'Tech, AI & data products, and the stories picked up along the way';

    const blogPosts = getBlogPosts();
    const aboutContent = getAboutContent();

    let content = `# ${siteName}

> ${tagline}

## About

${aboutContent}

## Site Structure

- Home: ${siteUrl}/
- Blog: ${siteUrl}/blog
- About: ${siteUrl}/about
- Projects: ${siteUrl}/projects
- Resume: ${siteUrl}/resume

## Recent Blog Posts\n\n`;

    blogPosts.forEach(post => {
        content += `- [${post.title}](${siteUrl}${post.url})\n`;
        if (post.description) {
            content += `  ${post.description}\n`;
        }
    });

    content += `\n## Newsletter

Subscribe to "Stochastic Musings" - Notes on product intuition, engineering systems, and signals from the AI landscape.
- https://stochasticmusings.substack.com/

## Contact

- Email: heysoumyo@gmail.com
- X/Twitter: https://x.com/soumyo
- LinkedIn: https://linkedin.com/in/soumyo-dey
- GitHub: https://github.com/ace139

---

This site is built with Astro, optimized for performance and accessibility. Last updated: ${new Date().toISOString().split('T')[0]}
`;

    return content;
}

// Write to public directory
const llmsTxtContent = generateLLMsTxt();
const publicDir = path.join(__dirname, '../public');
const llmsTxtPath = path.join(publicDir, 'llms.txt');

fs.writeFileSync(llmsTxtPath, llmsTxtContent, 'utf-8');

console.log('✓ Generated llms.txt');
console.log(`  Location: ${llmsTxtPath}`);
