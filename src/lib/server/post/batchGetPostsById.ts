import type { Post, Result } from '$lib/shared/types';
import { getPostById } from './getPostById';

// Returns an array of Results
export async function getPostByIds(ids: string[]): Promise<Result<Post, Error>[]> {
	const res = await Promise.allSettled(ids.map((id) => getPostById(id)));
	return res.map(function (result) {
		switch (result.status) {
			case 'fulfilled':
				return result.value;
			case 'rejected':
				return { ok: false, error: result.reason };
			default:
				throw new Error('Impossible Case');
		}
	});
}
