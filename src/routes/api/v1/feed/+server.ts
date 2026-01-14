import { PostSchema } from '$lib/shared/schema';
import { fetchFromGithubApi } from '$lib/server/github.server';
import { getManifest } from '$lib/server/manifest.server';
import { json, type RequestHandler } from '@sveltejs/kit';
import matter from 'gray-matter';
import z from 'zod/v4';

const QuerySchema = z.object({
	offset: z.coerce.number().int().positive().default(0),
	limit: z.coerce.number().int().positive().optional()
});

export const GET: RequestHandler = async ({ url }) => {
	const q = QuerySchema.parse(Object.fromEntries(url.searchParams));

	const manifest = await getManifest(q.offset, q.limit);

	const mapped = manifest.map(async function (entry) {
		switch (entry.type) {
			case 'standalone': {
				const res = await fetchFromGithubApi(`content/standalone/${entry.id}.md`);
				const post = Buffer.from(res.content, 'base64').toString();
				const processed = matter(post);
				const parsed = PostSchema.parse({
					type: 'standalone',
					id: entry.id,
					content: processed.content,
					...processed.data
				});
				return parsed;
			}
			case 'thread':
				return Promise.reject({
					reason: 'thread',
					id: entry.id
				});
			default:
				throw new Error('unhandled manifest entry type');
		}
	});

	return json(await Promise.allSettled(mapped));
};
