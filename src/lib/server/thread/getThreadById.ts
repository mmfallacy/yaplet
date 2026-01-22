import { getContent } from '../github/repo';
import type { Result, ThreadWithPreview } from '$lib/shared/types';
import { JSONsafeParse } from '$lib/utils';
import z from 'zod';
import { ThreadSchema } from '$lib/shared/schema';
import { getPostById } from '../post/getPostById';
import { ServiceResultStatus as Status } from '$lib/shared/const';
import { createMemoryCache } from '$lib/server/cache';

const MemoryCache = createMemoryCache<ThreadWithPreview>();

export async function getThreadById(id: string): Promise<Result<ThreadWithPreview, Error>> {
	const basePath = `content/threads/${id}`;

	const entry = MemoryCache.get(id);

	const meta = await getContent(`${basePath}/meta.json`);

	if (meta.status === Status.NOT_MODIFIED && typeof entry !== 'undefined') {
		console.info(`[CACHE HIT] Thread ${id}`);
		return {
			ok: true,
			value: entry
		};
	} else if (meta.status === Status.ERROR) {
		const error = new Error(
			`Failed to get thread meta.json from repository: ${meta?.error.message}`
		);
		console.error(error);
		return {
			ok: false,
			error
		};
	}
	// Else, pass
	console.info(`[CACHE MISS] Thread ${id}`);

	const decoded = Buffer.from(meta.value.content, 'base64').toString('utf-8');
	const parsed = JSONsafeParse(decoded, z.record(z.string(), z.unknown()));
	if (!parsed.ok) return { ok: false, error: parsed.error };

	const transformed = ThreadSchema.safeParse({
		type: 'thread',
		...parsed.value
	});

	if (!transformed.success)
		return {
			ok: false,
			error: transformed.error
		};

	const preview = await getPostById(transformed.data.posts[0], `${basePath}/`);

	if (!preview.ok)
		return {
			ok: false,
			error: new Error(`Failed to get thread preview: ${preview.error}`)
		};

	const withPreview = {
		...transformed.data,
		preview: preview.value
	} satisfies ThreadWithPreview;

	MemoryCache.set(id, withPreview);

	return { ok: true, value: withPreview };
}
