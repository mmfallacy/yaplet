import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { FeedSchema } from '$lib/shared/schema';
import assert from 'node:assert/strict';
import { resolve } from '$app/paths';

export const load: PageServerLoad = async function ({ fetch }) {
	try {
		const res = await fetch(resolve('/api/v1/feed'));

		assert(res.ok, 'Successful Response');

		const data = await res.json();

		console.log(data);

		const feed = FeedSchema.parse(data);

		return {
			feed
		};
	} catch (err) {
		console.error('Feed load error', err);
		throw error(500, 'Failed to load data');
	}
};
