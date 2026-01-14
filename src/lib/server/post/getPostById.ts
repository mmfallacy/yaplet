import { normalizeMarkdownFilename } from '$lib/utils';
import matter from 'gray-matter';
import { getContent } from '../github/repo';
import { PostSchema } from '$lib/shared/schema';
import type { Post, Result } from '$lib/shared/types';

export async function getPostById(id: string): Promise<Result<Post, Error>> {
	const result = await getContent(`content/standalone/${normalizeMarkdownFilename(id)}`);
	if (!result.ok)
		return {
			ok: false,
			error: new Error(`Failed to get manifest from repository: ${result.error.message}`)
		};

	const decoded = Buffer.from(result.value.content, 'base64').toString('utf-8');
	const parsed = matter(decoded);
	const transformed = PostSchema.safeParse({
		type: 'standalone',
		id,
		...parsed.data,
		content: parsed.content
	});

	if (!transformed.success)
		return {
			ok: false,
			error: new Error(`Cannot transform post into proper schema: ${transformed.error.message}`)
		};

	return { ok: true, value: transformed.data };
}
