import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPostById } from '$lib/server/post/getPost';
import z from 'zod';
import HTTP from 'http-status-codes';

const BodySchema = z.array(z.string());

export const POST: RequestHandler = async ({ request }) => {
	const body = BodySchema.safeParse(await request.json());
	if (!body.success) return error(HTTP.BAD_REQUEST, 'Invalid query parameters: ids');
	const ids = body.data;
	console.log(ids);
	try {
		const res = await Promise.allSettled(ids.map((id) => getPostById(id)));

		// Map rejected into Result Error
		const mapped = res.map(function (result) {
			switch (result.status) {
				case 'fulfilled':
					return result.value;
				case 'rejected':
					return { ok: false, error: result.reason };
				default:
					throw new Error('Impossible Case');
			}
		});

		return json(mapped);
	} catch {
		return error(500, `Something went wrong fetching posts ${ids}`);
	}
};
