import { getManifest } from '$lib/server/manifest/getManifest';
import { PostSchema } from '$lib/shared/schema';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
import z from 'zod/v4';
import { getContent } from '$lib/server/github/repo';

const QuerySchema = z.object({
	offset: z.coerce.number().int().positive().default(0),
	limit: z.coerce.number().int().positive().optional()
});

export const GET: RequestHandler = async function ({ url }) {
	try {
		const q = QuerySchema.parse(Object.fromEntries(url.searchParams));

		const result = await getManifest(q.offset, q.limit);
		assert(result.ok, 'There was a problem ');
		const manifest = result.value;

		const mapped = manifest.map(async function (entry) {
			switch (entry.type) {
				case 'standalone': {
					const res = await getContent(`content/standalone/${entry.id}.md`);
					assert(res.ok, `Failed to fetch standalone post ${entry.id}`);
					const post = Buffer.from(res.value.content, 'base64').toString();
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
	} catch (err) {
		assert(err instanceof Error, `unexpected error: ${String(err)}`);
		return error(500, err);
	}
};
