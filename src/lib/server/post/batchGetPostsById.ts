import type { Post, Result } from '$lib/shared/types';
import { serializeResult } from '$lib/utils';
import { getPostById } from './getPostById';

// Returns an array of Results
export async function getPostsByIds(
	ids: string[],
	basePath?: string
): Promise<Result<Post, Error>[]> {
	const res = await Promise.allSettled(ids.map((id) => getPostById(id, basePath)));
	return res.map(function (result) {
		switch (result.status) {
			case 'fulfilled':
				return serializeResult(result.value);
			case 'rejected':
				return { ok: false, error: result.reason };
			default:
				throw new Error('Impossible Case');
		}
	});
}
