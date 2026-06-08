/**
 * Markdown content negotiation for agents.
 *
 * When a request carries `Accept: text/markdown`, serve the pre-generated
 * Markdown sibling of the requested page (built by scripts/generate-markdown.js)
 * with `Content-Type: text/markdown` and an `x-markdown-tokens` estimate.
 * Browsers (which never send that Accept value) keep getting HTML untouched.
 */

/** Whether a request targets an HTML page (vs. a CSS/JS/txt/image asset). */
function isPageRequest(pathname) {
	if (pathname.endsWith("/") || pathname.endsWith(".html")) {
		return true;
	}
	// Treat extensionless paths (e.g. /about) as pages; anything with a
	// non-.html extension (.css, .js, .txt, .xml, .woff2, .png …) is an asset.
	return !pathname.split("/").pop().includes(".");
}

/** Resolve the static asset path that holds the Markdown for a page request. */
function markdownAssetPath(pathname) {
	let p = pathname;
	if (p.endsWith("/")) {
		p += "index.html";
	} else if (!p.endsWith(".html")) {
		p += "/index.html";
	}
	return `${p}.md`;
}

export async function onRequest(context) {
	const { request, next, env } = context;

	if (request.method !== "GET" && request.method !== "HEAD") {
		return next();
	}

	const accept = request.headers.get("Accept") || "";
	if (!accept.includes("text/markdown")) {
		return next();
	}

	const url = new URL(request.url);
	if (!isPageRequest(url.pathname)) {
		return next();
	}

	const mdUrl = new URL(markdownAssetPath(url.pathname), url.origin);

	const assetResponse = await env.ASSETS.fetch(new Request(mdUrl, request));
	// Pages serves a 200 HTML fallback for missing assets, so confirm we got an
	// actual Markdown file (`.md` assets are served as text/markdown) rather than
	// falling back and mislabeling HTML as Markdown.
	const assetType = assetResponse.headers.get("Content-Type") || "";
	if (!(assetResponse.ok && assetType.includes("markdown"))) {
		return next();
	}

	const body = await assetResponse.text();
	const headers = new Headers(assetResponse.headers);
	headers.set("Content-Type", "text/markdown; charset=utf-8");
	headers.set("x-markdown-tokens", String(Math.ceil(body.length / 4)));
	headers.set("Vary", "Accept");

	return new Response(request.method === "HEAD" ? null : body, {
		status: 200,
		headers,
	});
}
