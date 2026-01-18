import { getContent } from '../github/repo';
import type { Result, ThreadWithPreview } from '$lib/shared/types';
import { JSONsafeParse } from '$lib/utils';
import z from 'zod';
import { ThreadSchema } from '$lib/shared/schema';
import { getPostById } from '../post/getPostById';

export async function getThreadById(id: string): Promise<Result<ThreadWithPreview, Error>> {
	const basePath = `content/threads/${id}`;

	const meta = await getContent(`${basePath}/meta.json`);
	if (!meta.ok)
		return {
			ok: false,
			error: new Error(`Failed to get thread meta.json from repository: ${meta.error.message}`)
		};

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

	return { ok: true, value: withPreview };
}
