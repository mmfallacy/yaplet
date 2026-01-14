import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchFromGithubApi } from '$lib/server/github.server';
import { normalizeMarkdownFilename } from '$lib/utils';
import matter from 'gray-matter';
import { PostSchema } from '$lib/shared/schema';

export const GET: RequestHandler = async ({ params }) => {
	const id = params.id;
	try {
		const data = await fetchFromGithubApi(`content/standalone/${normalizeMarkdownFilename(id)}`);
		console.log(data);
		const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
		const parsed = matter(decoded);
		const transformed = PostSchema.parse({
			type: 'standalone',
			id,
			...parsed.data,
			content: parsed.content
		});

		return json(transformed);
	} catch {
		return error(500, `Something went wrong fetching post ${id}`);
	}
};
