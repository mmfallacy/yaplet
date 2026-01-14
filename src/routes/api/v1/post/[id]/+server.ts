import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPostById } from '$lib/server/post/getPostById';
import assert from 'node:assert/strict';

export const GET: RequestHandler = async ({ params }) => {
	const id = params.id;
	try {
		const res = await getPostById(id);
		assert(res.ok, `Cannot get post given id ${id}`);
		return json(res);
	} catch {
		return error(500, `Something went wrong fetching post ${id}`);
	}
};
