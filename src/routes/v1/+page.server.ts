import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { FeedSchema } from '$lib/shared/schema';
import assert from 'node:assert/strict';
import { resolve } from '$app/paths';

async function loadFeed(f: typeof fetch) {
	try {
		const res = await f(resolve('/api/v1/feed'));

		assert(res.ok, 'Successful Response');

		const data = await res.json();

		const feed = FeedSchema.parse(data);

		return {
			feed
		};
	} catch (err) {
		console.error('Feed load error', err);
		throw error(500, 'Failed to load data');
	}
}

export const load: PageServerLoad = function ({ fetch }) {
	return {
		stream: loadFeed(fetch)
	};
};
