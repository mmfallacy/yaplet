import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import z from 'zod';
import HTTP from 'http-status-codes';
import { getPostByIds } from '$lib/server/post/batchGetPostsById';

const BodySchema = z.array(z.string());

export const POST: RequestHandler = async ({ request }) => {
	const body = BodySchema.safeParse(await request.json());
	if (!body.success) return error(HTTP.BAD_REQUEST, 'Invalid query parameters: ids');
	const ids = body.data;
	try {
		return json(await getPostByIds(ids));
	} catch {
		return error(500, `Something went wrong fetching posts ${ids}`);
	}
};
