import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getThreadById } from '$lib/server/thread/getThreadById';
import assert from 'node:assert/strict';

export const GET: RequestHandler = async ({ params }) => {
	const id = params.id;
	try {
		const res = await getThreadById(id);
		if (!res.ok) assert(false, `Cannot get thread given id ${id}: ${res.error}`);
		return json(res.value);
	} catch (err) {
		console.error(err);
		return error(500, `Something went wrong fetching thread ${id}`);
	}
};
