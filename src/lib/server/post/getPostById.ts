import { joinPaths, normalizeMarkdownFilename } from '$lib/utils';
import matter from 'gray-matter';
import { getContent } from '../github/repo';
import { PostSchema } from '$lib/shared/schema';
import type { Post, Result } from '$lib/shared/types';
import { marked } from 'marked';
import { renderer } from '$lib/features/markdown/renderer';
import { processFootnotes } from './processFootnotes';
import { createMemoryCache } from '$lib/server/cache';
import { ServiceResultStatus as Status } from '$lib/shared/const';

const POST_BASE_PATH_DEFAULT = 'content/standalone/';

const MemoryCache = createMemoryCache<Post>();

export async function getPostById(id: string, basePath?: string): Promise<Result<Post, Error>> {
	const resolvedPath = joinPaths(basePath ?? POST_BASE_PATH_DEFAULT, normalizeMarkdownFilename(id));

	const result = await getContent(resolvedPath);

	const entry = MemoryCache.get(id);

	if (result.status === Status.NOT_MODIFIED && typeof entry !== 'undefined') {
		console.info(`[CACHE HIT] Post ${id}`);
		return {
			ok: true,
			value: entry
		};
	} else if (result.status === Status.ERROR) {
		const error = new Error(`Failed to get manifest from repository: ${result?.error.message}`);
		console.error(error);
		return {
			ok: false,
			error
		};
	} // Else, pass
	console.info(`[CACHE MISS] Post ${id}`);

	const decoded = Buffer.from(result.value.content, 'base64').toString('utf-8');
	const parsed = matter(decoded);

	const rendered = await marked.parse(parsed.content, {
		renderer,
		gfm: true,
		breaks: true
	});

	const res = PostSchema.safeParse({
		type: 'standalone',
		id,
		...parsed.data,
		content: rendered
	});

	if (!res.success)
		return {
			ok: false,
			error: new Error(`Cannot transform post into proper schema: ${res.error.message}`)
		};

	const transformed = res.data;

	const [newContent, order] = processFootnotes(
		transformed.content,
		transformed.footnotes,
		transformed.id
	);

	transformed.content = newContent;
	transformed.footnotes_order = order;

	MemoryCache.set(id, transformed);

	return { ok: true, value: transformed };
}
